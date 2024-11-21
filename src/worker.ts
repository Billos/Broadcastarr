import mongoose from "mongoose"

import env from "./config/env"
import { agenda, defineAgendaTasks } from "./modules/agenda"
import { PublishersController } from "./modules/publishers"
import { UUIDController } from "./modules/uuid"
import mainLogger from "./utils/logger"

// Print the node version
mainLogger.info(`Node version: ${process.version}`)

// Worker
async function worker() {
  const logger = mainLogger.getSubLogger({ name: "Worker", prefix: [""] })
  // Check if mongo is up
  const mongo = await mongoose.connect(`${env.mongo.url}/${env.mongo.db}`, {})
  logger.info(`Mongo is up on ${mongo.connection.host}:${mongo.connection.port}`)

  await defineAgendaTasks()

  // Await UUID generation
  await UUIDController.awaitUUID()

  // Init the publishers initiator
  await PublishersController.startPublishers()
  // Start agenda
  await agenda.start()
}

worker()
