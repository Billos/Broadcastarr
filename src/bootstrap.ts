import mongoose from "mongoose"

import { bootstrappers } from "./bootstrappers"
import env from "./config/env"
import mainLogger from "./utils/logger"

// Print the node version
mainLogger.info(`Node version: ${process.version}`)

// Worker
async function bootstrap() {
  const logger = mainLogger.getSubLogger({ name: "Server", prefix: [""] })
  const mongo = await mongoose.connect(`${env.mongo.url}/${env.mongo.db}`, {})
  logger.info(`Mongo is up on ${mongo.connection.host}:${mongo.connection.port}`)
  logger.info("Running bootstrappers")
  for (const bootstrapper of bootstrappers) {
    await bootstrapper.bootstrap()
  }

  logger.info("Bootstrapping done")
}

bootstrap()
