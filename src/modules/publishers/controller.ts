import Discord from "./implementations/discord"
import Matrix from "./implementations/matrix"
import { PublisherDocument } from "./model"
import * as Service from "./service"
import { IPublisher } from "./types"
import mainLogger from "../../utils/logger"
import { BroadcastDocument } from "../broadcast"
import { CategoryDocument } from "../category"
import { GroupDocument } from "../group"

const implementations: Record<string, new () => IPublisher> = {
  Discord,
  Matrix,
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

export async function initPublishers(): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "PublisherController", prefix: ["initPublishers"] })
  logger.info("Initializing publishers")
  const activePublishers = await getActivePublishers()
  for (const doc of activePublishers) {
    const publisher = await getPublisherInstance(doc.name)
    await publisher.init()
  }
}

export async function startPublishers(): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "PublisherController", prefix: ["startPublishers"] })
  logger.info("Starting publishers")
  const activePublishers = await getActivePublishers()
  for (const doc of activePublishers) {
    const publisher = await getPublisherInstance(doc.name)
    await publisher.start()
  }
}

export async function updateChannelName(category: CategoryDocument): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "PublisherController", prefix: ["updateChannelName", `category ${category.name}`] })
  logger.info("Updating channel name")
  const activePublishers = await getActivePublishers()
  for (const doc of activePublishers) {
    const publisher = await getPublisherInstance(doc.name)
    await publisher.updateChannelName(category)
  }
}

// This function returns an object with the publication ids for each publisher
export async function publishCategory(category: CategoryDocument): Promise<Record<string, string[]>> {
  const logger = mainLogger.getSubLogger({ name: "PublisherController", prefix: ["publishCategory", `category ${category.name}`] })
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

export async function publishGroup(group: GroupDocument, broadcasts: BroadcastDocument[]): Promise<Record<string, string[]>> {
  const logger = mainLogger.getSubLogger({ name: "PublisherController", prefix: ["publishGroup", `group ${group.name}`] })
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
  const logger = mainLogger.getSubLogger({ name: "PublisherController", prefix: ["unpublishGroup", `group ${group.name}`] })
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
