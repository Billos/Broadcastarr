import mainLogger from "../../../utils/logger"
import { cancel, now } from "../agenda"
import { Tasks } from "../tasks"

export async function releaseBroadcast(broadcastId: string): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "ReleaseBroadcastTrigger", prefix: ["releaseBroadcast", `broadcastId ${broadcastId}`] })
  logger.debug("Schedule ReleaseBroadcast task for now")
  await now(Tasks.ReleaseBroadcast, { broadcastId })
}

export async function cancelReleaseBroadcast(broadcastId: string): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "ReleaseBroadcastTrigger", prefix: ["cancelReleaseBroadcast", `broadcastId ${broadcastId}`] })
  logger.debug("Cancel ReleaseBroadcast task")
  await cancel(Tasks.ReleaseBroadcast, { data: { broadcastId } })
}
