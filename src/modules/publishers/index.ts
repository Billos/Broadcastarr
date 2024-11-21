import { readdirSync } from "fs"
import { join } from "path"

import { IPublisher, isPublisher } from "./types"
import mainLogger from "../../utils/logger"
import { BroadcastDocument } from "../broadcast/model"
import { CategoryDocument } from "../category/model"
import { GroupDocument } from "../group/model"

// This index file will return an array of IPublisher instances.
// The instances are created with the classes found in the ./implementations folder.

// Reading the implementation folder
const publishers: IPublisher[] = []

const files = readdirSync(join(__dirname, "implementations"))
mainLogger.info(`Found ${files.length} publishers: ${files.join(", ")}`)
// Importing the classes
for (const file of files) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires
    const publisher = require(`./implementations/${file}`).default as IPublisher

    // Check if the instance is a valid
    isPublisher(publisher)

    publishers.push(publisher)
  } catch (error) {
    mainLogger.error(`Error importing publisher ${file}`, error)
  }
}

async function initPublishers(): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "PublisherController", prefix: ["initPublishers"] })
  logger.info("Initializing publishers")
  for (const publisher of publishers) {
    await publisher.init()
  }
}

async function startPublishers(): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "PublisherController", prefix: ["startPublishers"] })
  logger.info("Starting publishers")
  for (const publisher of publishers) {
    await publisher.start()
  }
}

async function updateChannelName(category: CategoryDocument): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "PublisherController", prefix: ["updateChannelName", `category ${category.name}`] })
  logger.info("Updating channel name")
  for (const publisher of publishers) {
    await publisher.updateChannelName(category)
  }
}

// This function returns an object with the publication ids for each publisher
async function publishCategory(category: CategoryDocument): Promise<Record<string, string[]>> {
  const logger = mainLogger.getSubLogger({ name: "PublisherController", prefix: ["publishCategory", `category ${category.name}`] })
  logger.info("Publishing category")
  const result: Record<string, string[]> = {}
  for (const publisher of publishers) {
    const publications = category.publications.get(publisher.name) || []
    if (publications.length === 0) {
      await publisher.clear(category)
    }
    // In any case, we publish the category
    const ids = await publisher.publishCategory(category)
    result[publisher.name] = ids
  }
  return result
}

async function publishGroup(group: GroupDocument, broadcasts: BroadcastDocument[]): Promise<Record<string, string[]>> {
  const logger = mainLogger.getSubLogger({ name: "PublisherController", prefix: ["publishGroup", `group ${group.name}`] })
  logger.info("Publishing group")
  const result: Record<string, string[]> = {}
  for (const publisher of publishers) {
    result[publisher.name] = []
    // If there is no broadcast, we don't send any message
    if (broadcasts.length > 0) {
      const ids = await publisher.publishGroup(group, broadcasts)
      result[publisher.name] = ids
    }
  }
  return result
}

async function unpublishGroup(group: GroupDocument): Promise<Record<string, string[]>> {
  const logger = mainLogger.getSubLogger({ name: "PublisherController", prefix: ["unpublishGroup", `group ${group.name}`] })
  logger.info("Unpublishing group")
  const result: Record<string, string[]> = {}
  for (const publisher of publishers) {
    await publisher.unpublishGroup(group)
    result[publisher.name] = []
  }
  return result
}

async function clearUnlistedMessages(category: CategoryDocument): Promise<void> {
  for (const publisher of publishers) {
    await publisher.clearUnlistedMessages(category)
  }
}

const PublishersController = {
  initPublishers,
  startPublishers,
  updateChannelName,
  publishCategory,
  publishGroup,
  unpublishGroup,
  clearUnlistedMessages,
}

// eslint-disable-next-line import/prefer-default-export
export { PublishersController }
