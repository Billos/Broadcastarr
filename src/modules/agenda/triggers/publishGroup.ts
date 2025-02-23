import mainLogger from "../../../utils/logger"
import { ConfigController } from "../../config"
import { jobs, schedule } from "../agenda"
import { Tasks } from "../tasks"

export async function publishGroup(group: string, category: string, country: string): Promise<void> {
  const logger = mainLogger.child({
    name: "PublishGroupTrigger",
    func: "publishGroup",
    data: {
      group,
      category,
      country,
    },
  })
  const [existingJob] = await jobs(Tasks.PublishGroup, { data: { category, group, country } })
  const delay = await ConfigController.getNumberConfig("delay-simple-PublishGroup")
  if (!existingJob) {
    logger.info(`No existing job found, scheduling a PublishGroup for category ${category} and group ${group}`)
    await schedule(`in ${delay} seconds`, Tasks.PublishGroup, { group, category, country })
    return
  }
  logger.info(`Rescheduling the one time PublishGroup for category ${category} and group ${group} in ${delay} seconds`)
  await existingJob.schedule(`In ${delay} seconds`)
  await existingJob.save()
}
