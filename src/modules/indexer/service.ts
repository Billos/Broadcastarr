import {
  IndexerData,
  IndexerDocument,
  IndexerInterceptorData,
  IndexerModel,
} from "./model"

export async function getIndexers(active?: boolean): Promise<IndexerDocument[]> {
  if (active !== undefined) {
    return IndexerModel.find({ active })
  }
  return IndexerModel.find()
}

export async function getIndexer(name: string): Promise<IndexerDocument> {
  return IndexerModel.findOne({ name }).orFail()
}

export async function getActiveIndexer(name: string): Promise<IndexerDocument> {
  return IndexerModel.findOne({ name, active: true }).orFail()
}

export async function createIndexer(name: string, url: string): Promise<IndexerDocument> {
  return IndexerModel.create({ name, url })
}

export async function updateActive(name: string, active: boolean): Promise<IndexerDocument> {
  return IndexerModel.findOneAndUpdate({ name }, { active })
}

export async function updateIndexer(name: string, url: string): Promise<IndexerDocument> {
  return IndexerModel.findOneAndUpdate({ name }, { url })
}

export async function updateIndexerData(name: string, data: Partial<IndexerData>): Promise<IndexerDocument> {
  return IndexerModel.findOneAndUpdate({ name }, { $set: { data } }, { new: true })
}

export async function updateIndexerInterceptorData(name: string, interceptorData: Partial<IndexerInterceptorData>): Promise<IndexerDocument> {
  return IndexerModel.findOneAndUpdate({ name }, { $set: { interceptorData } }, { new: true })
}

export async function deleteIndexer(name: string): Promise<void> {
  await IndexerModel.deleteOne({ name })
}
