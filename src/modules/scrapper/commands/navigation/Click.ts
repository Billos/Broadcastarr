import { Page } from "puppeteer"

import mainLogger from "../../../../utils/logger"
import { ClickCommandArgs } from "../../../indexer"
import { templater } from "../../../templater"
import { Orchestrator } from "../../Orchestrator"
import { CommandClass, Context } from "../command"

export class ClickCommand extends CommandClass<ClickCommandArgs> {
  async execute(page: Page, context: Context, _scraper: Orchestrator): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "Click", prefix: ["execute", this.name] })
    const selector = templater.renderString(this.args.selector, context)
    logger.info(`Clicking on ${selector}`)
    await page.waitForSelector(selector, { timeout: 5000 })

    const input = await page.$(selector)
    await input.click()
  }
}
