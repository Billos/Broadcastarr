import { CommandInteraction, SlashCommandBuilder } from "discord.js"

import { Triggers } from "../../modules/agenda/triggers"
import { CategoryController } from "../../modules/category"
import { IndexerController } from "../../modules/indexer"
import mainLogger from "../../utils/logger"
import { Command, CommandGenerator } from "../type"

async function execute(interaction: CommandInteraction) {
  const logger = mainLogger.getSubLogger({ name: "ListBroadcasts", prefix: ["execute"] })
  logger.info("Executing list broadcasts command")
  const category = interaction.options.get("category", true).value as string

  const indexers = await IndexerController.getIndexers(true)
  for (const indexer of indexers) {
    await Triggers.indexCategory(category, indexer.name)
  }
  return interaction.reply(`Listing broadcasts for ${category} scheduled`)
}

const commandGenerator: CommandGenerator = {
  generate: async (): Promise<Command> => {
    const categories = await CategoryController.getCategories()
    const categoryChoices = categories.map(({ name }) => ({ name, value: name }))

    const data = new SlashCommandBuilder()
      .setName("indexcategory")
      .addStringOption((option) => option
        .setName("category")
        .setDescription("The category to index")
        .setRequired(true)
        .setChoices(categoryChoices))
      .setDescription("List all broadcasts of a category")

    return {
      data,
      execute,
      roles: ["admin", "moderator", "user"],
    }
  },
}

export default commandGenerator
