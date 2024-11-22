import { ReleaserDocument, ReleaserModel } from "./model"

export async function getReleaser(name: string): Promise<ReleaserDocument> {
  return ReleaserModel.findOne({ name })
}

export async function createReleaser(name: string, active: boolean): Promise<ReleaserDocument> {
  return ReleaserModel.create({ name, active })
}

export async function getReleasers(data: { active?: boolean }): Promise<ReleaserDocument[]> {
  return ReleaserModel.find(data)
}

export async function deleteReleaser(name: string): Promise<void> {
  await ReleaserModel.deleteOne({ name })
}

export async function updateReleaser(name: string, data: Partial<ReleaserDocument>): Promise<ReleaserDocument> {
  return ReleaserModel.findOneAndUpdate({ name }, data, { new: true })
}
