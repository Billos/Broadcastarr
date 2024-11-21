import { CategoryDocument } from "./model"
import * as CategoryService from "./service"
import { Triggers } from "../agenda/triggers"
import { BroadcastController } from "../broadcast"
import { GroupController } from "../group"

export async function reloadCategoryGroups(category: string): Promise<void> {
  const groups = await GroupController.getActiveGroups(category)
  for (const group of groups) {
    // If the group has broadcasts, we publish it
    const broadcasts = await BroadcastController.getBroadcastsOfGroup(group.country, group.name, category)
    if (broadcasts.length > 0) {
      await Triggers.publishGroup(group.name, category, group.country)
    }
  }
}

export async function getCategory(name: string): Promise<CategoryDocument> {
  return CategoryService.getCategory(name)
}

export async function createCategory(name: string): Promise<CategoryDocument> {
  return CategoryService.createCategory(name)
}

export async function getCategories(): Promise<CategoryDocument[]> {
  return CategoryService.getCategories()
}

export async function setEmoji(name: string, emoji: string): Promise<void> {
  return CategoryService.setEmoji(name, emoji)
}

export async function setPublications(name: string, publisher: string, publicationIds: string[]): Promise<void> {
  return CategoryService.setPublications(name, publisher, publicationIds)
}

export async function deleteCategory(name: string): Promise<void> {
  await CategoryService.deleteCategory(name)
  await GroupController.deleteGroups(name)
  await BroadcastController.removeBroadcastsOfCategory(name)
}
