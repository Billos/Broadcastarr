import { Job } from "@hokify/agenda"

import mainLogger from "../../../utils/logger"
import { CategoryController } from "../../category"
import { GroupController } from "../../group"
import { IndexerController } from "../../indexer"
import { PublishersController } from "../../publishers"
import { PublishCategoryOptions } from "../options"
import { Triggers } from "../triggers"

export async function handler(job: Job<PublishCategoryOptions>): Promise<void> {
  const { category } = job.attrs.data

  const logger = mainLogger.getSubLogger({ name: "PublishCategoryHandler", prefix: ["handler", `category ${category}`] })

  const categoryDocument = await CategoryController.getCategory(category)

  // Delete the old message if we just created the category
  const ids = await PublishersController.publishCategory(categoryDocument)
  for (const publisher of Object.keys(ids)) {
    await CategoryController.setPublications(category, publisher, ids[publisher])
  }

  // If there was messages already published, we need to republish the groups
  logger.info("Checking if we need to republish the groups")
  const groups = await GroupController.getGroupsOfCategory(category)
  for (const group of groups) {
    const keys = Array.from(group.publications.keys())
    const hasPublications = keys.some((key) => group.publications.get(key)?.length > 0)
    if (hasPublications) {
      logger.info(`Republishing group ${group.name}`)
      await Triggers.publishGroup(group.name, category, group.country)
    }
  }

  // schedule now the UpdateDiscordChannelName task
  logger.info("Scheduling the UpdateDiscordChannelName task for now")
  await Triggers.updateCategoryChannelName(category)

  // Cancel the previous IndexCategory scheduled task and schedule a new one
  logger.info("Scheduling the IndexCategory task")
  // For each BroadcastsIndexers, we start a IndexCategory task
  const indexers = await IndexerController.getIndexers(true)
  for (const indexer of indexers) {
    await Triggers.indexCategory(category, indexer.name)
  }
}
