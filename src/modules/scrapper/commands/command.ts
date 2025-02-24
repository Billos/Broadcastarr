import { Page } from "puppeteer-core"

import { Orchestrator } from "../Orchestrator"

export interface Context<
  CommandResult extends Record<string, unknown> = Record<string, unknown>,
  Result extends Record<string, unknown> = Record<string, unknown>,
> {
  // The global context
  global: Record<string, unknown>
  // This run context
  execution: Record<string, unknown>
  // A scenario context, emptied at each scenario of the same run
  scenario: Record<string, unknown>
  // A command context, emptied at each command of the same scenario
  command: CommandResult
  // The final result of the run
  result: Result
}

type CommandArgs = Record<string, unknown>
export interface Command<T extends CommandArgs = CommandArgs> {
  name: string
  args: T
  execute: (page: Page, context: Context, scraper: Orchestrator) => Promise<void>
  next?: string
}

export abstract class CommandClass<T extends CommandArgs> implements Command<T> {
  name: string

  args: T

  next?: string

  abstract execute(page: Page, context: Context, scraper: Orchestrator): Promise<void>

  constructor(name: string, args: T, next?: string) {
    this.name = name
    this.args = args
    if (next) {
      this.next = next
    }
  }
}
