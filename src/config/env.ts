import { SupportedBrowser } from "puppeteer-core"
import { v4 as uuidv4 } from "uuid"

// Read .env file
export default {
  logLevel: process.env.LOG_LEVEL,
  logData: process.env.LOG_DATA === "true",
  nodeUuid: uuidv4(),
  dev: process.env.NODE_ENV === "development",
  devIndexer: process.env.DEV_INDEXER,
  devCategory: process.env.DEV_CATEGORY,
  port: parseInt(process.env.PORT, 10),
  mongo: {
    url: process.env.MONGO_URL,
    db: process.env.MONGO_DB,
    agendaDb: process.env.MONGO_AGENDA_DB,
  },
  remoteUrl: process.env.BROADCASTARR_REMOTE_URL,
  m3u8Destination: process.env.M3U8_FOLDER,
  imagesFolder: process.env.IMAGES_FOLDER,
  browser: {
    userAgent: process.env.USER_AGENT,
    browser: process.env.BROWSER as SupportedBrowser,
    executablePath: process.env.BROWSER_EXECUTABLE_PATH,
  },
  publishers: {
    discord: {
      token: process.env.DISCORD_USER_TOKEN,
      botAvatar: process.env.DISCORD_WEBHOOK_AVATAR || null,
      botName: process.env.DISCORD_WEBHOOK_USERNAME || null,
    },
    matrix: {
      url: process.env.MATRIX_URL,
      user: process.env.MATRIX_USER,
      serverName: process.env.MATRIX_SERVER_NAME,
      accessToken: process.env.MATRIX_ACCESS_TOKEN,
      additionalAdmins: process.env.MATRIX_ADDITIONAL_ADMINS.split(","),
    },
    gotify: {
      url: process.env.GOTIFY_URL,
      token: process.env.GOTIFY_TOKEN,
    },
  },
  filters: {
    channels: (process.env.CHANNELS || "").split(","),
  },
  jellyfin: {
    url: process.env.JELLYFIN_URL,
    token: process.env.JELLYFIN_TOKEN,
    collectionUrl: process.env.JELLYFIN_COLLECTION_URL,
  },
  theSportsDb: {
    url: "https://www.thesportsdb.com/api/v1/json/",
    apiKey: "3",
  },
  discordBot: {
    active: process.env.DISCORD_BOT_ACTIVE === "true",
    clientId: process.env.DISCORD_BOT_CLIENT_ID,
    token: process.env.DISCORD_BOT_TOKEN,
  },
}
