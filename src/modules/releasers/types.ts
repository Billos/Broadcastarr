import { BroadcastDocument } from "../broadcast/model"

export interface IReleaser {
  init(): Promise<void>;
  releaseBroadcast(broadcast: BroadcastDocument): Promise<void>;
  unreleaseBroadcast(broadcast: BroadcastDocument): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isReleaser(instance: any): instance is IReleaser {
  if (typeof instance.init !== "function") {
    throw new Error("Missing or invalid 'init': must be a function.")
  }

  if (typeof instance.releaseBroadcast !== "function") {
    throw new Error("Missing or invalid 'releaseBroadcast': must be a function.")
  }

  if (typeof instance.unreleaseBroadcast !== "function") {
    throw new Error("Missing or invalid 'unreleaseBroadcast': must be a function.")
  }

  return true
}
