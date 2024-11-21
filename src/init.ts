import mongoose from "mongoose"

import env from "./config/env"
import initiators from "./init/"
import mainLogger from "./utils/logger"

// Print the node version
mainLogger.info(`Node version: ${process.version}`)

// Worker
async function init() {
  const logger = mainLogger.getSubLogger({ name: "Server", prefix: [""] })
  const mongo = await mongoose.connect(`${env.mongo.url}/${env.mongo.db}`, {})
  logger.info(`Mongo is up on ${mongo.connection.host}:${mongo.connection.port}`)
  logger.info("Running initiators")
  for (const initiator of initiators) {
    await initiator.init()
  }

  logger.info("Init done")
  process.exit(0)
}

init()
