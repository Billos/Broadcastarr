import { Page } from "puppeteer-core"

import mainLogger from "../../../../utils/logger"
import { PrintCommandArgs } from "../../../indexer"
import { templater } from "../../../templater"
import { CommandClass, Context } from "../command"

export class PrintCommand extends CommandClass<PrintCommandArgs> {
  async execute(_page: Page, context: Context): Promise<void> {
    const logger = mainLogger.child({ name: "SetValues", func: "execute", data: { name: this.name } })
    const { value } = this.args

    // *******************
    // |     PRINT       |
    // *******************
    logger.info("*****************************************************************")
    logger.info(value)
    logger.info("*************************** RENDERING ***************************")
    logger.info(templater.renderString(value, context))
    logger.info("*****************************************************************")
  }
}
