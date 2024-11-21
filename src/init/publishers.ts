import Initiator from "./initiator"
import { PublishersController } from "../modules/publishers"
import mainLogger from "../utils/logger"

export default class PublishersInitiator extends Initiator {
  public async init(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "PublishersInitiator", prefix: ["init"] })
    logger.info("Initializing Publishers")

    await PublishersController.initPublishers()
  }
}
