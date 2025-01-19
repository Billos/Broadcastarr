import { Page } from "puppeteer"

import sleep from "../../../../utils/sleep"
import { GoToPageCommandArgs } from "../../../indexer"
import { templater } from "../../../templater"
import { CommandClass, Context } from "../command"

export class GoToPageCommand extends CommandClass<GoToPageCommandArgs> {
  async execute(page: Page, context: Context): Promise<void> {
    const url = templater.renderString(this.args.url, context)
    await page.goto(url, { timeout: 10000, waitUntil: "domcontentloaded" })
    await sleep(1000)
  }
}
