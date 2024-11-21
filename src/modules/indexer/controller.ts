import { IndexerData, IndexerDocument, IndexerInterceptorData } from "./model"
import * as IndexerService from "./service"

export async function getIndexers(active?: boolean): Promise<IndexerDocument[]> {
  return IndexerService.getIndexers(active)
}

export async function getIndexer(name: string): Promise<IndexerDocument> {
  return IndexerService.getIndexer(name)
}

export async function getActiveIndexer(name: string): Promise<IndexerDocument> {
  return IndexerService.getActiveIndexer(name)
}

export async function createIndexer(name: string, url: string): Promise<IndexerDocument> {
  return IndexerService.createIndexer(name, url)
}

export async function updateActive(name: string, active: boolean): Promise<IndexerDocument> {
  return IndexerService.updateActive(name, active)
}

export async function updateIndexer(name: string, url: string): Promise<IndexerDocument> {
  return IndexerService.updateIndexer(name, url)
}

export async function updateIndexerData(name: string, data: Partial<IndexerData>): Promise<IndexerDocument> {
  return IndexerService.updateIndexerData(name, data)
}

export async function updateIndexerInterceptorData(name: string, interceptorData: Partial<IndexerInterceptorData>): Promise<IndexerDocument> {
  return IndexerService.updateIndexerInterceptorData(name, interceptorData)
}

export async function deleteIndexer(name: string): Promise<void> {
  return IndexerService.deleteIndexer(name)
}
