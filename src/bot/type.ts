/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js"

export function isCommand(instance: any): instance is Command {
  if (!instance.data) {
    throw new Error("Command data is required")
  }
  if (!instance.data.name) {
    throw new Error("Command name is required")
  }
  if (!instance.data.description) {
    throw new Error("Command description is required")
  }
  if (!instance.execute) {
    throw new Error("Command execute is required")
  }
  return true
}

export type Command = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: CommandInteraction) => Promise<any>;
  roles: string[];
}

export function isCommandGenerator(instance: any): instance is CommandGenerator {
  if (typeof instance.generate !== "function") {
    return false
  }
  return true
}

export type CommandGenerator = {
  generate: () => Promise<Command>;
}
