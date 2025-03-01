import { Types } from "mongoose"
import { ElementHandle, Page } from "puppeteer-core"
import { log } from "winston"

import mainLogger from "../../../../utils/logger"
import { GetValueCommandArgs } from "../../../indexer"
import { templater } from "../../../templater"
import { CommandClass, Context } from "../command"
import { SetValuesCommand } from "../scenario/SetValues"

export class GetValuesCommand extends CommandClass<GetValueCommandArgs> {
  async execute(page: Page, context: Context): Promise<void> {
    const logger = mainLogger.child({ name: "GetValuesCommand", func: "execute", data: { name: this.name, url: page.url() } })

    const { root, values } = this.args
    let rootElt: ElementHandle | Page = page
    if (root) {
      const selector = templater.renderString(root, context)
      logger.debug(`Waiting for root element: ${selector}`)
      rootElt = await page.$(selector)
    }

    for (const { selector, attribute, replacements, store, canFail, valueIfFailed, elementExists } of values) {
      // Render the selector and attribute
      const selectorValue = templater.renderString(selector, context)
      const attributeValue = attribute ? templater.renderString(attribute, context) : null
      // logger.debug(`Getting value for selector: ${selectorValue}`)

      if (elementExists) {
        const exists = await this.elementExists(rootElt, selectorValue)
        // logger.debug(`Storing value in context: ${store} = "${exists}"`)
        const command = new SetValuesCommand(`${this.name}-VirtualStorer`, {
          values: new Types.DocumentArray([{ store, value: `${exists}` }]),
        })
        await command.execute(page, context)
        return
      }

      // Get the value
      let value
      if (canFail) {
        try {
          value = await this.getValue(rootElt, selectorValue, attributeValue)
        } catch (error) {
          logger.error(`Error while getting value: ${error.message}`)
          if (!valueIfFailed) {
            return
          }
          value = templater.renderString(valueIfFailed, context)
        }
      } else {
        const rootSelector = root ? templater.renderString(root, context) : "PAGE"
        logger.debug(`Getting value for selector: ${selectorValue}, attribute: ${attributeValue}, rootElt selector: ${rootSelector}`)
        value = await this.getValue(rootElt, selectorValue, attributeValue)
      }

      // Apply replacements
      if (replacements) {
        for (const { from, to } of replacements) {
          const fromValue = templater.renderString(from, context)
          const toValue = templater.renderString(to, context)
          const regex = new RegExp(fromValue, "g")
          value = value.replace(regex, toValue)
        }
      }

      // Store the value in the scenario context
      if (store) {
        // Run a virtual SetValue command
        // logger.debug(`Storing value in context: ${store} = ${value}`)
        const command = new SetValuesCommand(`${this.name}-VirtualStorer`, {
          values: new Types.DocumentArray([{ store, value }]),
        })
        await command.execute(page, context)
      }
    }
  }

  private async elementExists(root: ElementHandle | Page, selector: string): Promise<boolean> {
    try {
      await root.waitForSelector(selector)
      return true
    } catch (error) {
      return false
    }
  }

  private async getValue(root: ElementHandle | Page, selector: string, attribute?: string): Promise<string> {
    if (!attribute) {
      return root.$eval(selector, (item) => item.textContent)
    }

    if (attribute === "href") {
      return root.$eval(selector, (item) => (item as HTMLAnchorElement).href)
    }
    return root.$eval(selector, (item, attr) => item.getAttribute(attr), attribute)
  }
}
