import * as NodePropertiesController from "./controller"
import env from "../../config/env"
import mainLogger from "../../utils/logger"
import onExit from "../../utils/onExit"

export { NodePropertiesController }

export { NodePropertiesDocument } from "./model"

onExit(async () => {
  const logger = mainLogger.getSubLogger({ name: "NodeProperties", prefix: [`Node ${env.nodeUuid}`] })
  logger.info("Deleting node properties")
  await NodePropertiesController.deleteNodeProperties()
  logger.info("Node properties deleted")
}, 10)
