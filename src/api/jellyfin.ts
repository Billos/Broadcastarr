import { join } from "path"

import axios from "axios"

import env from "../config/env"
import { checkImageExists, getImage } from "../utils/file"
import mainLogger from "../utils/logger"
import sleep from "../utils/sleep"

type ScheduledTasks = {
  Id: string;
  Key: string;
  State: "Idle" | "Cancelling" | "Running";
}

type ServerInfo = {
  Id: string;
}

type Item = {
  Id: string;
  Name: string;
}

type CollectionFolder = Item
type Collection = Item
type TvChannel = Item

type ItemSearch<T> = {
  Items: T[];
  TotalRecordCount: number;
  StartIndex: number;
}

type LiveTVConfig = {
  TunerHosts: {
    Id: string;
    Url: string;
  }[];
}

const instance = axios.create({ baseURL: env.jellyfin.url })
instance.interceptors.request.use((config) => {
  const TOKEN = `api_key=${env.jellyfin.token}`
  // Add Token as query param
  // If url already has query params, add the token at the end
  if (config.url.includes("?")) {
    config.url = `${config.url}&${TOKEN}`
  } else {
    config.url = `${config.url}?${TOKEN}`
  }

  return config
})

let savedServerId: string = null
async function getServerId(): Promise<string> {
  if (!savedServerId) {
    const logger = mainLogger.getSubLogger({ name: "Jellyfin", prefix: ["getServerId"] })
    logger.debug("getServerId")
    const { data: { Id } } = await instance.get<ServerInfo>("/System/Info/Public")
    savedServerId = Id
  }
  return savedServerId
}

async function waitTaskDone(taskId: string): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "Jellyfin", prefix: ["waitTaskDone"] })
  logger.debug("Awaiting")
  const task = await instance.get<ScheduledTasks>(`/ScheduledTasks/${taskId}`)
  if (task.data.State === "Idle") {
    logger.info("Done")
    return
  }

  await sleep(1500)
  return waitTaskDone(taskId)
}

async function refreshJellyfinTV(): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "Jellyfin", prefix: ["refreshJellyfinTV"] })
  logger.info("Start")
  // Get all the scheduled tasks
  const scheduledTasks = await instance.get<ScheduledTasks[]>("/ScheduledTasks")

  // Find the task that refreshes the LiveTV, key being RefreshGuide
  const refreshGuideTask = scheduledTasks.data.find((task) => task.Key === "RefreshGuide")

  // Start the task
  await instance.post(`/ScheduledTasks/Running/${refreshGuideTask.Id}`)
  return waitTaskDone(refreshGuideTask.Id)
}

async function addItemToCollection(collectionId: string, itemId: string): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "Jellyfin", prefix: ["addItemToCollection", `collectionId ${collectionId}`, `itemId ${itemId}`] })
  logger.debug("Query")
  await instance.post(`/Collections/${collectionId}/Items?Ids=${itemId}`)
}

async function getCollectionsCollectionFolders(): Promise<CollectionFolder> {
  const logger = mainLogger.getSubLogger({ name: "Jellyfin", prefix: ["getCollectionsCollectionFolders"] })
  logger.trace("getCollectionsCollectionFolders")
  const { data: { Items: collectionFolders } } = await instance.get<ItemSearch<CollectionFolder>>("/Items?Recursive=true&IncludeItemTypes=CollectionFolder")
  return collectionFolders.find((folder) => folder.Name === "Collections")
}

async function getCollection(collectionName: string): Promise<Collection> {
  const logger = mainLogger.getSubLogger({ name: "Jellyfin", prefix: ["getCollection", `collectionName ${collectionName}`] })
  logger.trace("getCollection")
  const { Id } = await getCollectionsCollectionFolders()
  const { data: { Items: [collection] } } = await instance.get<ItemSearch<Collection>>(`/Items?ParentId=${Id}&searchTerm=${collectionName}&Recursive=true`)
  return collection
}

async function createCollection(collectionName: string): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "Jellyfin", prefix: ["createCollection", `collectionName ${collectionName}`] })
  logger.info("createCollection")
  const { Id: parentId } = await getCollectionsCollectionFolders()
  await instance.post<Item>(`/Collections?ParentId=${parentId}&Name=${collectionName}`)
}

