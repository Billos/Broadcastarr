import { BroadcastDocument } from "../broadcast/model"

export interface IReleaser {
  bootstrap(): Promise<void>
  releaseBroadcast(broadcast: BroadcastDocument): Promise<void>
  unreleaseBroadcast(broadcast: BroadcastDocument): Promise<void>
}

export function isReleaser(instance: any): instance is IReleaser {
  if (typeof instance.bootstrap !== "function") {
    throw new Error("Missing or invalid 'bootstrap': must be a function.")
  }

  if (typeof instance.releaseBroadcast !== "function") {
    throw new Error("Missing or invalid 'releaseBroadcast': must be a function.")
  }

  if (typeof instance.unreleaseBroadcast !== "function") {
    throw new Error("Missing or invalid 'unreleaseBroadcast': must be a function.")
  }

  return true
}
