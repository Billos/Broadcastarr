import set from "lodash/set"
import { DateTime } from "luxon"
import { Page } from "puppeteer"

// import mainLogger from "../../../../utils/logger"
import { SetValueCommandArgs } from "../../../indexer"
import { templater } from "../../../templater"
import { CommandClass, Context } from "../command"

export class SetValuesCommand extends CommandClass<SetValueCommandArgs> {
  async execute(_page: Page, context: Context): Promise<void> {
    // const logger = mainLogger.child({ name: "SetValues", func: "execute", data: { name: this.name } })
    // logger.info(`Setting values ${JSON.stringify(this.args)}`)
    for (const { store, value, isDate, dateFormat, isEmptyArray } of this.args.values) {
      const pathValue = templater.renderString(store, context)
      const [scope] = pathValue.split(".")

      if (Object.keys(context).includes(scope) === false) {
        throw new Error(`Scope '${scope}' does not exist in the context`)
      }
      if (scope === "global") {
        throw new Error("Scope 'global' cannot be modified by a command")
      }

      let finaleValue: string | Date | Array<unknown> = null
      if (isDate) {
        const renderedValue = templater.renderString(value, context)

        let date: DateTime
        if (dateFormat === "X") {
          date = DateTime.fromSeconds(parseInt(renderedValue))
        } else if (dateFormat === "x") {
          date = DateTime.fromMillis(parseInt(renderedValue))
        } else {
          date = DateTime.fromFormat(renderedValue, dateFormat)
        }

        if (!date.isValid) {
          throw new Error(`Invalid date: ${date.invalidExplanation}`)
        }

        finaleValue = date.toJSDate()
      } else if (isEmptyArray) {
        finaleValue = []
      } else {
        finaleValue = templater.renderString(value, context)
      }

      set(context, pathValue, finaleValue)
    }
  }
}
