import mainLogger from "./logger"
import groupsEmojis from "./types"

export default function getGroupEmoji(group: string, defaultValue: string = ""): string {
  const logger = mainLogger.getSubLogger({ name: "getEmoji", prefix: ["getGroupEmoji", `group ${group}`] })

  const emoji = groupsEmojis[group.toLocaleLowerCase()]
  if (!emoji) {
    logger.warn("No emoji found")
  }
  return emoji || defaultValue
}
