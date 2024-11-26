import { join } from "path"

import env from "../config/env"

export default function urlJoin(apiKey: string, ...args: string[]): string {
  const url = join("api", ...args, `?apiKey=${apiKey}`)
  return `${env.remoteUrl}/${url}`
}
