import { readdirSync, readFileSync } from "fs"
import { join } from "path"

import { IndexerController, IndexerDocument } from "../modules/indexer"
import mainLogger from "../utils/logger"
import { Bootstrapper } from "./bootstrapper"

export class IndexersBootstrapper extends Bootstrapper {
  public async bootstrap(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "IndexersBootstrapper", prefix: ["bootstrap"] })
    logger.info("Bootstrapping indexers")

    const folder = process.env.DATA_FOLDER
    const files = await readdirSync(folder)
    for (const file of files) {
      try {
        const filePath = join(folder, file)
        const raw = await readFileSync(filePath, "utf-8")
        const data = await this.generateData(raw)
        try {
          await IndexerController.getIndexer(data.name)
          logger.info(`Indexer ${data.name} already exists`)
        } catch (error) {
          // If the indexer does not exist, we create it
          logger.info(`Creating indexer ${data.name}`)
          await IndexerController.createIndexer(data.name, data.url)
        }
        await IndexerController.getIndexer(data.name)
        logger.info(`Updating indexer ${data.name}`)
        await IndexerController.updateLogin(data.name, data.login)
        await IndexerController.updateActive(data.name, data.active)
        await IndexerController.updateIndexerData(data.name, data.data)
        await IndexerController.updateIndexerInterceptorData(data.name, data.interceptorData)
      } catch (error) {
        logger.warn(`Error while processing file ${file} - ${error.message}`)
      }
    }
  }

  private async generateData(raw: string): Promise<IndexerDocument> {
    const logger = mainLogger.getSubLogger({ name: "IndexersBootstrapper", prefix: ["generateData"] })
    logger.info("Generating data for indexer")
    const data = JSON.parse(raw) as IndexerDocument
    return {
      ...data,
      active: data.active || false,
    }
  }
}
