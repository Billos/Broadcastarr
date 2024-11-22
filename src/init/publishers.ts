import Initiator from "./initiator"
import { PublishersController } from "../modules/publishers"
import mainLogger from "../utils/logger"

export default class PublishersInitiator extends Initiator {
  public async init(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "PublishersInitiator", prefix: ["init"] })

    logger.info("Creating Publishers")
    // check CREATE_PUBLISHER_DISCORD and  CREATE_PUBLISHER_MATRIX
    await PublishersController.deletePublisher("Discord")
    await PublishersController.createPublisher("Discord", process.env.CREATE_PUBLISHER_DISCORD === "true")
    await PublishersController.deletePublisher("Matrix")
    await PublishersController.createPublisher("Matrix", process.env.CREATE_PUBLISHER_MATRIX === "true")

    logger.info("Initializing Publishers")
    await PublishersController.initPublishers()
  }
}
