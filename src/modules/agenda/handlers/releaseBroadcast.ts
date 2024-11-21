import { Job } from "@hokify/agenda"

import mainLogger from "../../../utils/logger"
import { BroadcastController } from "../../broadcast"
import { ReleasersController } from "../../releasers"
import { ReleaseBroadcastOptions } from "../options"
import { Triggers } from "../triggers"

export async function handler(job: Job<ReleaseBroadcastOptions>): Promise<void> {
  const { broadcastId } = job.attrs.data
  const broadcast = await BroadcastController.getBroadcast(broadcastId)
  const logger = mainLogger.getSubLogger({ name: "ReleaseBroadcastHandler", prefix: ["handler", `broadcastId ${broadcast.id}`, `broadcastName ${broadcast.name}`] })

  logger.debug("Releasing the broadcast")
  await ReleasersController.releaseBroadcast(broadcast)

  // We update the Discord message of the broadcast
  logger.debug("Republishing the broadcast")
  await Triggers.publishGroup(broadcast.group, broadcast.category, broadcast.country)
}
