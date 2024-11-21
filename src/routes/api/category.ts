import express, { Request } from "express"

import { CategoryController } from "../../modules/category"
import mainLogger from "../../utils/logger"
import Params from "../types"

const router = express.Router()

const closeWindow = "<script>window.close()</script>"

router.get("/:category/reload", async (req: Request<Pick<Params, "category">>, res) => {
  const logger = mainLogger.getSubLogger({ name: "API", prefix: ["Category", "reload"] })
  const { category } = req.params
  logger.info(`Reloading broadcasts for ${category}`)
  await CategoryController.reloadCategoryGroups(category)
  res.send(closeWindow)
})

export default router
