import { PublisherDocument, PublisherModel } from "./model"

export async function getPublisher(name: string): Promise<PublisherDocument> {
  return PublisherModel.findOne({ name })
}

export async function createPublisher(name: string, active: boolean): Promise<PublisherDocument> {
  return PublisherModel.create({ name, active })
}

export async function getPublishers(data: { active?: boolean }): Promise<PublisherDocument[]> {
  return PublisherModel.find(data)
}

export async function deletePublisher(name: string): Promise<void> {
  await PublisherModel.deleteOne({ name })
}
