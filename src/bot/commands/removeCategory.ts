import { CommandInteraction, ComponentType, SlashCommandBuilder } from "discord.js"

import { CategoryController } from "../../modules/category"
import mainLogger from "../../utils/logger"
import confirmRow from "../components/confirm"
import { Command, CommandGenerator } from "../type"

async function execute(interaction: CommandInteraction) {
  const logger = mainLogger.getSubLogger({ name: "RemoveGroup", prefix: ["execute"] })
  logger.info("Executing remove group command")
  const category = interaction.options.get("category", true).value as string

  // Ask for a group to remove
  const confirmationInteraction = await interaction.reply({
    content: `Are you sure you want to remove the category ${category}?`,
    components: [confirmRow],
    ephemeral: true,
  })
  // Ask for confirmation
  const confirmationResponse = await confirmationInteraction.awaitMessageComponent({ componentType: ComponentType.Button })
  const confirmed = confirmationResponse.customId === "confirm_yes"

  // Remove the group
  if (confirmed) {
    await CategoryController.deleteCategory(category)
    return confirmationResponse.update({ content: `Category ${category} removed`, components: [] })
  }
  return confirmationResponse.update({ content: "Category removal cancelled", components: [] })
}

const commandGenerator: CommandGenerator = {
  generate: async (): Promise<Command> => {
    const categories = await CategoryController.getCategories()
    const categoryChoices = categories.map(({ name }) => ({ name, value: name }))

    const data = new SlashCommandBuilder()
      .setName("removecategory")
      .addStringOption((option) => option
        .setName("category")
        .setDescription("The category to remove")
        .setRequired(true)
        .setChoices(categoryChoices))
      .setDescription("Remove a category")

    return {
      data,
      execute,
      roles: ["admin"],
    }
  },
}

export default commandGenerator
