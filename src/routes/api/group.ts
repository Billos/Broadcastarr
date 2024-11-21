import express, { Request } from "express"

import { GroupController } from "../../modules/group"
import { PublishersController } from "../../modules/publishers"
import mainLogger from "../../utils/logger"
import Params from "../types"

const router = express.Router()

const closeWindow = "<script>window.close()</script>"

// Add Group
router.get("/:group/:country/category/:category/add", async (req: Request<Pick<Params, "category" | "group" | "country">>, res) => {
  const logger = mainLogger.getSubLogger({ name: "API", prefix: ["Group", "Add"] })
  const { category, group, country } = req.params
  logger.info(`Adding group ${group} to category ${category}`)
  await GroupController.createGroup({ name: group, category, country }, true)
  res.send(closeWindow)
})

// Remove Group
router.get("/:group/:country/category/:category/remove", async (req: Request<Pick<Params, "category" | "group" | "country">>, res) => {
  const logger = mainLogger.getSubLogger({ name: "API", prefix: ["Group", "Remove"] })
  const { category, group, country } = req.params
  logger.info(`Removing group ${group} from category ${category}`)
  const groupDocument = await GroupController.getGroup({ name: group, category, country })
  await PublishersController.unpublishGroup(groupDocument)
  await GroupController.removeGroup({ name: group, category, country })
  res.send(closeWindow)
})

router.get("/:group/:country/category/:category/reload", async (req: Request<Pick<Params, "group" | "category" | "country">>, res) => {
  const logger = mainLogger.getSubLogger({ name: "API", prefix: ["Group", "Update"] })
  const { group, category, country } = req.params
  logger.info(`Reload broadcasts for group ${group}`)
  // Schedule the task
  await GroupController.reload({ name: group, category, country })
  res.send(closeWindow)
})

export default router
