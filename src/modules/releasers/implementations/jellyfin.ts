import { JellyfinAPI } from "../../../api/jellyfin"
import { checkImageExists } from "../../../utils/file"
import mainLogger from "../../../utils/logger"
import { BroadcastController, BroadcastDocument } from "../../broadcast"
import { CategoryController } from "../../category"
import { ConfigController } from "../../config"
import { IReleaser } from "../types"

class JellyfinReleaser implements IReleaser {
  private timeout: NodeJS.Timeout | null = null

  async init(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "JellyfinReleaser", prefix: ["init"] })
    const categories = await CategoryController.getCategories()

    for (const category of categories) {
      logger.info(`Checking the category ${category.name}`)
      // If the collection is not found, we create it
      const collection = await JellyfinAPI.getCollection(category.name)
      if (!collection) {
        logger.info("Creating the Jellyfin collection")
        await JellyfinAPI.createCollection(category.name)
      }
      // We check if the image of the collection exists
      if (await checkImageExists(category.name)) {
        logger.info("Updating the Image")
        await JellyfinAPI.setItemImage(category.name)
      }
    }
  }

  private async scheduleJellyfinRefresh(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "JellyfinReleaser", prefix: ["scheduleJellyfinRefresh"] })
    logger.debug("Scheduling Jellyfin Refresh")
    if (this.timeout) {
      logger.debug("Clearing previous timeout")
      clearTimeout(this.timeout)
    }
    const delay = await ConfigController.getNumberConfig("delay-simple-JellyfinTvRefresh")
    this.timeout = setTimeout(async () => {
      await JellyfinAPI.refreshJellyfinTV()
    }, delay * 1000)
  }

  async releaseBroadcast(broadcast: BroadcastDocument): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "JellyfinReleaser", prefix: ["releaseBroadcast", `broadcastId ${broadcast.id}`, `broadcastName ${broadcast.name}`] })

    const path = await BroadcastController.getM3U8Path(broadcast.id)
    const tuners = await JellyfinAPI.getTvTunerHostsPaths()
    if (!tuners.includes(path)) {
      logger.info("Adding the m3u8 file to the Jellyfin live TV tuners")
      const tunerHostId = await JellyfinAPI.createTunerHost(path)
      await BroadcastController.setTunerHostId(broadcast.id, tunerHostId)
    }

    const collection = await JellyfinAPI.getCollection(broadcast.category)

    // We retrieve the jellyfinId of the broadcast
    logger.info("Retrieving the Jellyfin Id")
    const jellyfinId = await JellyfinAPI.getChannelId(broadcast.displayTitle)
    if (jellyfinId) {
      await BroadcastController.setJellyfinId(broadcast.id, jellyfinId)
      broadcast.jellyfinId = jellyfinId

      // We add the jellyfinId to the collection
      logger.info("Adding the broadcast to the collection")
      await JellyfinAPI.addItemToCollection(collection.Id, broadcast.jellyfinId)
    }

    // We want to refresh the Jellyfin Live TV
    await this.scheduleJellyfinRefresh()
  }

  async unreleaseBroadcast(broadcast: BroadcastDocument): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "JellyfinReleaser", prefix: ["unreleaseBroadcast", `broadcastId ${broadcast.id}`, `broadcastName ${broadcast.name}`] })
    logger.debug("Removing Live TV Tuner Host")
    await JellyfinAPI.removeTunerHost(broadcast.tunerHostId)

    this.scheduleJellyfinRefresh()
  }
}

export default JellyfinReleaser
