import { join } from "path"

import { DateTime } from "luxon"

import env from "../../config/env"
import { fileExists, saveFile } from "../../utils/file"
import getGroupEmoji from "../../utils/getEmoji"
import mainLogger from "../../utils/logger"
import { CategoryController } from "../category"
import { GroupController } from "../group"
import { BroadcastDocument, BroadcastStream } from "./model"
import * as BroadcastService from "./service"

export async function createBroadcast(data: BroadcastDocument): Promise<BroadcastDocument> {
  return BroadcastService.createBroadcast(data)
}

export async function getBroadcast(id: string): Promise<BroadcastDocument> {
  return BroadcastService.getBroadcast(id)
}

export async function getBroadcastByName(name: string) {
  return BroadcastService.getBroadcastByName(name)
}

export async function getBroadcastsOfCategory(category: string) {
  return BroadcastService.getBroadcasts({ category })
}

export async function getBroadcastsOfGroup(country: string, group: string, category: string) {
  return BroadcastService.getBroadcasts({ country, group, category })
}

export async function removeBroadcast(id: string): Promise<void> {
  return BroadcastService.removeBroadcast(id)
}

export async function removeBroadcastsOfGroup(group: string, country: string, category: string): Promise<void> {
  return BroadcastService.deleteBroadcasts(group, country, category)
}

export async function removeBroadcastsOfCategory(category: string): Promise<void> {
  return BroadcastService.deleteBroadcasts(null, null, category)
}

export async function setStreamIndex(id: string, streamIndex: number): Promise<BroadcastDocument> {
  return BroadcastService.setStreamIndex(id, streamIndex)
}

export async function setStream(id: string, stream: BroadcastStream): Promise<BroadcastDocument> {
  return BroadcastService.setStream(id, stream)
}

export async function setTunerHostId(id: string, tunerHostId: string): Promise<BroadcastDocument> {
  return BroadcastService.setTunerHostId(id, tunerHostId)
}

export async function setJellyfinId(id: string, jellyfinId: string): Promise<BroadcastDocument> {
  return BroadcastService.setJellyfinId(id, jellyfinId)
}

export async function getM3U8Path(id: string): Promise<string> {
  const broadcast = await BroadcastService.getBroadcast(id)

  if (!broadcast) {
    throw new Error(`Broadcast ${id} not found`)
  }

  return join(env.m3u8Destination, `${broadcast.id}.m3u8`)
}

export async function getDisplayTitle(broadcast: BroadcastDocument): Promise<string> {
  let groupEmoji = getGroupEmoji(broadcast.group.toLocaleLowerCase(), broadcast.group)

  try {
    const group = await GroupController.getGroup({
      name: broadcast.group,
      category: broadcast.category,
      country: broadcast.country,
    })
    if (group && group.emoji) {
      groupEmoji = group.emoji
    }
  } catch (error) {
    // Do nothing
  }

  const category = await CategoryController.getCategory(broadcast.category)

  const channelEmoji = category.emoji ?? ""

  const startTimeStr = DateTime.fromJSDate(broadcast.startTime).toFormat("HH:mm")
  return `${channelEmoji}${groupEmoji} ${startTimeStr} - ${broadcast.name}`
}

export async function generateM3U8File(id: string): Promise<string> {
  const logger = mainLogger.getSubLogger({ name: "BroadcastController", prefix: ["generateM3U8File", `id ${id}`] })
  const broadcast = await BroadcastService.getBroadcast(id)
  const displayTitle = await getDisplayTitle(broadcast)

  const path = await getM3U8Path(id)
  logger.info(`Generating m3u8 file ${path}`)
  let fileContent = "#EXTM3U\n"

  fileContent += `#EXTINF:-1,${displayTitle}\n`
  fileContent += `${env.remoteUrl}/stream/broadcast/${id}/stream\n`

  logger.info(`Saving m3u8 file ${path}`)
  await saveFile(path, fileContent)
  return path
}

export async function m3u8FileExists(id: string): Promise<boolean> {
  const path = await getM3U8Path(id)
  return fileExists(path)
}
