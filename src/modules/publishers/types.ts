import mainLogger from "../../utils/logger"
import { BroadcastDocument } from "../broadcast/model"
import { CategoryDocument } from "../category"
import { GroupController } from "../group"
import { GroupDocument } from "../group/model"

export interface IPublisher {
  name: string
  // Defined in the implementation
  bootstrap(): Promise<void>
  start(): Promise<void>
  clear(category: CategoryDocument): Promise<void>
  listMessages(category: CategoryDocument): Promise<string[]>
  // Defined in the abstract class
  publishCategory(category: CategoryDocument): Promise<string[]>
  publishGroup(Group: GroupDocument, docs: BroadcastDocument[]): Promise<string[]>
  unpublishGroup(Group: GroupDocument): Promise<void>
  updateChannelName(category: CategoryDocument): Promise<void>
  clearUnlistedMessages(category: CategoryDocument): Promise<void>
}

export function isPublisher(instance: any): instance is IPublisher {
  if (typeof instance.name !== "string") {
    throw new Error("Missing or invalid 'name': must be a string")
  }

  if (typeof instance.bootstrap !== "function") {
    throw new Error("Missing or invalid 'bootstrap': must be a function.")
  }

  if (typeof instance.start !== "function") {
    throw new Error("Missing or invalid 'start': must be a function.")
  }

  if (typeof instance.clear !== "function") {
    throw new Error("Missing or invalid 'clear': must be a function.")
  }

  if (typeof instance.publishCategory !== "function") {
    throw new Error("Missing or invalid 'publishCategory': must be a function.")
  }

  if (typeof instance.publishGroup !== "function") {
    throw new Error("Missing or invalid 'publishGroup': must be a function.")
  }

  if (typeof instance.unpublishGroup !== "function") {
    throw new Error("Missing or invalid 'unpublishGroup': must be a function.")
  }

  if (typeof instance.updateChannelName !== "function") {
    throw new Error("Missing or invalid 'updateChannelName': must be a function.")
  }

  return true
}

export abstract class Publisher implements IPublisher {
  public abstract name: string

  // Defined in the implementation
  public abstract bootstrap(): Promise<void>

  public abstract start(): Promise<void>

  public abstract clear(category: CategoryDocument): Promise<void>

  public abstract listMessages(category: CategoryDocument): Promise<string[]>

  protected abstract sendCategoryMessages(category: CategoryDocument): Promise<string[]>

  protected abstract sendGroupMessages(Group: GroupDocument, docs: BroadcastDocument[]): Promise<string[]>

  protected abstract removeMessages(category: string, messageIds: string[]): Promise<void>

  // Defined in the abstract class
  // Cannot be overridden
  public async publishGroup(group: GroupDocument, docs: BroadcastDocument[]): Promise<string[]> {
    const logger = mainLogger.child({
      name: "Publisher",
      func: "publishGroup",
      data: {
        group: group.name,
        category: group.category,
      },
    })
    logger.debug("Publishing the group")
    const ids = await this.sendGroupMessages(group, docs)
    return ids
  }

  public async unpublishGroup(group: GroupDocument): Promise<void> {
    const logger = mainLogger.child({
      name: "Publisher",
      func: "unpublishGroup",
      data: {
        group: group.name,
        category: group.category,
      },
    })
    logger.debug("Unpublishing the group")
    await this.removeMessages(group.category, group.publications.get(this.name) || [])
  }

  public async publishCategory(category: CategoryDocument): Promise<string[]> {
    const logger = mainLogger.child({
      name: "Publisher",
      func: "publishCategory",
      data: { category: category.name },
    })
    logger.debug("Publishing the category")

    // Publishing a category means that we send a message to the channel, but there could be previous messages existing.
    // We need to remove them.
    const previousPublications = category.publications.get(this.name) || []
    if (previousPublications.length === 0) {
      logger.debug("Removing the previous category messages")
      await this.clear(category)
    }
    for (const publication of previousPublications) {
      try {
        await this.removeMessages(category.name, [publication])
      } catch (error) {
        logger.warn(`Failed to remove message with ID ${publication}. Error: ${error}`)
      }
    }
    return this.sendCategoryMessages(category)
  }

  public async clearUnlistedMessages(category: CategoryDocument): Promise<void> {
    const logger = mainLogger.child({
      name: "Publisher",
      func: "clearUnlistedMessages",
      data: { category: category.name },
    })
    logger.debug("Clearing the unlisted messages")
    const categoryPublications = category.publications.get(this.name) || []
    const groups = await GroupController.getGroupsOfCategory(category.name)
    const groupsPublications = groups.flatMap((group) => group.publications.get(this.name) || [])
    const publications = new Set([...categoryPublications, ...groupsPublications])
    const messages = await this.listMessages(category)
    const messagesToDelete = messages.filter((message) => !publications.has(message))
    logger.debug(`Deleting ${messagesToDelete.length} messages`)
    await this.removeMessages(category.name, messagesToDelete)
  }

  public abstract updateChannelName(category: CategoryDocument): Promise<void>
}
