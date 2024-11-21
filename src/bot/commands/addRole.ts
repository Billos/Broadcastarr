import { CommandInteraction, InteractionResponse, SlashCommandBuilder } from "discord.js"

import { AuthController } from "../../modules/auth"
import { RoleController } from "../../modules/role"
import { Command, CommandGenerator } from "../type"

async function execute(interaction: CommandInteraction): Promise<InteractionResponse> {
  const user = interaction.options.get("user", false)
  const channel = interaction.options.get("channel", false)
  const role = interaction.options.get("role", true).value as string

  if (!user && !channel) {
    return interaction.reply("No user or channel provided")
  }

  if (user && channel) {
    return interaction.reply("Cannot add both user and channel")
  }

  let reply = "Adding entity"
  if (user) {
    try {
      await AuthController.getAuth(user.user.id)
      await AuthController.addRolesToAuth("user", user.user.id, [role])
      reply += `\n - User \`${user.user.username}\` already exists`
    } catch (error) {
      await AuthController.createAuth("user", user.user.id, [role])
      reply += `\n - User \`${user.user.username}\` added`
    }

    reply += `\n - Role ${role} added to user`
  }
  if (channel) {
    try {
      await AuthController.getAuth(channel.channel.id)
      await AuthController.addRolesToAuth("channel", channel.channel.id, [role])
      reply += `\n - Channel \`${channel.channel.name}\` already exists`
    } catch (error) {
      await AuthController.createAuth("channel", channel.channel.id, [role])
      reply += `\n - Channel \`${channel.channel.name}\` added`
    }

    reply += `\n - Role ${role} added to channel`
  }

  return interaction.reply(reply)
}

const commandGenerator: CommandGenerator = {
  generate: async (): Promise<Command> => {
    const roles = await RoleController.getRoles()
    const roleNames = roles.map(({ name }) => ({ name, value: name }))

    const data = new SlashCommandBuilder()
      .setName("addrole")
      .addStringOption((option) => option
        .setName("role")
        .setRequired(true)
        .addChoices(roleNames)
        .setDescription("The role to add"))
      .addUserOption((option) => option
        .setName("user")
        .setRequired(false)
        .setDescription("The chosen user"))
      .addChannelOption((option) => option
        .setName("channel")
        .setRequired(false)
        .setDescription("The chosen channel"))
      .setDescription("Add a role to an entity")

    return {
      data,
      execute,
      roles: ["admin"],
    }
  },
}

export default commandGenerator
