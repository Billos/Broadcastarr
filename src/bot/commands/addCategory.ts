import { CommandInteraction, InteractionResponse, SlashCommandBuilder } from "discord.js"

import { Triggers } from "../../modules/agenda/triggers"
import { CategoryController } from "../../modules/category"
import { ConfigController } from "../../modules/config"
import { Command, CommandGenerator } from "../type"

async function execute(interaction: CommandInteraction): Promise<InteractionResponse> {
  const name = interaction.options.get("name", true).value as string
  const id = interaction.options.get("id", true).value as string
  const token = interaction.options.get("token", true).value as string
  const emoji = interaction.options.get("emoji")?.value as string

  await CategoryController.createCategory(name)
  if (emoji) {
    await CategoryController.setEmoji(name, emoji)
  }

  await ConfigController.setConfig(`discord-webhook-${name}-id`, id)
  await ConfigController.setConfig(`discord-webhook-${name}-token`, token)

  await Triggers.publishCategory(name)

  return interaction.reply(`Category ${name} added`)
}

const commandGenerator: CommandGenerator = {
  generate: async (): Promise<Command> => {
    const data = new SlashCommandBuilder()
      .setName("addcategory")
      .addStringOption((option) => option
        .setName("name")
        .setDescription("The category name")
        .setRequired(true))
      .addStringOption((option) => option
        .setName("id")
        .setDescription("The discord channel id")
        .setRequired(true))
      .addStringOption((option) => option
        .setName("token")
        .setDescription("The discord channel token")
        .setRequired(true))
      .addStringOption((option) => option
        .setName("emoji")
        .setDescription("The category emoji")
        .setRequired(false))
      .setDescription("Add a category")

    return {
      data,
      execute,
      roles: ["admin"],
    }
  },
}

export default commandGenerator
