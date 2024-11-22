import {
  Client,
  Guild,
  Interaction,
  REST,
  Routes,
} from "discord.js"

import { commandGenerators, commands } from "./commands"
import { Command } from "./type"
import env from "../config/env"
import { AuthController } from "../modules/auth"
import { RoleController } from "../modules/role"
import mainLogger from "../utils/logger"

const rest = new REST({ version: "10" }).setToken(env.discordBot.token)

class DiscordBot {
  private client: Client

  private commands: Command[] = commands

  constructor() {
    this.client = new Client({
      intents: ["Guilds", "GuildMessages", "MessageContent"],
    })
  }

  public async start() {
    const logger = mainLogger.getSubLogger({ name: "DiscordBot", prefix: ["start"] })
    this.client.on("ready", this.onReady.bind(this))
    this.client.on("guildCreate", this.onGuildCreate.bind(this))
    this.client.on("guildAvailable", this.onGuildAvailable.bind(this))
    this.client.on("interactionCreate", this.onInteractionCreate.bind(this))
    await this.client.login(env.discordBot.token)

    // Every 5 minutes, redeploy the commands
    setInterval(async () => {
      for (const guild of this.client.guilds.cache.values()) {
        logger.info(`Redeploying commands for guild ${guild.id}`)
        await this.deployCommands(guild.id)
      }
    }, 5 * 60 * 1000)
  }

  private async deployCommands(guildId: string): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "DiscordBot", prefix: ["deployCommands"] })
    logger.info(`Deploying commands to guild ${guildId}`)
    this.commands = []
    this.commands.push(...commands)
    for (const generator of commandGenerators) {
      try {
        const cmd = await generator.generate()
        this.commands.push(cmd)
      } catch (error) {
        logger.error(error)
      }
    }

    const body = this.commands.map(({ data }) => data.toJSON())
    try {
      logger.info("Started refreshing application (/) commands.")
      await rest.put(Routes.applicationGuildCommands(env.discordBot.clientId, guildId), { body })

      logger.debug("Successfully reloaded application (/) commands.")
    } catch (error) {
      logger.error(error)
    }
  }

  private async onReady(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "DiscordBot", prefix: ["onReady"] })
    logger.info("Discord bot is ready")
  }

  private async onGuildCreate(guild: Guild): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "DiscordBot", prefix: ["onGuildCreate", `guildId ${guild.id}`] })
    logger.info(`Joined guild ${guild.name}`)
    // await deployCommands({ guildId: guild.id })
  }

  private async onGuildAvailable(guild: Guild): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "DiscordBot", prefix: ["onGuildAvailable", `guildId ${guild.id}`] })
    logger.info(`Guild is available ${guild.name}`)
    await this.deployCommands(guild.id)
  }

  private async isAuthorized(interaction: Interaction, command: string): Promise<boolean> {
    const logger = mainLogger.getSubLogger({ name: "DiscordBot", prefix: ["isAuthorized", `interactionId ${interaction.id}`] })

    const auths = await AuthController.getAuths()
    if (auths.length === 0) {
      logger.warn("No auths found, allowing all interactions")
      return true
    }

    const idsToCheck = [interaction.user.id, interaction.channelId]
    const queryRoles = []
    for (const id of idsToCheck) {
      try {
        const { roles } = await AuthController.getAuth(id)
        queryRoles.push(...roles)
      } catch (error) {
        // Probably not found, nothing to do
      }
    }

    const hasAbility = await RoleController.hasAbility(queryRoles, command)
    if (hasAbility) {
      return true
    }
    return false
  }

  private async onInteractionCreate(interaction: Interaction): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "DiscordBot", prefix: ["onInteractionCreate", `interactionId ${interaction.id}`] })
    if (!interaction.isCommand()) {
      return
    }

    const { commandName } = interaction
    const auth = await this.isAuthorized(interaction, commandName)
    if (!auth) {
      logger.warn(`Unauthorized interaction from ${interaction.user.id}`)
      await interaction.reply({ content: "You are not authorized to use this command", ephemeral: true })
      return
    }

    const command = this.commands.find(({ data }) => data.name === commandName)
    if (command) {
      try {
        logger.info(`Executing command ${commandName}`)
        await command.execute(interaction)
        logger.info(`Command ${commandName} executed`)
        logger.info(`Redeploying commands for guild ${interaction.guildId}`)
        await this.deployCommands(interaction.guildId)
      } catch (error) {
        interaction.reply({ content: `Operation failed due to ${error}`, ephemeral: true })
      }
    } else {
      logger.error(`Command not found: ${commandName}`)
    }
  }
}

export default DiscordBot
