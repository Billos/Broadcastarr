import mainLogger from "../../utils/logger"
import { BroadcastDocument } from "../broadcast"
import { CategoryDocument } from "../category"
import { GroupDocument } from "../group"
import Discord from "./implementations/discord"
import Gotify from "./implementations/gotify"
import { PublisherDocument } from "./model"
import * as Service from "./service"
import { IPublisher } from "./types"

const implementations: Record<string, new () => IPublisher> = {
  Discord,
  Gotify,
}

const publishers: Record<string, IPublisher> = {}

// Documents functions
export async function getPublisher(name: string): Promise<PublisherDocument> {
  return Service.getPublisher(name)
}

export async function createPublisher(name: string, active: boolean): Promise<PublisherDocument> {
  return Service.createPublisher(name, active)
}

export async function updateActive(name: string, active: boolean): Promise<PublisherDocument> {
  return Service.updatePublisher(name, { active })
}

export async function getActivePublishers(): Promise<PublisherDocument[]> {
  return Service.getPublishers({ active: true })
}

export async function getAllPublishers(): Promise<PublisherDocument[]> {
  return Service.getPublishers({})
}

export async function deletePublisher(name: string): Promise<void> {
  return Service.deletePublisher(name)
}

// Publisher functions
async function getPublisherInstance(name: string): Promise<IPublisher> {
  if (!publishers[name]) {
    const publisher = await getPublisher(name)
    if (!publisher) {
      throw new Error(`Publisher ${name} not found`)
    }
    const Implementation = implementations[name]
    if (!Implementation) {
      throw new Error(`Implementation for ${name} not found`)
    }
    publishers[name] = new Implementation()
  }
  return publishers[name]
}

export async function bootstrapPublishers(): Promise<void> {
  const logger = mainLogger.child({ name: "PublisherController", func: "bootstrapPublishers" })
  logger.info("Bootstrapping publishers")
  const activePublishers = await getActivePublishers()
  for (const doc of activePublishers) {
    const publisher = await getPublisherInstance(doc.name)
    await publisher.bootstrap()
  }
}

export async function startPublishers(): Promise<void> {
  const logger = mainLogger.child({ name: "PublisherController", func: "startPublishers" })
  logger.info("Starting publishers")
  const activePublishers = await getActivePublishers()
  for (const doc of activePublishers) {
    const publisher = await getPublisherInstance(doc.name)
    await publisher.start()
  }
}

export async function updateChannelName(category: CategoryDocument): Promise<void> {
  const logger = mainLogger.child({
    name: "PublisherController",
    func: "updateChannelName",
    data: { category: category.name },
  })
  logger.info("Updating channel name")
  const activePublishers = await getActivePublishers()
  for (const doc of activePublishers) {
    const publisher = await getPublisherInstance(doc.name)
    await publisher.updateChannelName(category)
  }
}

// This function returns an object with the publication ids for each publisher
export async function publishCategory(category: CategoryDocument): Promise<Record<string, string[]>> {
  const logger = mainLogger.child({
    name: "PublisherController",
    func: "publishCategory",
    data: { category: category.name },
  })
  logger.info("Publishing category")
  const result: Record<string, string[]> = {}
  const activePublishers = await getActivePublishers()
  for (const doc of activePublishers) {
    const publisher = await getPublisherInstance(doc.name)
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

export async function publishGroup(
  group: GroupDocument,
  broadcasts: BroadcastDocument[],
): Promise<Record<string, string[]>> {
  const logger = mainLogger.child({
    name: "PublisherController",
    func: "publishGroup",
    data: { group: group.name },
  })
  logger.info("Publishing group")
  const result: Record<string, string[]> = {}
  const activePublishers = await getActivePublishers()
  for (const doc of activePublishers) {
    const publisher = await getPublisherInstance(doc.name)
    result[publisher.name] = []
    // If there is no broadcast, we don't send any message
    if (broadcasts.length > 0) {
      const ids = await publisher.publishGroup(group, broadcasts)
      result[publisher.name] = ids
    }
  }
  return result
}

export async function unpublishGroup(group: GroupDocument): Promise<Record<string, string[]>> {
  const logger = mainLogger.child({
    name: "PublisherController",
    func: "unpublishGroup",
    data: { group: group.name },
  })
  logger.info("Unpublishing group")
  const result: Record<string, string[]> = {}
  const activePublishers = await getActivePublishers()
  for (const doc of activePublishers) {
    const publisher = await getPublisherInstance(doc.name)
    await publisher.unpublishGroup(group)
    result[publisher.name] = []
  }
  return result
}

export async function clearUnlistedMessages(category: CategoryDocument): Promise<void> {
  const activePublishers = await getActivePublishers()
  for (const doc of activePublishers) {
    const publisher = await getPublisherInstance(doc.name)
    await publisher.clearUnlistedMessages(category)
  }
}
