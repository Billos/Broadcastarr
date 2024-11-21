import express, { Request } from "express"

import { Triggers } from "../../modules/agenda/triggers"
import mainLogger from "../../utils/logger"
import Params from "../types"

const router = express.Router()

const closeWindow = "<script>window.close()</script>"

router.get("/:indexer/category/:category/reload", async (req: Request<Pick<Params, "indexer" | "category">>, res) => {
  const logger = mainLogger.getSubLogger({ name: "API", prefix: ["Indexer", "reload"] })
  const { indexer, category } = req.params
  logger.info(`Updating broadcasts for ${category} with ${indexer}`)
  // Schedule the task
  await Triggers.indexCategory(category, indexer)
  // Return a javascript to close the window
  res.send(closeWindow)
})

export default router
