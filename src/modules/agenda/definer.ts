import agenda from "./agenda"
import { ErrorHandlers, Handlers } from "./handlers"
import { TaskOptions } from "./options"
import { Tasks } from "./tasks"
import mainLogger from "../../utils/logger"
import { ConfigController } from "../config"

// Auto reschedule failed jobs

export async function defineAgendaTasks() {
  agenda.on("fail", async (error, job) => {
    const logger = mainLogger.getSubLogger({ name: "AgendaDefiner", prefix: ["onFail"] })
    const { name, data } = job.attrs as { name: Tasks, data: TaskOptions<typeof name> }
    logger.error(`Job "${name}" failed with error: ${error.message} - data: ${JSON.stringify(data)}`)

    // Find the task key from the job name
    const errorHandler = ErrorHandlers[name]
    if (errorHandler) {
      logger.info(`Handling error for job "${name}"`)
      const removeJob = await errorHandler(error, job)
      if (removeJob) {
        logger.info(`Removing job "${name}" from the database`)
        return job.remove()
      }
    }

    try {
      const retryDelay = await ConfigController.getNumberConfig(`delay-retry-${name.replaceAll(" ", "")}`)
      const retryTime = new Date(Date.now() + retryDelay * 1000)
      logger.info(`Rescheduling ${name} in ${retryDelay} seconds - ${retryTime}`)
      await job.schedule(retryTime)
      return job.save()
    } catch (err) {
      logger.warn(`Error while rescheduling job ${name} - ${err.message}`)
    }
    // If the job can't be rescheduled, it will be removed from the database
    return job.remove()
  })

  agenda.on("success", async (job) => {
    const logger = mainLogger.getSubLogger({ name: "AgendaDefiner", prefix: ["onSuccess"] })
    const { name } = job.attrs as { name: Tasks, data: TaskOptions<typeof name> }
    logger.debug(`Job "${name}" succeeded, removing it from the database`)
    await job.remove()
  })

  agenda.define(Tasks.PublishCategory, Handlers.PublishCategory, { concurrency: 20 })
  agenda.define(Tasks.IndexCategory, Handlers.IndexCategory, { concurrency: 2 })
  agenda.define(Tasks.GrabBroadcastStream, Handlers.GrabBroadcastStream, { concurrency: 5 })
  agenda.define(Tasks.ReleaseBroadcast, Handlers.ReleaseBroadcast, { concurrency: 1 })
  agenda.define(Tasks.PublishGroup, Handlers.PublishGroup, { concurrency: 1 })
  agenda.define(Tasks.UpdateCategoryChannelName, Handlers.UpdateCategoryChannelName, { concurrency: 1 })
  agenda.define(Tasks.DeleteBroadcast, Handlers.DeleteBroadcast, { concurrency: 1 })

  agenda.on("error", (error) => {
    const logger = mainLogger.getSubLogger({ name: "AgendaDefiner", prefix: ["onError"] })
    // Print the task name and error message
    logger.error(`Task error: ${error.stack}`)
    logger.error(`Agenda error: ${error.message}`)
  })
}
