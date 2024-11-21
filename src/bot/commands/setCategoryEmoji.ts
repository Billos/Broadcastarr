import { CommandInteraction, SlashCommandBuilder } from "discord.js"

import { Triggers } from "../../modules/agenda/triggers"
import { CategoryController } from "../../modules/category"
import mainLogger from "../../utils/logger"
import { Command, CommandGenerator } from "../type"

async function execute(interaction: CommandInteraction) {
  const logger = mainLogger.getSubLogger({ name: "RemoveGroup", prefix: ["execute"] })
  logger.info("Executing set emoji command")
  const category = interaction.options.get("category", true).value as string

  await interaction.reply({
    content: `Which emoji do you want to set to the category ${category}?`,
    components: [],
  })

  const collected = await interaction.channel.awaitMessages({
    filter: (msg) => msg.author.id === interaction.user.id && msg.content.length > 0,
    max: 1,
    time: 30 * 1000, // Timeout in 30 seconds
    errors: ["time"],
  })

  if (!collected || collected.size === 0) {
    return interaction.followUp({ content: "You did not provide an emoji in time!", ephemeral: true })
  }

  const emoji = collected.first().content
  logger.info(`Emoji or text selected: ${emoji}`)

  await CategoryController.setEmoji(category, emoji)
  await Triggers.publishCategory(category)
  return interaction.followUp({ content: `Category ${category} emoji set to ${emoji}`, ephemeral: true })
}

const commandGenerator: CommandGenerator = {
  generate: async (): Promise<Command> => {
    const categories = await CategoryController.getCategories()
    const categoryChoices = categories.map(({ name }) => ({ name, value: name }))

    const data = new SlashCommandBuilder()
      .setName("setcategoryemoji")
      .addStringOption((option) => option
        .setName("category")
        .setDescription("The category of the group")
        .setRequired(true)
        .setChoices(categoryChoices))
      .setDescription("Change the emoji of a group")

    return {
      data,
      execute,
      roles: ["admin", "moderator"],
    }
  },
}

export default commandGenerator
