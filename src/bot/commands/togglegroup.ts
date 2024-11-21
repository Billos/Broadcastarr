import { CommandInteraction, ComponentType, SlashCommandBuilder } from "discord.js"

import { CategoryController } from "../../modules/category"
import { GroupController, GroupDocument } from "../../modules/group"
import confirmRow from "../components/confirm"
import selectGroup from "../components/selectGroup"
import { Command, CommandGenerator } from "../type"

async function execute(interaction: CommandInteraction) {
  const action = interaction.options.get("action", true).value as string
  const activate = action === "activate"
  const category = interaction.options.get("category", true).value as string
  const filter = interaction.options.get("filter")?.value as string

  // Ask for a group to remove
  let groups: GroupDocument[]
  if (activate) {
    groups = await GroupController.getInactiveGroups(category)
  } else {
    groups = await GroupController.getActiveGroups(category)
  }

  if (filter) {
    groups = groups.filter(({ country, name }) => (`${country}:${name}`).toLowerCase().includes(filter.toLowerCase()))
  }

  const moreThan25 = groups.length > 25

  const groupInteraction = await interaction.reply({
    content: `Choose a group among the following to ${action}.${moreThan25 ? " (Only the first 25 groups are displayed)" : ""}`,
    components: [selectGroup(groups)],
  })

  const groupInteractionResponse = await groupInteraction.awaitMessageComponent({ componentType: ComponentType.StringSelect })
  const [selectedValue] = groupInteractionResponse.values
  const [countryFound, selectedGroup] = selectedValue.split(":")
  // If country === "undefined" then it equals null
  const country = countryFound || null

  const confirmationInteraction = await groupInteractionResponse.update({
    content: `Are you sure you want to ${action} the group ${selectedGroup}${country ? ` of ${country}` : ""} ?`,
    components: [confirmRow],
  })
  const confirmationResponse = await confirmationInteraction.awaitMessageComponent({ componentType: ComponentType.Button })
  const confirmed = confirmationResponse.customId === "confirm_yes"
  if (confirmed) {
    await GroupController.updateActive({ name: selectedGroup, category, country }, activate)
    return confirmationResponse.update({ content: `Group ${selectedGroup} ${activate ? "activated" : "deactivated"}`, components: [] })
  }
  return confirmationResponse.update({ content: "Action cancelled", components: [] })
}

const commandGenerator: CommandGenerator = {
  generate: async (): Promise<Command> => {
    const categories = await CategoryController.getCategories()
    const choices = categories.map(({ name }) => ({ name, value: name }))
    const actions = [{ name: "Activate", value: "activate" }, { name: "Deactivate", value: "deactivate" }]

    const data = new SlashCommandBuilder()
      .setName("togglegroup")
      .addStringOption((option) => option
        .setName("category")
        .setDescription("The category of the group")
        .setRequired(true)
        .setChoices(choices))
      .addStringOption((option) => option
        .setName("action")
        .setDescription("Action to perform on the indexer")
        .setRequired(true)
        .setChoices(actions))
      .addStringOption((option) => option
        .setName("filter")
        .setDescription("Filter the group")
        .setRequired(false))
      .setDescription("Activate or deactivate an indexer")

    return {
      data,
      execute,
      roles: ["admin", "moderator", "user"],
    }
  },
}

export default commandGenerator
