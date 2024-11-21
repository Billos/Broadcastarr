import { readdirSync } from "fs"
import { join } from "path"

import { IReleaser, isReleaser } from "./types"
import mainLogger from "../../utils/logger"
import { BroadcastDocument } from "../broadcast"

const logger = mainLogger.getSubLogger({ name: "Releaser", prefix: ["index"] })

// This index file will return an array of IReleaser instances.
// The instances are created with the classes found in the ./implementations folder.

// Reading the implementation folder
const releasers: IReleaser[] = []

const files = readdirSync(join(__dirname, "implementations"))
logger.info(`Found ${files.length} releasers: ${files.join(", ")}`)
// Importing the classes
for (const file of files) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires
    const releaser = require(`./implementations/${file}`).default as IReleaser

    // Check if the instance is a valid
    isReleaser(releaser)

    releasers.push(releaser)
  } catch (error) {
    logger.error(`Error importing releaser ${file}`, error)
  }
}

async function initReleasers(): Promise<void> {
  for (const releaser of releasers) {
    await releaser.init()
  }
}

async function releaseBroadcast(broadcast: BroadcastDocument): Promise<void> {
  for (const releaser of releasers) {
    await releaser.releaseBroadcast(broadcast)
  }
}

async function unreleaseBroadcast(broadcast: BroadcastDocument): Promise<void> {
  for (const releaser of releasers) {
    await releaser.unreleaseBroadcast(broadcast)
  }
}

const ReleasersController = {
  initReleasers,
  releaseBroadcast,
  unreleaseBroadcast,
}

// eslint-disable-next-line import/prefer-default-export
export { ReleasersController }
