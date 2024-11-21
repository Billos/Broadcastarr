import { GroupDocument, GroupIndex } from "./model"
import * as GroupService from "./service"
import mainLogger from "../../utils/logger"
import { Triggers } from "../agenda/triggers"
import { BroadcastController } from "../broadcast"
import { IndexerController } from "../indexer"

export async function getAllGroups(): Promise<GroupDocument[]> {
  return GroupService.getGroups({})
}

export async function getActiveGroups(category: string): Promise<GroupDocument[]> {
  return GroupService.getGroups({ category, active: true })
}

export async function getInactiveGroups(category: string): Promise<GroupDocument[]> {
  return GroupService.getGroups({ category, active: false })
}

export async function getGroupsOfCategory(category: string): Promise<GroupDocument[]> {
  return GroupService.getGroups({ category })
}

export async function getGroup(group: GroupIndex): Promise<GroupDocument> {
  return GroupService.getGroup(group)
}

export async function setPublications(group: GroupIndex, publisher: string, publications: string[]): Promise<void> {
  return GroupService.setPublications(group, publisher, publications)
}

export async function deleteGroups(category: string): Promise<void> {
  return GroupService.deleteGroups(category)
}

export async function setEmoji(group: GroupIndex, emoji: string): Promise<void> {
  return GroupService.setEmoji(group, emoji)
}

export async function createGroup(group: GroupIndex, active: boolean): Promise<void> {
  await GroupService.createGroup(group, active)
  if (active) {
    const indexers = await IndexerController.getIndexers(true)
    for (const indexer of indexers) {
      await Triggers.indexCategory(group.category, indexer.name)
    }
  }
}

export async function updateActive(group: GroupIndex, active: boolean): Promise<void> {
  await GroupService.updateActive(group, active)

  if (active) {
    const indexers = await IndexerController.getIndexers(true)
    for (const indexer of indexers) {
      await Triggers.indexCategory(group.category, indexer.name)
    }
  } else {
    await Triggers.publishGroup(group.name, group.category, group.country)
  }
}

export async function removeGroup(group: GroupIndex): Promise<void> {
  await BroadcastController.removeBroadcastsOfGroup(group.name, group.category, group.country)
  await GroupService.removeGroup(group)
}

export async function reload(group: GroupIndex): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "GroupController", prefix: ["reload", `name ${group.name}`, `category ${group.category}`] })
  logger.info("Reloading group")
  return Triggers.publishGroup(group.name, group.category, group.country)
}
