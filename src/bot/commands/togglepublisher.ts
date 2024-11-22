import { CommandInteraction, InteractionResponse, SlashCommandBuilder } from "discord.js"

import { Triggers } from "../../modules/agenda/triggers"
import { CategoryController } from "../../modules/category"
import { IndexerController } from "../../modules/indexer"
import { PublishersController } from "../../modules/publishers"
import { Command, CommandGenerator } from "../type"

async function execute(interaction: CommandInteraction): Promise<InteractionResponse> {
  const publisher = interaction.options.get("publisher", true).value as string
  const active = interaction.options.get("action", true).value as string === "activate"

  await PublishersController.updateActive(publisher, active)

  const indexers = await IndexerController.getIndexers(true)
  for (const { name } of await CategoryController.getCategories()) {
    for (const indexer of indexers) {
      await Triggers.cancelIndexCategory(name, indexer.name)
    }
    await Triggers.publishCategory(name)
  }

  if (active) {
    return interaction.reply(`Publisher ${publisher} activated`)
  }
  return interaction.reply(`Publisher ${publisher} deactivated`)
}

const commandGenerator: CommandGenerator = {
  generate: async (): Promise<Command> => {
    const publishers = await PublishersController.getAllPublishers()
    const choices = publishers.map(({ name }) => ({ name, value: name }))
    const actions = [{ name: "Activate", value: "activate" }, { name: "Deactivate", value: "deactivate" }]

    const data = new SlashCommandBuilder()
      .setName("togglepublisher")
      .addStringOption((option) => option
        .setName("publisher")
        .setDescription("The publisher to toggle")
        .setRequired(true)
        .setChoices(choices))
      .addStringOption((option) => option
        .setName("action")
        .setDescription("Action to perform on the publisher")
        .setRequired(true)
        .setChoices(actions))
      .setDescription("Activate or deactivate a publisher")

    return {
      data,
      execute,
      roles: ["admin"],
    }
  },
}

export default commandGenerator
