import { Page } from "puppeteer-core"

import mainLogger from "../../../../utils/logger"
import sleep from "../../../../utils/sleep"
import { GoToPageCommandArgs } from "../../../indexer"
import { templater } from "../../../templater"
import { CommandClass, Context } from "../command"

export class GoToPageCommand extends CommandClass<GoToPageCommandArgs> {
  async execute(page: Page, context: Context): Promise<void> {
    const logger = mainLogger.child({ name: "GoToPage", func: "execute", data: { ...this.args, url: page.url() } })
    logger.info(`Going to page ${this.args.url}`)
    const url = templater.renderString(this.args.url, context)
    await page.goto(url, { timeout: 10000, waitUntil: "domcontentloaded" })
    await sleep(1000)
  }
}
