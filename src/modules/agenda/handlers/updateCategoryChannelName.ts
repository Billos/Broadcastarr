import { Job } from "@hokify/agenda"

import mainLogger from "../../../utils/logger"
import { CategoryController } from "../../category"
import { PublishersController } from "../../publishers"
import { UpdateCategoryChannelNameOptions } from "../options"

export async function handler(job: Job<UpdateCategoryChannelNameOptions>): Promise<void> {
  const { category } = job.attrs.data
  const logger = mainLogger.getSubLogger({ name: "UpdateCategoryChannelNameHandler", prefix: ["handler", `category ${category}`] })

  logger.debug("Updating the category channel name")
  const categoryDocument = await CategoryController.getCategory(category)
  await PublishersController.updateChannelName(categoryDocument)

  logger.debug("Clearing the unlisted messages")
  await PublishersController.clearUnlistedMessages(categoryDocument)
}
