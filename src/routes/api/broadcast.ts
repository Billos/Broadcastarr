import { Job } from "@hokify/agenda"
import express, { Request } from "express"

import { jobs } from "../../modules/agenda/agenda"
import { GrabBroadcastStreamOptions } from "../../modules/agenda/options"
import { Tasks } from "../../modules/agenda/tasks"
import mainLogger from "../../utils/logger"
import Params from "../types"

const router = express.Router()

const closeWindow = "<script>window.close()</script>"

router.use("/:broadcastId", async (req: Request<Pick<Params, "broadcastId">>, res, next) => {
  const logger = mainLogger.getSubLogger({ name: "API", prefix: ["Broadcast", "Middleware"] })
  const { broadcastId } = req.params
  logger.info(`Checking for job for ${broadcastId}`)
  const [existingJob] = await jobs(Tasks.GrabBroadcastStream, { data: { broadcastId } })
  if (!existingJob) {
    res.status(404).send(`No job found for ${broadcastId}`)
    return
  }
  res.locals.broadcastJob = existingJob
  return next()
})

router.get("/:broadcastId/nextStream", async (req: Request<Pick<Params, "broadcastId">>, res) => {
  const logger = mainLogger.getSubLogger({ name: "API", prefix: ["Broadcast", "NextStream"] })
  logger.info(`Next stream for ${req.params.broadcastId}`)
  const existingJob = res.locals.broadcastJob as Job<GrabBroadcastStreamOptions>
  // Increment the current streamIndex
  existingJob.attrs.data.streamIndex++
  existingJob.schedule("now")
  await existingJob.save()

  res.send(closeWindow)
})

router.get("/:broadcastId/askForStreamNow", async (req: Request<Pick<Params, "broadcastId">>, res) => {
  const logger = mainLogger.getSubLogger({ name: "API", prefix: ["Broadcast", "AskForStreamNow"] })
  logger.info(`Asking for stream now for ${req.params.broadcastId}`)
  const existingJob = res.locals.broadcastJob as Job<GrabBroadcastStreamOptions>
  existingJob.schedule("now")
  await existingJob.save()
  res.send(closeWindow)
})

router.get("/:broadcastId/resetStreamIndex", async (req: Request<Pick<Params, "broadcastId">>, res) => {
  const logger = mainLogger.getSubLogger({ name: "API", prefix: ["Broadcast", "ResetStreamIndex"] })
  logger.info(`Resetting streamIndex for ${req.params.broadcastId}`)
  const existingJob = res.locals.broadcastJob as Job<GrabBroadcastStreamOptions>
  existingJob.attrs.data.streamIndex = 0
  existingJob.schedule("now")
  await existingJob.save()

  res.send(closeWindow)
})

export default router
