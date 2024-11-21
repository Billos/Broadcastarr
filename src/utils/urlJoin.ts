import { join } from "path"

import env from "../config/env"

export default function urlJoin(apiKey: string, ...args: string[]): string {
  return join(`${env.remoteUrl}`, "api", ...args, `?apiKey=${apiKey}`)
}
