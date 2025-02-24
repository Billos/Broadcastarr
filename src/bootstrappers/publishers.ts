import { PublishersController } from "../modules/publishers"
import mainLogger from "../utils/logger"
import { Bootstrapper } from "./bootstrapper"

export class PublishersBootstrapper extends Bootstrapper {
  public async bootstrap(): Promise<void> {
    const logger = mainLogger.child({ name: "PublishersBootstrapper", func: "bootstrap" })

    logger.info("Creating Publishers")
    // check CREATE_PUBLISHER_DISCORD and  CREATE_PUBLISHER_MATRIX
    await PublishersController.deletePublisher("Discord")
    await PublishersController.createPublisher("Discord", process.env.CREATE_PUBLISHER_DISCORD === "true")
    // await PublishersController.deletePublisher("Matrix")
    // await PublishersController.createPublisher("Matrix", process.env.CREATE_PUBLISHER_MATRIX === "true")
    await PublishersController.deletePublisher("Gotify")
    await PublishersController.createPublisher("Gotify", process.env.CREATE_PUBLISHER_GOTIFY === "true")

    logger.info("Bootstrapping Publishers")
    await PublishersController.bootstrapPublishers()
  }
}
