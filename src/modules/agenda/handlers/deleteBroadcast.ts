import { Job } from "@hokify/agenda"

import { removeFile } from "../../../utils/file"
import mainLogger from "../../../utils/logger"
import { BroadcastController } from "../../broadcast"
import { ReleasersController } from "../../releasers"
import { DeleteBroadcastOptions } from "../options"
import { Triggers } from "../triggers"

export async function handler(job: Job<DeleteBroadcastOptions>): Promise<void> {
  const { broadcastId } = job.attrs.data
  const broadcast = await BroadcastController.getBroadcast(broadcastId)
  const logger = mainLogger.getSubLogger({ name: "DeleteBroadcastHandler", prefix: ["handler", `broadcastId ${broadcast.id}`, `broadcastName ${broadcast.name}`] })
  const { category, group, country } = broadcast

  // Delete M3U8
  const path = await BroadcastController.getM3U8Path(broadcast.id)
  logger.debug(`Deleting M3U8 file at ${path}`)
  try {
    await removeFile(path)
  } catch (error) {
    logger.warn(`Error while deleting M3U8 file at ${path}`)
  }

  // Cancel GrabBroadcastStream task
  logger.debug("Canceling task that may concern the broadcast")
  await Triggers.cancelGrabBroadcastStream(broadcast.id)
  await Triggers.cancelReleaseBroadcast(broadcast.id)

  // Unrelease the broadcast
  await ReleasersController.unreleaseBroadcast(broadcast)

  // Delete broadcast
  logger.debug("Deleting broadcast from the database")
  await BroadcastController.removeBroadcast(broadcastId)

  // Check the remaining broadcasts
  logger.debug("Updating the group message")
  await Triggers.publishGroup(group, category, country)
}
