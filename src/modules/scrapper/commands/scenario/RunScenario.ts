import { DateTime } from "luxon"
import { Page } from "puppeteer"

import env from "../../../../config/env"
import mainLogger from "../../../../utils/logger"
import { RunScenarioCommandArgs } from "../../../indexer"
import { templater } from "../../../templater"
import { Orchestrator } from "../../Orchestrator"
import { CommandClass, Context } from "../command"

export class RunScenarioCommand extends CommandClass<RunScenarioCommandArgs> {
  async execute(page: Page, context: Context, scrapper: Orchestrator): Promise<void> {
    const logger = mainLogger.child({ name: "RunScenario", func: "execute", data: { name: this.name } })
    const newPage = await page.browser().newPage()
    await page.setCacheEnabled(false)
    await page.setUserAgent(env.browser.userAgent)

    const innerContext: Context = {
      ...context,
      scenario: {},
    }

    try {
      await this.runScenario(newPage, innerContext, scrapper)
      // Take a screenshot at the end of the scenario
      await this.takeScreenshot(page, scrapper, "success")
    } catch (error) {
      logger.error(`Error running scenario ${this.args.scenario}: ${error}`)
      console.error(error.stack)

      await this.takeScreenshot(page, scrapper, "error")
    }

    await newPage.close()
    logger.info(`Scenario ${this.args.scenario} completed`)
  }

  private async runScenario(page: Page, context: Context, scrapper: Orchestrator): Promise<void> {
    const logger = mainLogger.child({ name: "RunScenario", func: "runScenario" })
    logger.info(`Running scenario ${this.args.scenario}`)
    const scenario = scrapper.getScenario(this.args.scenario)
    let index = 0
    let commandName = "start"
    do {
      context.command = {}
      const command = scenario.get(commandName)
      if (!command) {
        throw new Error(`Command ${commandName} not found`)
      }
      logger.debug(`Running command ${command.name}`)
      await this.takeScreenshot(page, scrapper, index)
      await command.execute(page, context, scrapper)

      // Take a screenshot at the end of the command
      if (command.next) {
        commandName = templater.renderString(command.next, context)
      } else {
        commandName = null
      }
      index++
    } while (commandName)
    logger.info(`Scenario ${this.args.scenario} completed`)
  }

  private async takeScreenshot(page: Page, scrapper: Orchestrator, name: string | number): Promise<void> {
    if (env.dev) {
      await scrapper.screenshot(page, `${DateTime.local().toFormat("HH_mm_ss")}-${this.args.scenario}-${name}`)
    }
  }
}
