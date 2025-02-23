import axios from "axios"

import env from "../config/env"
import mainLogger from "../utils/logger"

export type Application = {
  id: number
  token: string
  name: string
  description: string
  internal: boolean
  image: string
  defaultPriority?: number
  lastUsed?: string
}

type ApplicationParams = {
  name: string
  description?: string
  defaultPriority?: number
}

type Message = {
  id: number
  appid: number
  message: string
  date: string
  extras?: Record<string, unknown>
  priority?: number
  title?: string
}

type MessageParams = {
  message: string
  priority?: number
  title?: string
  extras?: Record<string, unknown>
}

const instance = axios.create({
  baseURL: env.publishers.gotify.url,
  headers: { "X-Gotify-Key": env.publishers.gotify.token },
})

async function getApplications(): Promise<Application[]> {
  const logger = mainLogger.child({ name: "Gotify", func: "getApplications" })
  logger.info("Getting applications")
  const { data } = await instance.get<Application[]>("/application")
  return data
}

async function getApplication(name: string): Promise<Application> {
  const logger = mainLogger.child({ name: "Gotify", func: "getApplication" })
  logger.info(`Getting application ${name}`)
  const applications = await getApplications()
  return applications.find((app) => app.name === name)
}

async function createApplication(params: ApplicationParams): Promise<Application> {
  const logger = mainLogger.child({ name: "Gotify", func: "createApplication" })
  logger.info(`Creating application ${params.name}`)
  const { data } = await instance.post<Application>("/application", params)
  return data
}

async function deleteApplication(appId: number): Promise<void> {
  const logger = mainLogger.child({ name: "Gotify", func: "deleteApplication" })
  logger.info(`Deleting application ${appId}`)
  await instance.delete(`/application/${appId}`)
}

async function createMessage(application: Application, params: MessageParams): Promise<Message> {
  const logger = mainLogger.child({ name: "Gotify", func: "createMessage" })
  logger.info(`Creating message for application ${application.name}`)
  const { data } = await instance.post<Message>(`/message?token=${application.token}`, params)
  return data
}

async function deleteMessage(messageId: string): Promise<void> {
  const logger = mainLogger.child({ name: "Gotify", func: "deleteMessage" })
  logger.info(`Deleting message ${messageId}`)
  try {
    await instance.delete(`/message/${messageId}`)
  } catch (error) {
    logger.warn(`Failed to delete message ${messageId}. Error: ${error}`)
  }
}

async function getMessagesOfApplication(appId: number): Promise<Message[]> {
  const logger = mainLogger.child({ name: "Gotify", func: "getMessagesOfApplication" })
  logger.info(`Getting messages of application ${appId}`)
  const res = await instance.get<{ messages: Message[] }>(`/application/${appId}/message`)
  return res.data.messages
}

const GotifyAPI = {
  getApplications,
  getApplication,
  createApplication,
  deleteApplication,
  createMessage,
  deleteMessage,
  getMessagesOfApplication,
}

export { GotifyAPI }
