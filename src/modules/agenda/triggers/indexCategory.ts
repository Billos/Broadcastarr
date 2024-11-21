import mainLogger from "../../../utils/logger"
import { ConfigController } from "../../config"
import { cancel, schedule } from "../agenda"
import { Tasks } from "../tasks"

export async function cancelIndexCategory(category: string, indexerName: string): Promise<void> {
  await cancel(Tasks.IndexCategory, { data: { category, indexerName } })
}

export async function indexCategory(category: string, indexerName: string): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "IndexCategoryTrigger", prefix: ["indexCategory", `category ${category}`, `indexerName ${indexerName}`] })
  const delay = await ConfigController.getNumberConfig("delay-simple-IndexCategory")
  // Getting the existing job that does not have a repeatInterval value

  logger.info("Cancelling existing jobs")
  await cancelIndexCategory(category, indexerName)

  // We reschedule the job to be run now
  logger.info(`Scheduling a IndexCategory for category ${category} and indexer ${indexerName} in ${delay} seconds`)
  await schedule(`in ${delay} seconds`, Tasks.IndexCategory, { category, indexerName })
}

export async function renewIndexCategory(category: string, indexerName: string): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "IndexCategoryTrigger", prefix: ["renewIndexCategory", `category ${category}`, `indexerName ${indexerName}`] })
  const delay = await ConfigController.getNumberConfig("delay-regular-IndexCategory")
  logger.info(`Renewing the task in ${delay / 60} minutes`)
  const job = await schedule(`in ${delay / 60} minutes`, Tasks.IndexCategory, { category, indexerName })
  logger.info(`Task renewed, nextRunAt: ${job.attrs.nextRunAt}`)
}
