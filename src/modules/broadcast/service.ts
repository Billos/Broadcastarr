import { BroadcastDocument, BroadcastModel, BroadcastStream } from "./model"

type BroadcastsFilter = {
  country?: string;
  group?: string;
  category?: string;
  indexer?: string;
}

export async function createBroadcast(broadcast: BroadcastDocument): Promise<BroadcastDocument> {
  const existing = await BroadcastModel.findOne({ name: broadcast.name, group: broadcast.group, country: broadcast.country, category: broadcast.category })
  if (existing) {
    return existing
  }
  return BroadcastModel.create(broadcast)
}

export async function getBroadcast(id: string): Promise<BroadcastDocument> {
  return BroadcastModel.findById(id).orFail()
}

export async function getBroadcastByName(name: string): Promise<BroadcastDocument> {
  return BroadcastModel.findOne({ name }).orFail()
}

export async function getBroadcasts(filters: BroadcastsFilter): Promise<BroadcastDocument[]> {
  return BroadcastModel.find(filters, null, { sort: { startTime: 1 } })
}

export async function setTunerHostId(id: string, tunerHostId: string): Promise<BroadcastDocument> {
  return BroadcastModel.findByIdAndUpdate(id, { tunerHostId })
}

export async function setStream(id: string, stream: BroadcastStream): Promise<BroadcastDocument> {
  return BroadcastModel.findByIdAndUpdate(id, { $set: { streams: [stream] } })
}

export async function setJellyfinId(id: string, jellyfinId: string): Promise<BroadcastDocument> {
  return BroadcastModel.findByIdAndUpdate(id, { jellyfinId })
}

export async function setStreamIndex(id: string, streamIndex: number): Promise<BroadcastDocument> {
  return BroadcastModel.findByIdAndUpdate(id, { streamIndex })
}

export async function removeBroadcast(id: string): Promise<void> {
  return BroadcastModel.findByIdAndDelete(id)
}

export async function deleteBroadcasts(group: string, country: string, category: string): Promise<void> {
  const filters: Partial<BroadcastDocument> = {}
  if (group) {
    filters.group = group
  }
  if (country) {
    filters.country = country
  }
  if (category) {
    filters.category = category
  }
  await BroadcastModel.deleteMany(filters)
}
