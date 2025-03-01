import { createLogger, format, transports } from "winston"

import env from "../config/env"

type Styles = "bold" | "reset" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan"

const styleApplications: Record<Styles, string> = {
  bold: "\x1b[1m",
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

function apply(style: Styles, str: string) {
  return `${styleApplications[style]}${str}${styleApplications.reset}`
}

export function size(str: string, maxLength: number): string {
  if (str.length > maxLength) {
    return `${str.slice(0, maxLength - 3)}...`
  }
  return str.padEnd(maxLength, " ")
}

function maxLength(opts: Record<string, number>) {
  return format((info) => {
    Object.keys(opts).forEach((key) => {
      // If info[key] is a string
      if (typeof info[key] === "string") {
        info[key] = size(info[key], opts[key])
      } else if (Array.isArray(info[key]) && info[key].every((element) => typeof element === "string")) {
        info[key] = info[key].map((element) => {
          if (typeof element === "string") {
            return size(element, opts[key])
          }
          return element
        })
      }
    })
    return info
  })()
}

function ignoreSilentErrors() {
  return format((info) => {
    if (info.name === "SilentError") {
      return null
    }
    return info
  })()
}

function stringifyData() {
  return format((info) => {
    if (info.data) {
      // Apply red color only to the values, and red to the keys
      const data = []
      if (typeof info.data === "object") {
        for (const [key, value] of Object.entries(info.data)) {
          // data += `${apply("red", key)}: ${apply("red", info.data[key])}\n`
          data.push(`${apply("red", key)}: ${apply("yellow", value)} `)
        }
        info.data = data.join(" - ")
      }
    }
    return info
  })()
}

const spaces = `${" ".repeat(5 + 3 + 12 + 3 + 23 + 3 + 20 + 3)}        `

const logger = createLogger({
  format: format.combine(
    ignoreSilentErrors(),
    format.timestamp({ format: "HH:mm:ss:SSS" }),
    // Red color for the data
    format.align(),
    maxLength({ name: 23, level: 5, func: 20 }),
    format.colorize({ all: true }),
    stringifyData(),
    format.printf(
      (info) =>
        `${info.level} - ${info.timestamp} - ${info.name} - ${info.func} : ${info.message}` +
        `${env.logData && info.data ? `\n${spaces}${info.data}` : ""}` +
        "",
    ),
  ),
  transports: [
    new transports.Console({
      level: env.logLevel,
    }),
  ],
  level: env.logLevel,
})
// overwrite: {
//   formatLogObj: ([functionName, ...contents]: string[]) => {
//     // Prefix has the following format ["functionName", "parameterName parameterValue", "parameterName parameterValue", ..., "parameterName parameterValue", "message"]
//     // We want to color the functionName and the parameterName
//     // Last element is the message
//     const message = contents.pop()
//     // contents should have at least 3 elements
//     while (contents.length < 3) {
//       contents.push("")
//     }
//     const args = [
//       cf(size(functionName, 23)),
//       ...contents.map((content, index) => {
//         if (index === contents.length - 1) {
//           return content
//         }
//         const [parameterName, ...parameterValue] = content.split(" ")
//         return `${cpn(size(parameterName, 20))} ${cpv(size(parameterValue.join(" "), 30))}`
//       }),
//       message,
//     ]
//     return { args, errors: [] }
//   },
// },

export default logger
