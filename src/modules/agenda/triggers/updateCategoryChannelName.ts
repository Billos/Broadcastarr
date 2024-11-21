import mainLogger from "../../../utils/logger"
import { ConfigController } from "../../config"
import { jobs, schedule } from "../agenda"
import { Tasks } from "../tasks"

export async function updateCategoryChannelName(category: string): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "UpdateCategoryChannelNameTrigger", prefix: ["updateCategoryChannelName", `category ${category}`] })
  const [existingJob] = await jobs(Tasks.UpdateCategoryChannelName, { data: { category } })
  const delay = await ConfigController.getNumberConfig("delay-simple-UpdateCategoryChannelName")
  if (existingJob) {
    logger.debug(`Task already scheduled, updating nextRunAt in ${delay} seconds`)
    existingJob.attrs.nextRunAt = new Date(Date.now() + delay * 1000)
    await existingJob.save()
    return
  }

  logger.debug(`Scheduling task in ${delay} seconds`)
  await schedule(`in ${delay} seconds`, Tasks.UpdateCategoryChannelName, { category })
}
