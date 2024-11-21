import { GroupDocument, GroupIndex, GroupModel } from "./model"

export async function createGroup({ category, name, country }: GroupIndex, active: boolean): Promise<GroupDocument> {
  return GroupModel.create({ name, category, active, country })
}

export async function getGroup({ category, name, country }: GroupIndex): Promise<GroupDocument> {
  return GroupModel.findOne({ name, category, country }).orFail()
}

export async function getGroups(query: Partial<GroupDocument>): Promise<GroupDocument[]> {
  return GroupModel.find(query)
}

export async function setPublications({ category, name, country }: GroupIndex, publisher: string, publicationIds: string[]): Promise<void> {
  await GroupModel.findOneAndUpdate({ name, country, category }, { $set: { [`publications.${publisher}`]: publicationIds } }, { upsert: true })
}

export async function setEmoji({ category, name, country }: GroupIndex, emoji: string): Promise<void> {
  await GroupModel.findOneAndUpdate({ name, category, country }, { $set: { emoji } }).orFail()
}

export async function updateActive({ category, name, country }: GroupIndex, active: boolean): Promise<void> {
  await GroupModel.findOneAndUpdate({ name, category, country }, { $set: { active } }).orFail()
}

export async function removeGroup({ category, name, country }: GroupIndex): Promise<void> {
  await GroupModel.findOneAndDelete({ name, category, country }).orFail()
}

export async function deleteGroups(category: string): Promise<void> {
  await GroupModel.deleteMany({ category })
}
