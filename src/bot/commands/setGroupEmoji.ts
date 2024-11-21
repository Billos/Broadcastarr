import { CommandInteraction, ComponentType, SlashCommandBuilder } from "discord.js"

import { Triggers } from "../../modules/agenda/triggers"
import { CategoryController } from "../../modules/category"
import { GroupController } from "../../modules/group"
import mainLogger from "../../utils/logger"
import selectGroup from "../components/selectGroup"
import { Command, CommandGenerator } from "../type"

async function execute(interaction: CommandInteraction) {
  const logger = mainLogger.getSubLogger({ name: "RemoveGroup", prefix: ["execute"] })
  logger.info("Executing set emoji command")
  const category = interaction.options.get("category", true).value as string

  // Ask for a group to remove
  const groups = await GroupController.getActiveGroups(category)
  const groupInteraction = await interaction.reply({
    content: "Choose a group",
    components: [selectGroup(groups)],
  })
  const groupInteractionResponse = await groupInteraction.awaitMessageComponent({ componentType: ComponentType.StringSelect })
  const [selectedValue] = groupInteractionResponse.values
  const [countryFound, selectedGroup] = selectedValue.split(":")
  // If country === "undefined" then it equals null
  const country = countryFound || null

  // Ask for confirmation
  await interaction.followUp({
    content: `Which emoji do you want to set to the group ${selectedGroup} in ${country} ?`,
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

  await GroupController.setEmoji({ name: selectedGroup, category, country }, emoji)
  await Triggers.publishGroup(selectedGroup, category, country)
  return interaction.followUp({ content: `Group ${selectedGroup} of country ${country} emoji set to ${emoji}`, ephemeral: true })
}

const commandGenerator: CommandGenerator = {
  generate: async (): Promise<Command> => {
    const categories = await CategoryController.getCategories()
    const categoryChoices = categories.map(({ name }) => ({ name, value: name }))

    const data = new SlashCommandBuilder()
      .setName("setgroupemoji")
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
