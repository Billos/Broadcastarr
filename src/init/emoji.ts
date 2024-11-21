import Initiator from "./initiator"
import { CategoryController } from "../modules/category"
import { GroupController } from "../modules/group"
import getGroupEmoji from "../utils/getEmoji"
import mainLogger from "../utils/logger"

export default class EmojiInitiator extends Initiator {
  public async init(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "EmojiInitiator", prefix: ["init"] })
    logger.info("Initializing emojis for categories")
    // Emojis are stored in process.env.CATEGORIES_EMOJIS as CategoryA:emoji,CategoryB:emoji...
    const emojis = process.env.CATEGORIES_EMOJIS.split(",")
    for (const item of emojis) {
      const [category, emoji] = item.split(":")
      try {
        logger.info(`Setting emoji for category ${category}`)
        await CategoryController.setEmoji(category, emoji)
      } catch (error) {
        logger.warn(`Error while setting emoji for category ${category}`)
      }
    }

    logger.info("Initializing emojis for groups")
    const groups = await GroupController.getAllGroups()
    logger.info(`Found ${groups.length} groups`)
    for (const group of groups) {
      const emoji = getGroupEmoji(group.name)
      // Update the emoji if it's different
      if (emoji) {
        logger.info(`Setting emoji for ${group.name}`)
        await GroupController.setEmoji(group, emoji)
      }
    }
  }
}
