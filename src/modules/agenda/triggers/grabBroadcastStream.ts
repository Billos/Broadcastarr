import mainLogger from "../../../utils/logger"
import { BroadcastController } from "../../broadcast"
import { ConfigController } from "../../config"
import { cancel, jobs, schedule } from "../agenda"
import { Tasks } from "../tasks"

export async function grabBroadcastStream(broadcastId: string, streamIndex: number): Promise<void> {
  const broadcast = await BroadcastController.getBroadcast(broadcastId)
  const [existingJob] = await jobs(Tasks.GrabBroadcastStream, { data: { broadcastId } })
  const logger = mainLogger.getSubLogger({ name: "GrabBroadcastStreamTrigger", prefix: ["grabBroadcastStream", `broadcastId ${broadcastId}`, `broadcastName ${broadcast.name}`] })
  if (existingJob) {
    logger.info("Task already scheduled")
    return
  }
  const delay = await ConfigController.getNumberConfig("delay-simple-GrabStream")
  const grabTime = new Date(broadcast.startTime.getTime() - delay * 1000)
  const job = await schedule(grabTime, Tasks.GrabBroadcastStream, { broadcastId: broadcast.id, streamIndex })
  logger.info(`Scheduled for ${job.attrs.nextRunAt}`)
}

export async function renewGrabBroadcastStream(broadcastId: string, streamIndex: number): Promise<void> {
  const broadcast = await BroadcastController.getBroadcast(broadcastId)
  const logger = mainLogger.getSubLogger({ name: "GrabBroadcastStreamTrigger", prefix: ["renewGrabBroadcastStream", `broadcastId ${broadcastId}`, `broadcastName ${broadcast.name}`] })
  const delay = await ConfigController.getNumberConfig("delay-simple-RenewStream")
  logger.info(`Renewing the task in ${delay} seconds`)
  await schedule(`in ${delay} seconds`, Tasks.GrabBroadcastStream, { broadcastId: broadcast.id, streamIndex })
}

export async function cancelGrabBroadcastStream(broadcastId: string): Promise<void> {
  await cancel(Tasks.GrabBroadcastStream, { data: { broadcastId } })
}
