import { Page } from "puppeteer"

import sleep from "../../../../utils/sleep"
import { SleepCommandArgs } from "../../../indexer"
import { templater } from "../../../templater"
import { CommandClass, Context } from "../command"

export class SleepCommand extends CommandClass<SleepCommandArgs> {
  async execute(_page: Page, context: Context): Promise<void> {
    const duration = templater.renderString(this.args.duration, context)
    const delay = parseInt(duration, 10)
    await sleep(delay)
  }
}
