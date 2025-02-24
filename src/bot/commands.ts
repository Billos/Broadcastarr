import mainLogger from "../utils/logger"
import addCategory from "./commands/addCategory"
import addRole from "./commands/addRole"
import indexCategory from "./commands/indexCategory"
import removeCategory from "./commands/removeCategory"
import setCategoryEmoji from "./commands/setCategoryEmoji"
import setConfig from "./commands/setConfig"
import setGroupEmoji from "./commands/setGroupEmoji"
import togglegroup from "./commands/togglegroup"
import toggleindexer from "./commands/toggleindexer"
import togglepublisher from "./commands/togglepublisher"
import togglereleaser from "./commands/togglereleaser"
import { Command, CommandGenerator, isCommand, isCommandGenerator } from "./type"

const logger = mainLogger.child({ name: "Commands", func: "index" })

const cmds = [
  addCategory,
  addRole,
  indexCategory,
  removeCategory,
  setCategoryEmoji,
  setConfig,
  setGroupEmoji,
  togglegroup,
  toggleindexer,
  togglepublisher,
  togglereleaser,
]

const commands: Command[] = []
const commandGenerators: CommandGenerator[] = []

// Importing the classes
for (const command of cmds) {
  try {
    if (isCommandGenerator(command)) {
      commandGenerators.push(command)
      // Check if the instance is a valid
    } else if (isCommand(command)) {
      // Check if the instance is a valid
      isCommand(command)
      commands.push(command)
    }
  } catch (error) {
    logger.error("Error importing Command", error)
  }
}

export { commands, commandGenerators }
