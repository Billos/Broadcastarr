import { join } from "path"

import axios, { AxiosError } from "axios"

import env from "../config/env"
import mainLogger from "../utils/logger"
import sleep from "../utils/sleep"

const botInstance = axios.create({
  baseURL: "https://discord.com/api/webhooks/",
})
const userInstance = axios.create({
  baseURL: "https://discord.com/api/channels/",
  headers: { Authorization: env.publishers.discord.token },
})

// axios capture error
async function retry(error: AxiosError) {
  const logger = mainLogger.getSubLogger({ name: "Discord", prefix: ["retry"] })
  // If we hit the rate limit, we wait 500ms and retry
  if (error.response.status === 429) {
    const retryAfter = error.response.headers["retry-after"]
    // Round up to the next second
    const sleepTime = parseInt(retryAfter, 10) * 1000 + 100
    logger.warn(`Rate limit exceeded for url ${error.config.url} - Waiting ${sleepTime / 1000} s`)
    await sleep(sleepTime)
    return botInstance(error.config)
  }
  // If the error is that we tried to delete a message that doesn't exist, we ignore it
  if (error.response.status === 404 && error.config.method === "delete") {
    logger.info(`Message doesn't exist for url ${error.config.url}`)
    return Promise.resolve()
  }

  logger.error(`Error for url ${error.config.url}`, error.response.data)
  return Promise.reject(error)
}
botInstance.interceptors.response.use((response) => response, (err) => retry(err))
userInstance.interceptors.response.use((response) => response, (err) => retry(err))

// Send a message to Discord
// Different errors may occur (see https://discord.com/developers/docs/topics/opcodes-and-status-codes#http)
async function sendDiscordMessage(webhookId: string, webhookToken: string, content: string): Promise<string> {
  const logger = mainLogger.getSubLogger({ name: "Discord", prefix: ["sendDiscordMessage", `content ${content}`] })
  if (content.length > 2000) {
    logger.warn(`Message is too long: ${content.length} characters`)
  }
  const url = join(webhookId, `${webhookToken}?wait=true`)
  logger.trace("Sending message")
  const { data: { id } } = await botInstance.post(url, {
    content,
    username: env.publishers.discord.botName,
    avatar_url: env.publishers.discord.botAvatar,
  })
  return id
}

async function deleteWebhookMessage(webhookId: string, webhookToken: string, messageId: string): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "Discord", prefix: ["deleteWebhookMessage", `messageId ${messageId}`] })
  logger.trace("Deleting webhook message")
  const url = join(webhookId, webhookToken, "messages", messageId)
  await botInstance.delete(url)
}

async function getChannelIdWebhook(webhookId: string, webhookToken: string): Promise<string> {
  const logger = mainLogger.getSubLogger({ name: "Discord", prefix: ["getChannelIdWebhook", `webhookId ${webhookId}`] })
  logger.trace("Getting channel id")
  const url = join(webhookId, webhookToken)
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { data: { channel_id } } = await botInstance.get<{ channel_id: string }>(url)
  return channel_id
}

async function updateChannelName(channelId: string, name: string): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "Discord", prefix: ["updateChannelName", `channelId ${channelId}`, `name ${name}`] })
  logger.trace("Updating channel name")
  try {
    await userInstance.patch(channelId, { name })
  } catch (error) {
    logger.error("Error while updating channel name", error.response.data)
  }
}

async function deleteMessage(channelId: string, messageId: string): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "Discord", prefix: ["deleteMessage", `channelId ${channelId}`, `messageId ${messageId}`] })
  logger.trace("Deleting message")
  const url = join(channelId, "messages", messageId)
  await userInstance.delete(url)
}

async function getChannelMessages(channelId: string, after?: string): Promise<string[]> {
  const logger = mainLogger.getSubLogger({ name: "Discord", prefix: ["getChannelMessages", `channelId ${channelId}`] })
  logger.trace("Getting messages from channel")
  const url = join(channelId, `messages?limit=100${after ? `&after=${after}` : ""}`)
  const res = await userInstance.get<{ id: string }[]>(url)
  return res.data.map((message) => message.id)
}

async function emptyChannel(channelId: string): Promise<void> {
  const logger = mainLogger.getSubLogger({ name: "Discord", prefix: ["emptyChannel", `channelId ${channelId}`] })
  logger.trace("Emptying channel")

  // A getChannelMessages will return the last 100 messages, we want to delete all of them
  let messages = await getChannelMessages(channelId)
  while (messages.length) {
    logger.debug(`Deleting ${messages.length} messages`)
    for (const id of messages) {
      await deleteMessage(channelId, id)
    }
    messages = await getChannelMessages(channelId)
  }
}

const DiscordAPI = {
  sendDiscordMessage,
  deleteWebhookMessage,
  getChannelIdWebhook,
  getChannelMessages,
  updateChannelName,
  emptyChannel,
}

// eslint-disable-next-line import/prefer-default-export
export { DiscordAPI }
