import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "fs"
import { join } from "path"

import mainLogger from "./logger"

export async function saveFile(fileName: string, content: string): Promise<void> {
  const logger = mainLogger.child({
    name: "File",
    func: "saveFile",
    data: { fileName },
  })
  logger.debug("Saving file")
  return writeFileSync(fileName, content, { encoding: "utf-8" })
}

export async function removeFile(fileName: string): Promise<void> {
  const logger = mainLogger.child({
    name: "File",
    func: "removeFile",
    data: { fileName },
  })
  logger.debug("Removing file")
  return unlinkSync(fileName)
}

export async function fileExists(fileName: string): Promise<boolean> {
  const logger = mainLogger.child({
    name: "File",
    func: "fileExists",
    data: { fileName },
  })
  logger.debug("Checking if file exists")
  return existsSync(fileName)
}

export async function emptyFolder(folder: string, filter: string): Promise<void> {
  const logger = mainLogger.child({
    name: "File",
    func: "emptyFolder",
    data: { folder, filter },
  })
  logger.debug("Emptying folder")
  const files = readdirSync(folder).filter((file) => file.includes(filter))
  for (const file of files) {
    const path = join(folder, file)
    logger.debug(`Removing file ${path}`)
    await removeFile(path)
  }
}

export async function checkImageExists(imageName: string): Promise<boolean> {
  const logger = mainLogger.child({
    name: "File",
    func: "checkImageExists",
    data: { imageName },
  })
  logger.debug("CheckImageExists")
  const filepath = join(__dirname, "..", "..", "assets", `${imageName}.png`)
  return existsSync(filepath)
}

export async function getImage(imageName: string): Promise<string> {
  const logger = mainLogger.child({
    name: "File",
    func: "getImage",
    data: { imageName },
  })
  logger.debug("Getting image")
  const filepath = join(__dirname, "..", "..", "assets", `${imageName}.png`)
  return readFileSync(filepath, { encoding: "base64" })
}