async function setItemImage(collectionName: string): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "Jellyfin", prefix: ["setItemImage", `collectionName ${collectionName}`] })
  logger.debug("setItemImage")
  // Check if the image exists
  if (!checkImageExists(collectionName)) {
    logger.warn("Image does not exist")
    return
  }

  const { Id } = await getCollection(collectionName)
  // Get the image binary
  const image = await getImage(collectionName)

  // Post the image binary
  logger.info("Posting image")
  await instance.post(`/Items/${Id}/Images/Primary`, image, { headers: { "Content-Type": "image/png" } })
}

async function getChannels(): Promise<TvChannel[]> {
  const logger = mainLogger.getSubLogger({ name: "Jellyfin", prefix: ["getChannels"] })
  logger.trace("getChannels")
  const { data: { Items: channels } } = await instance.get<ItemSearch<TvChannel>>("/LiveTv/Channels")
  return channels
}

async function getChannelId(channelName: string): Promise<string> {
  const logger = mainLogger.getSubLogger({ name: "Jellyfin", prefix: ["getChannelId", `channelName ${channelName}`] })
  logger.trace("getChannelId")
  const channels = await getChannels()
  return channels.find((channel) => channel.Name.includes(channelName))?.Id
}

async function getTvTunerHostsPaths(): Promise<string[]> {
  const logger = mainLogger.getSubLogger({ name: "Jellyfin", prefix: ["getTvTunerHostsPaths"] })
  logger.debug("getTvTunerHostsPaths")
  const { data: { TunerHosts } } = await instance.get<LiveTVConfig>("/System/Configuration/livetv")
  return TunerHosts.map((tunerHost) => tunerHost.Url)
}

async function removeTunerHost(tunerHostId: string): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "Jellyfin", prefix: ["removeTunerHost", `tunerHostId ${tunerHostId}`] })
  logger.debug("removeTunerHost")
  await instance.delete(`/LiveTv/TunerHosts?id=${tunerHostId}`)
}

async function clearTvTunerHosts(): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "Jellyfin", prefix: ["clearTvTunerHosts"] })
  logger.debug("clearTvTunerHosts")
  const { data: { TunerHosts } } = await instance.get<LiveTVConfig>("/System/Configuration/livetv")
  for (const tunerHost of TunerHosts) {
    // Do not delete a tuner that has freebox in its Url
    if (!tunerHost.Url.includes("freebox")) {
      await removeTunerHost(tunerHost.Id)
    }
  }
}

async function createTunerHost(Url: string): Promise<string> {
  const logger = mainLogger.getSubLogger({ name: "Jellyfin", prefix: ["createTunerHost", `Url ${Url}`] })
  logger.debug("createTunerHost")
  const tunerHost = await instance.post<Item>("/LiveTv/TunerHosts", {
    DeviceId: null,
    FriendlyName: null,
    AllowHWTranscoding: false,
    EnableStreamLooping: true,
    ImportFavoritesOnly: false,
    TunerCount: "0",
    Type: "m3u",
    Url,
    UserAgent: null,
  })
  return tunerHost.data.Id
}

const collectionUrl = join(env.jellyfin.url, "web/index.html#!/details")

async function getContentUrl(jellyfinId: string): Promise<string> {
  const serverId = await getServerId()
  return `${collectionUrl}?id=${jellyfinId}&serverId=${serverId}`
}

async function getCollectionUrl(collectionName: string): Promise<string> {
  const { Id: collectionId } = await getCollection(collectionName)
  const serverId = `serverId=${await getServerId()}`
  return `${collectionUrl}?id=${collectionId}&${serverId}`
}

const JellyfinAPI = {
  refreshJellyfinTV,
  addItemToCollection,
  getCollection,
  createCollection,
  setItemImage,
  getChannelId,
  getTvTunerHostsPaths,
  removeTunerHost,
  clearTvTunerHosts,
  createTunerHost,
  getContentUrl,
  getCollectionUrl,
}

// eslint-disable-next-line import/prefer-default-export
export { JellyfinAPI }
