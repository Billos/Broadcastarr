import { CategoryDocument, CategoryModel } from "./model"

export async function getCategory(name: string): Promise<CategoryDocument> {
  return CategoryModel.findOne({ name }).orFail()
}

export async function createCategory(name: string): Promise<CategoryDocument> {
  return CategoryModel.create({ name, publications: {} })
}

export async function getCategories(): Promise<CategoryDocument[]> {
  return CategoryModel.find() as Promise<CategoryDocument[]>
}

export async function deleteCategory(name: string): Promise<void> {
  await CategoryModel.findOneAndDelete({ name }).orFail()
}

export async function setDiscordMessageId(name: string, discordMessageId: string): Promise<void> {
  await CategoryModel.updateOne({ name }, { discordMessageId })
}

export async function setEmoji(name: string, emoji: string): Promise<void> {
  await CategoryModel.updateOne({ name }, { emoji })
}

export async function setPublications(name: string, publisher: string, publicationIds: string[]): Promise<void> {
  await CategoryModel.updateOne({ name }, { $set: { [`publications.${publisher}`]: publicationIds } }, { upsert: true })
}
