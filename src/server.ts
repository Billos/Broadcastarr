import mongoose from "mongoose"

import DiscordBot from "./bot/discord"
import env from "./config/env"
import { Triggers } from "./modules/agenda/triggers"
import { CategoryController } from "./modules/category"
import { PublishersController } from "./modules/publishers"
import { UUIDController } from "./modules/uuid"
import router from "./routes"
import mainLogger from "./utils/logger"
import onExit from "./utils/onExit"

// Print the node version
mainLogger.info(`Node version: ${process.version}`)

router.listen(env.port, async () => {
  const logger = mainLogger.getSubLogger({ name: "Server", prefix: [`uuid ${env.nodeUuid}`] })
  logger.info(`Listening on port ${env.port}`)
  // Check if mongo is up
  const mongo = await mongoose.connect(`${env.mongo.url}/${env.mongo.db}`, {})
  logger.info(`Mongo is up on ${mongo.connection.host}:${mongo.connection.port}`)

  if (env.discordBot.active) {
    const bot = new DiscordBot()
    bot.start()
  }

  await PublishersController.startPublishers()

  // Cancel all tasks
  const categories = await CategoryController.getCategories()
  for (const { name } of categories) {
    logger.info(`Scheduling tasks for ${name}`)
    await Triggers.publishCategory(name)
  }
})

onExit(async () => {
  await UUIDController.removeUUID()
})
