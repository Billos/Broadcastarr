import { Page } from "puppeteer-core"

import mainLogger from "../../../../utils/logger"
import { GroupController } from "../../../group"
import { AssertGroupCommandArgs } from "../../../indexer"
import { templater } from "../../../templater"
import { CommandClass, Context } from "../command"

type AssertGroupResult = {
  active: boolean
}

export class AssertGroup extends CommandClass<AssertGroupCommandArgs> {
  async execute(_page: Page, context: Context<AssertGroupResult>): Promise<void> {
    const logger = mainLogger.child({ name: "AssertGroup", func: "execute", data: { name: this.name } })
    const category = templater.renderString(this.args.category, context)
    const country = templater.renderString(this.args.country, context)
    const name = templater.renderString(this.args.name, context)
    // Assert that the group exists
    logger.debug(`Asserting group ${name} of country ${country} exists`)
    await this.assertGroupExists(category, country, name, false)

    const group = await GroupController.getGroup({ name, category, country })
    context.command.active = group.active
  }

  private async assertGroupExists(category: string, country: string, name: string, active: boolean): Promise<boolean> {
    const logger = mainLogger.child({ name: "AssertGroup", func: "assertGroupExists", data: { name: this.name } })
    try {
      await GroupController.getGroup({ name, category: category, country })
      logger.debug(`Group ${name} of country ${country} exists`)
      return false
    } catch (error) {
      await GroupController.createGroup({ name, category: category, country }, active)
      logger.debug(`Group ${name} of country ${country} created`)
      return true
    }
  }
}
