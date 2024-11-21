import { CommandInteraction, InteractionResponse, SlashCommandBuilder } from "discord.js"

import { Triggers } from "../../modules/agenda/triggers"
import { CategoryController } from "../../modules/category"
import { IndexerController } from "../../modules/indexer"
import { Command, CommandGenerator } from "../type"

async function execute(interaction: CommandInteraction): Promise<InteractionResponse> {
  const indexer = interaction.options.get("indexer", true).value as string
  const active = interaction.options.get("action", true).value as string === "activate"

  await IndexerController.updateActive(indexer, active)

  if (active) {
    const categories = await CategoryController.getCategories()
    for (const { name } of categories) {
      await Triggers.publishCategory(name)
    }
    return interaction.reply(`Indexer ${indexer} activated`)
  }

  for (const { name } of await CategoryController.getCategories()) {
    await Triggers.cancelIndexCategory(name, indexer)
    await Triggers.publishCategory(name)
  }
  return interaction.reply(`Indexer ${indexer} deactivated`)
}

const commandGenerator: CommandGenerator = {
  generate: async (): Promise<Command> => {
    const indexers = await IndexerController.getIndexers()
    const choices = indexers.map(({ name }) => ({ name, value: name }))
    const actions = [{ name: "Activate", value: "activate" }, { name: "Deactivate", value: "deactivate" }]

    const data = new SlashCommandBuilder()
      .setName("toggleindexer")
      .addStringOption((option) => option
        .setName("indexer")
        .setDescription("The category of the group")
        .setRequired(true)
        .setChoices(choices))
      .addStringOption((option) => option
        .setName("action")
        .setDescription("Action to perform on the indexer")
        .setRequired(true)
        .setChoices(actions))
      .setDescription("Activate or deactivate an indexer")

    return {
      data,
      execute,
      roles: ["admin"],
    }
  },
}

export default commandGenerator
