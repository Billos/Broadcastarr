import express, { Request } from "express"

import { Triggers } from "../../modules/agenda/triggers"
import { CategoryController } from "../../modules/category"
import mainLogger from "../../utils/logger"
import Params from "../types"

const router = express.Router()

const closeWindow = "<script>window.close()</script>"

router.get("/:category/reload", async (req: Request<Pick<Params, "category">>, res) => {
  const logger = mainLogger.child({ name: "API Category", func: "reload" })
  const { category } = req.params
  logger.info(`Reloading broadcasts for ${category}`)
  await CategoryController.reloadCategoryGroups(category)
  res.send(closeWindow)
})

router.get("/:category/channelName", async (req: Request<Pick<Params, "category">>, res) => {
  const logger = mainLogger.child({ name: "API Category", func: "channelName" })
  const { category } = req.params
  logger.info(`Getting channel name for ${category}`)
  await Triggers.updateCategoryChannelName(category)
  res.send(closeWindow)
})

export default router
