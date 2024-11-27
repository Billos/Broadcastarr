import { ReleasersController } from "../modules/releasers"
import mainLogger from "../utils/logger"
import { Bootstrapper } from "./bootstrapper"

export class ReleasersBootstrapper extends Bootstrapper {
  public async bootstrap(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "ReleasersBootstrapper", prefix: ["bootstrap"] })
    logger.info("Bootstrapping Releasers")

    await ReleasersController.deleteReleaser("Jellyfin")
    await ReleasersController.createReleaser("Jellyfin", process.env.CREATE_RELEASER_JELLYFIN === "true")

    await ReleasersController.bootstrapReleasers()
  }
}
