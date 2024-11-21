import { Job } from "@hokify/agenda"
import { DateTime } from "luxon"

import mainLogger from "../../../utils/logger"
import { BroadcastController } from "../../broadcast"
import { ConfigController } from "../../config"
import { GroupController } from "../../group"
import { IndexerController } from "../../indexer"
import { DynamicBroadcastsIndexer } from "../../indexers"
import { IndexCategoryOptions } from "../options"
import { Triggers } from "../triggers"

export async function handler(job: Job<IndexCategoryOptions>): Promise<void> {
  const { category, indexerName } = job.attrs.data
  const logger = mainLogger.getSubLogger({ name: "IndexCategoryHandler", prefix: ["handler", `category ${category}`, `indexer ${indexerName}`] })
  const indexerDocument = await IndexerController.getActiveIndexer(indexerName)

  const indexer = new DynamicBroadcastsIndexer(indexerDocument, category)
  const allBroadcasts = await indexer.generate()
  logger.info(`${allBroadcasts.length} broadcasts found`)

  // Filtering
  const futureLimit = await ConfigController.getNumberConfig("filter-limit-future")
  const pastLimit = await ConfigController.getNumberConfig("filter-limit-past")
  const groups = (await GroupController.getActiveGroups(category)).map(({ name }) => name.toLowerCase().trim())
  const now = DateTime.local()
  logger.debug(`${allBroadcasts.length} broadcasts found before filtering`)
  let broadcasts = allBroadcasts
  // Filtering the broadcasts that are started or will start in less than x minutes
  broadcasts = broadcasts.filter(({ startTime }) => (DateTime.fromJSDate(startTime).diff(now, "minutes").minutes) < futureLimit)
  logger.debug(`${broadcasts.length} broadcasts kept after filtering futureLimit`)
  // Filtering the broadcast that did not start more than x minutes ago
  broadcasts = broadcasts.filter(({ startTime }) => (DateTime.fromJSDate(startTime).diff(now, "minutes").minutes) > -pastLimit)
  logger.debug(`${broadcasts.length} broadcasts kept after filtering pastLimit`)
  // Filtering the broadcasts with the groups we want, if groups is empty, we keep all the broadcasts
  broadcasts = broadcasts.filter(({ group }) => groups.length === 0 || groups.includes(group.toLowerCase().trim()))
  logger.debug(`${broadcasts.length} broadcasts kept after filtering groups`)

  for (const broadcast of broadcasts) {
    // If the broadcast already exists, we don't create a new one
    try {
      await BroadcastController.getBroadcastByName(broadcast.name)
      logger.debug(`Broadcast ${broadcast.name} already exists`)
    } catch (error) {
      logger.debug(`Creating broadcast ${broadcast.name}`)
      await BroadcastController.createBroadcast(broadcast)
    }

    const document = await BroadcastController.getBroadcastByName(broadcast.name)
    await Triggers.grabBroadcastStream(document.id, 0)
  }

  // We still need to publish the groups
  for (const { group, country } of broadcasts) {
    await Triggers.publishGroup(group, category, country)
  }

  // We now need to delete the broadcasts that are not in the indexer anymore
  const existing = await BroadcastController.getBroadcastsOfCategory(category)
  const indexerBroadcasts = existing.filter((broadcast) => broadcast.indexer === indexerName)
  const toDelete = indexerBroadcasts.filter(({ name }) => !broadcasts.some((broadcast) => broadcast.name === name))
  logger.info(`${toDelete.length} broadcasts to delete`)
  for (const broadcast of toDelete) {
    await Triggers.deleteBroadcast(broadcast.id)
  }
  await Triggers.renewIndexCategory(category, indexerName)
}
