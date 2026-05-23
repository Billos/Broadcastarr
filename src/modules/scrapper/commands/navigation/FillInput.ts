import { Page } from "puppeteer-core"

import { FillInputCommandArgs } from "../../../indexer"
import { templater } from "../../../templater"
import { CommandClass, Context } from "../command"

export class FillInputCommand extends CommandClass<FillInputCommandArgs> {
  async execute(page: Page, context: Context): Promise<void> {
    const selector = templater.renderString(this.args.selector, context)
    const values = templater.renderString(this.args.value, context)
    await page.waitForSelector(selector, { timeout: 5000 })

    const input = await page.$(selector)
    if (!input) {
      throw new Error(`Element not found for selector: ${selector}`)
    }
    await input.click()
    await input.type(values, { delay: 150 })
  }
}
