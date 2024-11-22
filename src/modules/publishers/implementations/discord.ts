import { DiscordAPI } from "../../../api/discord"
import mainLogger from "../../../utils/logger"
import { BroadcastController } from "../../broadcast"
import { CategoryDocument } from "../../category"
import { ConfigController } from "../../config"
import MarkdownPublisher from "../markdown"

function splitMessage(messages: string[], maxLength: number): string[] {
  const result: string[] = [""]
  for (const message of messages) {
    const index = result.length - 1
    const currentMessage = result[index] || ""
    const toAdd = `\n${message}`
    if (currentMessage.length + toAdd.length > maxLength) {
      result.push(message)
    } else {
      result[index] += toAdd
    }
  }
  return result
}

type WebhookConfig = { webhookId: string, webhookToken: string }

class DiscordPublisher extends MarkdownPublisher {
  public name = "Discord"

  private async getWebhook(category: string): Promise<WebhookConfig> {
    const id = await ConfigController.getConfig(`discord-webhook-${category}-id`)
    const token = await ConfigController.getConfig(`discord-webhook-${category}-token`)
    return { webhookId: id.value, webhookToken: token.value }
  }

  public async init(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "DiscordPublisher", prefix: ["init"] })
    logger.debug("Nothing to do here")
  }

  public async start(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "DiscordPublisher", prefix: ["start"] })
    logger.debug("Nothing to do here")
  }

  public async clear(category: CategoryDocument): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "DiscordPublisher", prefix: ["clear", `category ${category}`] })
    try {
      const { webhookId, webhookToken } = await this.getWebhook(category.name)
      const channelId = await DiscordAPI.getChannelIdWebhook(webhookId, webhookToken)
      await DiscordAPI.emptyChannel(channelId)
    } catch (error) {
      logger.error(error)
    }
  }

  public override async listMessages(category: CategoryDocument): Promise<string[]> {
    const logger = mainLogger.getSubLogger({ name: "DiscordPublisher", prefix: ["listMessages", `category ${category.name}`] })
    const { webhookId, webhookToken } = await this.getWebhook(category.name)
    const channelId = await DiscordAPI.getChannelIdWebhook(webhookId, webhookToken)
    const messages = await DiscordAPI.getChannelMessages(channelId)
    logger.debug(`Found ${messages.length} messages`)
    return messages
  }

  protected override async sendMessage(category: string, content: string): Promise<string[]> {
    const logger = mainLogger.getSubLogger({ name: "DiscordPublisher", prefix: ["sendMessages", `category ${category}`] })
    const { webhookId, webhookToken } = await this.getWebhook(category)

    const messages = splitMessage(content.split("\n"), 1950)
    const ids = []
    logger.debug(`Sending ${messages.length} messages`)
    for (const message of messages) {
      ids.push(await DiscordAPI.sendDiscordMessage(webhookId, webhookToken, message))
    }
    return ids
  }

  protected async removeMessages(category: string, ids: string[]): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "DiscordPublisher", prefix: ["removeMessages", `category ${category}`] })
    logger.debug(`Deleting the message of category ${category} with ids ${ids}`)
    const { webhookId, webhookToken } = await this.getWebhook(category)
    for (const messageId of ids) {
      await DiscordAPI.deleteWebhookMessage(webhookId, webhookToken, messageId)
    }
  }

  public async updateChannelName(category: CategoryDocument): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "DiscordPublisher", prefix: ["updateChannelName", `category ${category.name}`] })
    const { webhookId, webhookToken } = await this.getWebhook(category.name)

    const channelId = await DiscordAPI.getChannelIdWebhook(webhookId, webhookToken)
    const broadcasts = await BroadcastController.getBroadcastsOfCategory(category.name)
    const broadcastsWithStream = broadcasts.filter((broadcast) => broadcast.streams.length > 0)
    const channelName = `${category.name.toLocaleLowerCase()}-${broadcastsWithStream.length}-stream${broadcastsWithStream.length > 1 ? "s" : ""}`
    logger.info(`Updating the channel name to ${channelName}`)
    await DiscordAPI.updateChannelName(channelId, channelName)
  }
}

export default DiscordPublisher
