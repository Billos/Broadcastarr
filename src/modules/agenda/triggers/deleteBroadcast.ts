import mainLogger from "../../../utils/logger"
import { now } from "../agenda"
import { Tasks } from "../tasks"

export async function deleteBroadcast(broadcastId: string): Promise<void> {
  const logger = mainLogger.child({
    name: "DeleteBroadcastTrigger",
    func: "deleteBroadcast",
    data: {
      broadcastId,
    },
  })
  logger.debug("Schedule DeleteBroadcast task for now")
  await now(Tasks.DeleteBroadcast, { broadcastId })
}
