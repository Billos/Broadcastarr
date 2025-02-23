import { commandGenerators } from "../bot/commands"
import { RoleController } from "../modules/role"
import mainLogger from "../utils/logger"
import { Bootstrapper } from "./bootstrapper"

export class RolesBootstrapper extends Bootstrapper {
  public async bootstrap(): Promise<void> {
    const logger = mainLogger.child({ name: "RolesBootstrapper", func: "bootstrap" })

    // Mandatory roles
    const roles = [
      "admin",
      "moderator",
      "user",
    ]
    logger.info("Bootstrapping Roles")

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
