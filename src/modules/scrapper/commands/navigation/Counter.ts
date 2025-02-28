import { Types } from "mongoose"
import { ElementHandle, Page } from "puppeteer-core"

import mainLogger from "../../../../utils/logger"
import { CounterCommandArgs } from "../../../indexer"
import { templater } from "../../../templater"
import { Orchestrator } from "../../Orchestrator"
import { CommandClass, Context } from "../command"
import { SetValuesCommand } from "../scenario/SetValues"

export class CounterCommand extends CommandClass<CounterCommandArgs> {
  async execute(page: Page, context: Context, _scrapper: Orchestrator): Promise<void> {
    const logger = mainLogger.child({
      name: "CounterCommand",
      func: "execute",
      data: { name: this.name, url: page.url() },
    })
    const { root, selector, store } = this.args

    let rootElt: ElementHandle | Page = page
    if (root) {
      const rootSelector = templater.renderString(root, context)
      await page.waitForSelector(rootSelector)
      rootElt = await page.$(rootSelector)
    }
    const selectorValue = templater.renderString(selector, context)

    const count = await this.count(rootElt, selectorValue)
    logger.debug(`Counted ${count} elements for selector: ${selectorValue}`)
    // Store the value in the scenario context
    if (store) {
      // Run a virtual SetValue command
      const command = new SetValuesCommand(`${this.name}-VirtualStorer`, {
        values: new Types.DocumentArray([{ store, value: `${count}` }]),
      })
      await command.execute(page, context)
    }
  }

  private async count(root: ElementHandle | Page, selector: string): Promise<number> {
    await root.waitForSelector(selector)
    const elements = await root.$$(selector)
    return elements.length
  }
}
