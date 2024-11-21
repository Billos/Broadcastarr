import { ILogObj, ISettingsParam, Logger } from "tslog"

import SilentError from "./silentError"
import env from "../config/env"

export const colors: Record<string, string> = {
  bold: "\x1b[1m",
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

// cf colors the function name
export function cf(functionName: string) {
  return `${colors.bold}${colors.red}${functionName}${colors.reset}${colors.reset}`
}

// cpn colors the parameter name
export function cpn(parameterName: string) {
  return `${colors.bold}${colors.green}${parameterName}${colors.reset}${colors.reset}`
}

// cpv colors the parameter value
export function cpv(parameterValue: string) {
  return `${colors.bold}${colors.yellow}${parameterValue}${colors.reset}${colors.reset}`
}

export function size(str: string, length: number): string {
  const ret = str.padEnd(length, " ")
  if (ret.length > length) {
    return `${ret.slice(0, length - 3)}...`
  }
  return ret
}

type Level = "silly" | "trace" | "debug" | "info" | "warn" | "error"

class ScrapperLogger<T> extends Logger<T> {
  // Override the getSublogger

  private encapsulateError(level: Level, ...args: unknown[]) {
    const [error] = args
    if (error instanceof SilentError) {
      return undefined
    }
    return super[level](...args)
  }

  override getSubLogger(settings?: ISettingsParam<T>, logObj?: T) {
    if (settings?.name) {
      settings.name = size(settings.name, 23)
    }
    return super.getSubLogger(settings, logObj)
  }

  override silly(...args: unknown[]) {
    return this.encapsulateError("silly", ...args)
    // return super.silly(...args)
  }

  override trace(...args: unknown[]) {
    return this.encapsulateError("trace", ...args)
    // return super.trace(...args)
  }

  override debug(...args: unknown[]) {
    return this.encapsulateError("debug", ...args)
    // return super.debug(...args)
  }

  override info(...args: unknown[]) {
    return this.encapsulateError("info", ...args)
    // return super.info(...args)
  }

  override warn(...args: unknown[]) {
    return this.encapsulateError("warn", ...args)
    // return super.warn(...args)
  }

  override error(...args: unknown[]) {
    return this.encapsulateError("error", ...args)
    // return super.error(...args)
  }
}

const logger = new ScrapperLogger<ILogObj>({
  name: "log",
  type: "pretty",
  minLevel: env.logLevel,
  prettyLogTimeZone: "local",
  stylePrettyLogs: true,
  prettyLogTemplate: "{{dateIsoStr}} {{logLevelName}} \t{{name}} ",
  overwrite: {
    formatLogObj: ([functionName, ...contents]: string[]) => {
      // Prefix has the following format ["functionName", "parameterName parameterValue", "parameterName parameterValue", ..., "parameterName parameterValue", "message"]
      // We want to color the functionName and the parameterName
      // Last element is the message
      const message = contents.pop()
      // contents should have at least 3 elements
      while (contents.length < 3) {
        contents.push("")
      }
      const args = [
        cf(size(functionName, 23)),
        ...contents.map((content, index) => {
          if (index === contents.length - 1) {
            return content
          }
          const [parameterName, ...parameterValue] = content.split(" ")
          return `${cpn(size(parameterName, 20))} ${cpv(size(parameterValue.join(" "), 30))}`
        }),
        message,
      ]
      return { args, errors: [] }
    },
  },
})

export default logger
