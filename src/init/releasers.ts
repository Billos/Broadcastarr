import Initiator from "./initiator"
import { ReleasersController } from "../modules/releasers"
import mainLogger from "../utils/logger"

export default class ReleasersInitiator extends Initiator {
  public async init(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "ReleasersInitiator", prefix: ["init"] })
    logger.info("Initializing Releasers")

    await ReleasersController.deleteReleaser("Jellyfin")
    await ReleasersController.createReleaser("Jellyfin", process.env.CREATE_RELEASER_JELLYFIN === "true")

    await ReleasersController.initReleasers()
  }
}
