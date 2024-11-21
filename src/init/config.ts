import Initiator from "./initiator"
import { ConfigController } from "../modules/config"
import mainLogger from "../utils/logger"

export default class ConfigInitiator extends Initiator {
  public async init(): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "ConfigInitiator", prefix: ["init"] })

    logger.info("Initializing config for Discord webhooks")
    // discordWebhooks will be set as "CategoryA:id:token,CategoryB:id:token"
    const raw = process.env.DISCORD_WEBHOOKS
    const discordWebhooks = (raw ? raw.split(",") : []).filter((webhook) => webhook.trim() !== "")

    for (const webhook of discordWebhooks) {
      const [key, id, token] = webhook.trim().split(":")
      try {
        logger.info(`Setting config  for Category ${key}`)
        await ConfigController.setConfig(`discord-webhook-${key}-id`, id)
        await ConfigController.setConfig(`discord-webhook-${key}-token`, token)
      } catch (error) {
        logger.warn(`Error while setting config ${key}`)
      }
    }

    // Reading all the delays
    logger.info("Initializing delays")
    const allDelays: Record<string, Record<string, string>> = {
      regular: {
        IndexCategory: process.env.DELAY_REGULAR_INDEX_CATEGORY,
      },
      retry: {
        IndexCategory: process.env.DELAY_RETRY_INDEX_CATEGORY,
        GrabBroadcastStream: process.env.DELAY_RETRY_GRAB_BROADCAST_STREAM,
        UpdateCategoryChannelName: process.env.DELAY_RETRY_UPDATE_CATEGORY_CHANNEL_NAME,
      },
      simple: {
        GrabStream: process.env.DELAY_GRAB_STREAM,
        JellyfinTvRefresh: process.env.DELAY_JELLYFIN_LIVETV_REFRESH,
        PublishGroup: process.env.DELAY_PUBLISH_GROUP,
        UpdateCategoryChannelName: process.env.DELAY_UPDATE_CATEGORY_CHANNEL_NAME,
        RenewStream: process.env.DELAY_RENEW_STREAM,
        IndexCategory: process.env.DELAY_SIMPLE_INDEX_CATEGORY,
      },
    }

    for (const [delayType, delays] of Object.entries(allDelays)) {
      logger.info(`Setting config for delay ${delayType}`)
      for (const [key, value] of Object.entries(delays)) {
        try {
          logger.info(`Setting config for ${delayType}-${key} with value ${value}`)
          await ConfigController.setConfig(`delay-${delayType}-${key}`, value)

          const valueSet = await ConfigController.getConfig(`delay-${delayType}-${key}`)
          logger.info(`Value set for ${delayType}-${key}: ${valueSet.value}`)
        } catch (error) {
          logger.warn(`Error while setting config ${delayType}-${key}`)
        }
      }
    }

    // Reading all the limits
    logger.info("Initializing limits")
    await ConfigController.setConfig("filter-limit-future", process.env.FUTURE_LIMIT)
    await ConfigController.setConfig("filter-limit-past", process.env.PAST_LIMIT)
  }
}
