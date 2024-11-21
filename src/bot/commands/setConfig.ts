import { CommandInteraction, ComponentType, SlashCommandBuilder } from "discord.js"

import { ConfigController } from "../../modules/config"
import confirmRow from "../components/confirm"
import { Command, CommandGenerator } from "../type"

async function execute(interaction: CommandInteraction) {
  const config = interaction.options.get("config", true).value as string
  const value = interaction.options.get("value", true).value as string
  const configDocument = await ConfigController.getConfig(config)

  const confirmationInteraction = await interaction.reply({
    content: `Are you sure you want to update the config ${config} to ${value} (current value: ${configDocument.value})?`,
    components: [confirmRow],
    ephemeral: true,
  })
  const confirmationResponse = await confirmationInteraction.awaitMessageComponent({ componentType: ComponentType.Button })
  const confirmed = confirmationResponse.customId === "confirm_yes"
  if (confirmed) {
    await ConfigController.setConfig(config, value)
    return confirmationResponse.update({ content: `Config ${config} updated to ${value}`, components: [] })
  }
  return confirmationResponse.update({ content: "Config update cancelled", components: [] })
}

const commandGenerator: CommandGenerator = {
  generate: async (): Promise<Command> => {
    const configs = await ConfigController.getConfigs()
    const choices = configs.map(({ key }) => ({ name: key, value: key }))

    const data = new SlashCommandBuilder()
      .setName("setconfig")
      .addStringOption((option) => option
        .setName("config")
        .setDescription("The config to update")
        .setRequired(true)
        .setChoices(choices))
      .addStringOption((option) => option
        .setName("value")
        .setDescription("The value to set")
        .setRequired(true))
      .setDescription("Update a config value")

    return {
      data,
      execute,
      roles: ["admin"],
    }
  },
}

export default commandGenerator
