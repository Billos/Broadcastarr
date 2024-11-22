import { CommandInteraction, InteractionResponse, SlashCommandBuilder } from "discord.js"

import { Triggers } from "../../modules/agenda/triggers"
import { CategoryController } from "../../modules/category"
import { IndexerController } from "../../modules/indexer"
import { ReleasersController } from "../../modules/releasers"
import { Command, CommandGenerator } from "../type"

async function execute(interaction: CommandInteraction): Promise<InteractionResponse> {
  const releaser = interaction.options.get("releaser", true).value as string
  const active = interaction.options.get("action", true).value as string === "activate"

  await ReleasersController.updateActive(releaser, active)

  const indexers = await IndexerController.getIndexers(true)
  for (const { name } of await CategoryController.getCategories()) {
    for (const indexer of indexers) {
      await Triggers.cancelIndexCategory(name, indexer.name)
    }
    await Triggers.publishCategory(name)
  }

  if (active) {
    return interaction.reply(`Releaser ${releaser} activated`)
  }
  return interaction.reply(`Releaser ${releaser} deactivated`)
}

const commandGenerator: CommandGenerator = {
  generate: async (): Promise<Command> => {
    const releasers = await ReleasersController.getAllReleasers()
    const choices = releasers.map(({ name }) => ({ name, value: name }))
    const actions = [{ name: "Activate", value: "activate" }, { name: "Deactivate", value: "deactivate" }]

    const data = new SlashCommandBuilder()
      .setName("togglereleaser")
      .addStringOption((option) => option
        .setName("releaser")
        .setDescription("The releaser to toggle")
        .setRequired(true)
        .setChoices(choices))
      .addStringOption((option) => option
        .setName("action")
        .setDescription("Action to perform on the releaser")
        .setRequired(true)
        .setChoices(actions))
      .setDescription("Activate or deactivate a releaser")

    return {
      data,
      execute,
      roles: ["admin"],
    }
  },
}

export default commandGenerator
