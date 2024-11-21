import { v4 as uuidv4 } from "uuid"

import { UuidDocument, UuidModel } from "./model"

export async function getUUID(): Promise<UuidDocument> {
  // Checking if the uuid is already in the database
  const existingUuid = await UuidModel.findOne()
  if (existingUuid) {
    return existingUuid
  }
  // Create a new uuid
  return UuidModel.create({ uuid: uuidv4() })
}

// Export a function to remove the existing uuid
export async function removeUUID(): Promise<void> {
  await UuidModel.deleteMany()
}
