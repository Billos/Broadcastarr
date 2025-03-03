import { DateTime } from "luxon"
import { Environment } from "nunjucks"

import mainLogger from "../../utils/logger"

export class TemplateRenderer extends Environment {
  constructor() {
    super(null, { autoescape: false, throwOnUndefined: true })

    this.addGlobal("dateToFormat", (days: number, format: string) => {
      if (days === undefined) {
        throw new Error("days is required")
      }

      if (format === undefined) {
        throw new Error("format is required")
      }

      const date = DateTime.local().plus({ days })
      return date.toFormat(format)
    })

    this.addFilter("formatDate", (date: string, inputFormat: string, outputFormat: string) => {
      if (!date) {
        throw new Error("date is required")
      }

      if (!inputFormat) {
        throw new Error("inputFormat is required")
      }

      if (!outputFormat) {
        throw new Error("outputFormat is required")
      }

      const forbiddenFormats = ["x", "X"]
      if (forbiddenFormats.includes(inputFormat)) {
        throw new Error(`Invalid input format: ${inputFormat}`)
      }

      const parsedDate = DateTime.fromFormat(date, inputFormat)

      if (!parsedDate.isValid) {
        throw new Error(`Invalid date ${date} with format ${inputFormat}`)
      }
      return parsedDate.toFormat(outputFormat)
    })

    this.addGlobal("now", (outputFormat: string) => {
      if (!outputFormat) {
        throw new Error("outputFormat is required")
      }
      return DateTime.now().toFormat(outputFormat)
    })
  }

  override renderString(template: string, context: Record<string, any>): string {
    const logger = mainLogger.child({ name: "TemplateRenderer", func: "renderString" })
    const templateRegex = /({{.*}})|({%.*%})/g
    if (!template || !template.match(templateRegex)) {
      return template
    }

    try {
      // logger.debug("=============================================")
      // logger.debug(`Rendering template: |${template}|`)
      // logger.debug(`With context: ${JSON.stringify(context)}`)
      // logger.debug(`Result: |${super.renderString(template, context)}|`)
      return super.renderString(template, context)
    } catch (error) {
      logger.error(`Error rendering template: ${error}`)
      logger.error(`Template: ${template}`)
      logger.error(`Context: ${JSON.stringify(context)}`)
      throw new Error(`Error rendering template: ${error}`)
    }
  }
}
