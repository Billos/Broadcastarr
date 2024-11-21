import { UuidDocument } from "./model"
import * as UUIDService from "./service"
import sleep from "../../utils/sleep"

export async function getUUID(): Promise<UuidDocument> {
  return UUIDService.getUUID()
}

// Export a function to remove the existing uuid
export async function removeUUID(): Promise<void> {
  return UUIDService.removeUUID()
}

export async function awaitUUID(): Promise<void> {
  const uuid = await getUUID()
  if (uuid) {
    return
  }
  await sleep(1000)
  return awaitUUID()
}
