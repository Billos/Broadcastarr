import mainLogger from "../../../utils/logger"
import { jobs, now } from "../agenda"
import { Tasks } from "../tasks"

export async function publishCategory(category: string): Promise<void> {
  const logger = mainLogger.child({
    name: "PublishCategoryTrigger",
    func: "publishCategory",
    data: {
      category,
    },
  })
  // We create a job to list broadcasts
  logger.debug("Scheduling PublishCategory task")

  // Cancel previous task
  const [existingJob] = await jobs(Tasks.PublishCategory, { data: { category } })
  if (existingJob) {
    logger.debug("Task already scheduled, removing it")
    await existingJob.remove()
  }

  await now(Tasks.PublishCategory, { category })
}
