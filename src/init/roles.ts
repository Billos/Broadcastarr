import Initiator from "./initiator"
import { commandGenerators } from "../bot/commands"
import { RoleController } from "../modules/role"
import mainLogger from "../utils/logger"

export default class RolesInitiator extends Initiator {
  public async init(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "RolesInitiator", prefix: ["init"] })

    // Mandatory roles
    const roles = ["admin", "moderator", "user"]
    logger.info("Initializing Roles")

    for (const role of roles) {
      try {
        logger.info(`Asserting that the role ${role} exists`)
        await RoleController.getRole(role)
      } catch (error) {
        logger.warn(`Role ${role} does not exist, creating it`)
        await RoleController.createRole(role, [])
      }
      for (const generator of commandGenerators) {
        const cmd = await generator.generate()
        if (cmd.roles.includes(role)) {
          logger.info(`Adding command ${cmd.data.name} to role ${role}`)
          await RoleController.addAbilities(role, [cmd.data.name])
        }
      }
    }
  }
}
