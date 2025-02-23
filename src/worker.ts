import mongoose from "mongoose"

import env from "./config/env"
import { agenda, defineAgendaTasks } from "./modules/agenda"
import { Triggers } from "./modules/agenda/triggers"
import { ConfigController } from "./modules/config"
import { PublishersController } from "./modules/publishers"
import { UUIDController } from "./modules/uuid"
import { emptyFolder } from "./utils/file"
import mainLogger from "./utils/logger"

// Print the node version
mainLogger.info(`Node version: ${process.version}`)

// Worker
async function worker() {
  const logger = mainLogger.child({ name: "Worker", func: "worker" })
  // Check if mongo is up
  const mongo = await mongoose.connect(`${env.mongo.url}/${env.mongo.db}`, {})
  logger.info(`Mongo is up on ${mongo.connection.host}:${mongo.connection.port}`)

  await defineAgendaTasks()

  // Await UUID generation
  await UUIDController.awaitUUID()

  await PublishersController.startPublishers()
  // Start agenda
  await agenda.start()

  // If we are in dev mode, we can index the dev category right away
  if (env.dev) {
    await agenda.cancel({})
    const { value } = await ConfigController.getConfig("delay-simple-IndexCategory")
    await ConfigController.setConfig("delay-simple-IndexCategory", "0")
    await Triggers.indexCategory(env.devCategory, env.devIndexer)
    await ConfigController.setConfig("delay-simple-IndexCategory", value)
    // Remove all images in /data/images/${filename}.png
    await emptyFolder("/data/images/", "png")
  }
}

worker()
