import { BroadcastDocument } from "../broadcast"
import Jellyfin from "./implementations/jellyfin"
import { ReleaserDocument } from "./model"
import * as Service from "./service"
import { IReleaser } from "./types"

const implementations: Record<string, new () => IReleaser> = {
  Jellyfin,
}

const publishers: Record<string, IReleaser> = {}

// Documents functions
export async function getReleaser(name: string): Promise<ReleaserDocument> {
  return Service.getReleaser(name)
}

export async function createReleaser(name: string, active: boolean): Promise<ReleaserDocument> {
  return Service.createReleaser(name, active)
}

export async function updateActive(name: string, active: boolean): Promise<ReleaserDocument> {
  return Service.updateReleaser(name, { active })
}

export async function getActiveReleasers(): Promise<ReleaserDocument[]> {
  return Service.getReleasers({ active: true })
}

export async function getAllReleasers(): Promise<ReleaserDocument[]> {
  return Service.getReleasers({})
}

export async function deleteReleaser(name: string): Promise<void> {
  return Service.deleteReleaser(name)
}

// Releaser functions
async function getReleaserInstance(name: string): Promise<IReleaser> {
  if (!publishers[name]) {
    const releaser = await getReleaser(name)
    if (!releaser) {
      throw new Error(`Releaser ${name} not found`)
    }
    const Implementation = implementations[name]
    if (!Implementation) {
      throw new Error(`Implementation for ${name} not found`)
    }
    publishers[name] = new Implementation()
  }
  return publishers[name]
}

export async function initReleasers(): Promise<void> {
  const releasers = await getAllReleasers()
  for (const doc of releasers) {
    const releaser = await getReleaserInstance(doc.name)
    await releaser.init()
  }
}

export async function releaseBroadcast(broadcast: BroadcastDocument): Promise<void> {
  const releasers = await getAllReleasers()
  for (const doc of releasers) {
    const releaser = await getReleaserInstance(doc.name)
    await releaser.releaseBroadcast(broadcast)
  }
}

export async function unreleaseBroadcast(broadcast: BroadcastDocument): Promise<void> {
  const releasers = await getAllReleasers()
  for (const doc of releasers) {
    const releaser = await getReleaserInstance(doc.name)
    await releaser.unreleaseBroadcast(broadcast)
  }
}
