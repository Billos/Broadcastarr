import {
  ClientEvent,
  EventType,
  MatrixClient,
  Room,
  SyncState,
  Visibility,
  createClient,
} from "matrix-js-sdk"
import { logger as matrixLogger } from "matrix-js-sdk/lib/logger"
import { Converter } from "showdown"

import env from "../../../config/env"
import mainLogger from "../../../utils/logger"
import sleep from "../../../utils/sleep"
import { CategoryController, CategoryDocument } from "../../category"
import MarkdownPublisher from "../markdown"

class MatrixPublisher extends MarkdownPublisher {
  public name = "Matrix"

  private client: MatrixClient

  // Record Category => RoomId
  private rooms: Record<string, string> = {}

  private async syncClient(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "MatrixPublisher", prefix: ["syncClient"] })
    matrixLogger.disableAll()
    logger.info("Syncing the client")
    this.client = createClient({
      baseUrl: env.publishers.matrix.url,
      userId: env.publishers.matrix.user,
      accessToken: env.publishers.matrix.accessToken,
    })
    await this.client.startClient({ initialSyncLimit: 100 })
    await this.awaitSync()
    logger.info("Matrix is synced")
  }

  public async init(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "MatrixPublisher", prefix: ["init"] })
    logger.info("Initializing Matrix bot")
    await this.syncClient()

    // Get the existing categories
    const categories = await CategoryController.getCategories()
    // Parrallelize the creation of the rooms
    for (const category of categories) {
      // await Promise.all(categories.map(async ({ name }) => {
      logger.info(`Checking room for ${category.name}`)
      await this.createRoom(category)
      await this.setPowerLevels(category.name)
      await sleep(300)
    }
  }

  public async start(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "MatrixPublisher", prefix: ["start"] })
    logger.info("Starting the Matrix publisher")
    await this.syncClient()

    const categories = await CategoryController.getCategories()
    for (const category of categories) {
      logger.info(`Checking room for ${category.name}`)
      await this.createRoom(category)
      await sleep(300)
    }
  }

  private async awaitSync(): Promise<void> {
    if (this.client.getSyncState() === SyncState.Syncing) {
      return
    }
    return new Promise((resolve) => {
      this.client.once(ClientEvent.Sync, () => resolve())
    })
  }

  public async clear(category: CategoryDocument): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "MatrixPublisher", prefix: ["clear", `category ${category}`] })
    // Iterate over all timeline events

    const events = await this.listMessages(category)
    const roomId = this.rooms[category.name]
    for (const event of events) {
      // Redact the event
      try {
        await this.client.redactEvent(roomId, event, undefined, "Redacting all previous messages.")
        await sleep(300)
        logger.info(`Redacted event with ID: ${event}`)
      } catch (error) {
        logger.error(`Failed to redact event with ID: ${event}. Error: ${error}`)
      }
    }
  }

  public async listMessages(category: CategoryDocument): Promise<string[]> {
    const room = this.getRoom(category.name)

    // Iterate over all timeline events
    const events = room.getLiveTimeline().getEvents()
    const messages = events.filter((event) => event.getType() === "m.room.message" && !event.isRedacted())
    return messages.map((message) => message.getId())
  }

  private getRoom(name: string): Room {
    const roomId = this.rooms[name]
    const room = this.client.getRoom(roomId)
    if (!room) {
      throw new Error(`Room with ID ${roomId} not found.`)
    }
    return room
  }

  protected async sendMessage(category: string, content: string): Promise<string[]> {
    const roomId = this.rooms[category]
    const logger = mainLogger.getSubLogger({ name: "MatrixPublisher", prefix: ["sendMessage", `category ${category}`, `room ${roomId}`] })
    logger.info("Sending the message")
    // Send the message as markdown
    const htmlMessage = new Converter().makeHtml(content)
    const msg = await this.client.sendHtmlMessage(roomId, content, htmlMessage)
    return [msg.event_id]
  }

  protected async removeMessages(category: string, messageIds: string[]): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "MatrixPublisher", prefix: ["removeMessages", `category ${category}`] })
    const roomId = this.rooms[category]
    for (const messageId of messageIds) {
      await sleep(200)
      try {
        await this.client.redactEvent(roomId, messageId)
      } catch (error) {
        logger.error(`Error while removing message ${messageId}`)
      }
    }
  }

  public async updateChannelName(category: CategoryDocument): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "MatrixPublisher", prefix: ["updateChannelName", `category ${category.name}`] })
    logger.debug("Not updating the channel name for Matrix")
    // const broadcasts = await BroadcastController.getBroadcastsOfCategory(category.name)
    // const broadcastsWithStream = broadcasts.filter((broadcast) => broadcast.streams.length > 0)
    // const channelName = `${category.name.toLocaleLowerCase()}-${broadcastsWithStream.length}-stream${broadcastsWithStream.length > 1 ? "s" : ""}`
    // logger.info(`Updating the channel name to ${channelName}`)
    // await this.client.setRoomName(this.rooms[category.name], `${category.name.toLocaleLowerCase()}-streams`)
  }

  private async setPowerLevels(roomName: string) {
    const logger = mainLogger.getSubLogger({ name: "MatrixPublisher", prefix: ["setPowerLevels", `room ${roomName}`] })
    logger.info("Setting power levels")
    const roomId = this.rooms[roomName]
    const users: { [userId: string]: number } = { [env.publishers.matrix.user]: 100 }
    for (const admin of env.publishers.matrix.additionalAdmins) {
      users[admin] = 100
    }

    const power = {
      ban: 50,
      events: { "m.room.message": 100 },
      events_default: 0,
      invite: 50,
      kick: 50,
      redact: 50,
      state_default: 50,
      users,
      users_default: 0,
    }
    logger.info(`Send the power levels to room ${roomId}`)
    // Sleep to avoid rate limiting
    await sleep(200)

    let powerSent = false
    while (!powerSent) {
      try {
        await this.client.sendStateEvent(roomId, EventType.RoomPowerLevels, power)
        powerSent = true
      } catch (error) {
        logger.error("Error while sending power levels")
        await sleep(500)
      }
    }
  }

  private async createRoom(category: CategoryDocument): Promise<void> {
    const roomAlias = `#scrapper-${category.name}:${env.publishers.matrix.serverName}`
    const logger = mainLogger.getSubLogger({ name: "MatrixPublisher", prefix: ["createRoom", `alias ${roomAlias}`] })
    // Checking if the room already exists
    logger.info("Checking if the room already exists")

    try {
      const { room_id: roomId } = await this.client.getRoomIdForAlias(roomAlias)
      logger.info("Room already exists")
      this.rooms[category.name] = roomId
    } catch (error) {
      logger.info("Room does not exist")
      // Create the room
      logger.info(`Creating the room - name ${roomAlias} - alias ${roomAlias}`)
      const name = `scrapper-${category}`
      const { room_id: roomId } = await this.client.createRoom({
        name,
        topic: ` for ${category}`,
        visibility: Visibility.Public,
        room_alias_name: name,
      })
      // Join the room
      this.rooms[category.name] = roomId

      logger.info("Joining the room")
      await this.client.joinRoom(roomId)
    }
  }
}

export default MatrixPublisher
