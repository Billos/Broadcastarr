import mainLogger from "../../utils/logger"
import { BroadcastDocument } from "../broadcast"
import { ConfigController } from "../config"
import { CommandDocument } from "../indexer"
import { ScenariosDocument } from "../indexer/model"
import { StreamData } from "../indexers/broadcastInterceptor"
import { generateCommand } from "./commands"
import { Command, Context } from "./commands/command"
import { RunScenarioCommand } from "./commands/scenario/RunScenario"
import { Scrapper } from "./scrapper"

type Scenario = Map<string, Command>

export type IndexReturn = {
  broadcasts: BroadcastDocument[]
}

export type InterceptReturn = {
  stream: StreamData
  streamIndex: number
}

type RunReturnMap = {
  index: IndexReturn
  intercept: InterceptReturn
}

export class Orchestrator extends Scrapper {
  protected scenarios: Map<string, Scenario>

  constructor(
    docs: ScenariosDocument,
    private execution: Record<string, unknown>,
  ) {
    super()

    // Convert the docs to a map of scenarios
    this.scenarios = new Map()
    for (const [name, dbScenario] of docs) {
      const scenario: Scenario = new Map<string, Command>()
      for (const [key, value] of dbScenario as Map<string, CommandDocument>) {
        scenario.set(key, generateCommand(value, key))
      }
      this.scenarios.set(name, scenario)
    }
  }

  async run<T extends "index" | "intercept">(scenario: T): Promise<Partial<RunReturnMap[T]>> {
    const logger = mainLogger.getSubLogger({ name: "Orchestrator", prefix: ["run"] })

    const browser = await this.getBrowser()
    const browserContext = await browser.createBrowserContext()
    const page = await browserContext.newPage()
    await page.setCacheEnabled(false)

    const futureLimit = await ConfigController.getNumberConfig("filter-limit-future")
    const context: Context<Record<string, unknown>, Partial<RunReturnMap[T]>> = {
      // The global context
      global: {
        futureLimit,
      },
      // This run context
      execution: this.execution,
      // A scenario context, emptied at each scenario
      scenario: {},
      // A command context, emptied at each command
      command: {},
      // The result of the run
      result: {},
    }

    // Run a virtual RunScenario command
    logger.info("Starting a virtual RunScenario command")
    const command = new RunScenarioCommand("VirtualStarter", { scenario })
    await command.execute(page, context, this)

    logger.info("Closing the browser")
    await browser.close()

    return context.result
  }

  public getScenario(name: string): Scenario {
    if (!this.scenarios.has(name)) {
      throw new Error(`Scenario ${name} not found`)
    }
    return this.scenarios.get(name)
  }
}
