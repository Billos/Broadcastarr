import { readdirSync } from "fs"
import { join } from "path"

import mainLogger from "../utils/logger"
import { Command, CommandGenerator, isCommand, isCommandGenerator } from "./type"

const logger = mainLogger.getSubLogger({ name: "Commands", prefix: ["index"] })

const commands: Command[] = []
const commandGenerators: CommandGenerator[] = []

const files = readdirSync(join(__dirname, "commands"))
logger.info(`Found ${files.length} commands: ${files.join(", ")}`)
// Importing the classes
for (const file of files) {
  try {
    const command = require(`./commands/${file}`).default
    if (isCommandGenerator(command)) {
      logger.info(`Importing Command ${file} as a generator`)
      commandGenerators.push(command)
      // Check if the instance is a valid
    } else if (isCommand(command)) {
      logger.info(`Importing Command ${file}`)
      // Check if the instance is a valid
      isCommand(command)
      commands.push(command)
    }
  } catch (error) {
    logger.error(`Error importing Command ${file}`, error)
  }
}

export { commands, commandGenerators }
