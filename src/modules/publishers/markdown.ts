import { JellyfinAPI } from "../../api/jellyfin"
import convertTimeToEmoji from "../../utils/formatter"
import mainLogger from "../../utils/logger"
import urlJoin from "../../utils/urlJoin"
import { BroadcastDocument } from "../broadcast/model"
import { CategoryController, CategoryDocument } from "../category"
import { GroupDocument } from "../group"
import { IndexerController } from "../indexer"
import { UUIDController } from "../uuid"
import { Publisher } from "./types"

abstract class MarkdownPublisher extends Publisher {
  protected abstract sendMessage(category: CategoryDocument, content: string): Promise<string[]>

  protected async sendCategoryMessages(category: CategoryDocument): Promise<string[]> {
    const { uuid: apiKey } = await UUIDController.getUUID()
    const logger = mainLogger.child({
      name: "MarkdownPublisher",
      func: "sendCategoryMessages",
      data: { category: category.name },
    })
    logger.debug("Sending category messages")
    const indexers = await IndexerController.getIndexers(true)

    // Create the new message for the category and store it in the
    const channelEmoji = category.emoji ?? ""
    const collectionUrl = await JellyfinAPI.getCollectionUrl(category.name)
    // OpenedUrl link
    const apiLinks = [
      // Collection
      `[${channelEmoji}](<${collectionUrl}>)`,
      // `${channelEmoji}`,
      // Reload
      indexers
        .map(
          ({ name }) => `[\`🔄 ${name}\`](<${urlJoin(apiKey, "indexer", name, "category", category.name, "reload")}>)`,
        )
        .join("  "),
      // Pages
      `[\`📃 Pages\`](<${urlJoin(apiKey, "monitor", "openedUrl")}>)`,
      // Kill
      // `[\`❌ Kill\`](<${urlJoin(apiKey, "monitor", "killBrowsers")}>)`,
      // Refresh all groups for this category
      `[\`🔄 Refresh groups\`](<${urlJoin(apiKey, "category", category.name, "reload")}>)`,
      // Refresh channel name for this category
      `[\`🔄 Refresh channel name\`](<${urlJoin(apiKey, "category", category.name, "channelName")}>)`,
      // Add a link to the page of each indexer
    ]

    // Generate a Reload link for each indexer
    let content = `# **${apiLinks.join(" ")}**`
    content += [
      // "\n",
    ].join("")
    logger.info("Sending the message to Discord")

    return this.sendMessage(category, content)
  }

  protected async sendGroupMessages(groupDocument: GroupDocument, broadcasts: BroadcastDocument[]): Promise<string[]> {
    const { name: group, category, country } = groupDocument
    const logger = mainLogger.child({
      name: "MarkdownPublisher",
      func: "sendGroupMessages",
      data: {
        group,
        category,
      },
    })
    logger.debug("Sending group messages")

    // Sorting the broadcasts by StartTime and by jellyfinId presence
    broadcasts.sort((broadcastA, broadcastB) => {
      // First sort by JellyfinId presence
      if (broadcastA.jellyfinId && !broadcastB.jellyfinId) {
        return -1
      }
      if (!broadcastA.jellyfinId && broadcastB.jellyfinId) {
        return 1
      }
      // Then sort by StartTime
      return broadcastA.startTime.getTime() - broadcastB.startTime.getTime()
    })

    // Generating the messages to send
    const { uuid: apiKey } = await UUIDController.getUUID()
    const reloadLink = urlJoin(apiKey, "group", group, country, "category", category, "reload")

    const groupLines = [
      `## ${groupDocument.emoji || "🌍"} **${groupDocument.name}**  [🔄 Reload 🔄](<${encodeURI(reloadLink)}>)`,
    ]
    const maxLength = this.getMaxTeamLength(broadcasts)
    for (const broadcast of broadcasts) {
      const messages = await this.generateBroadcastMessage(broadcast, maxLength)
      groupLines.push(`${messages}`)
    }

    const groupMessages = groupLines.join("\n")
    const categoryDocument = await CategoryController.getCategory(category)
    return this.sendMessage(categoryDocument, groupMessages)
  }

  private getMaxTeamLength(broadcasts: BroadcastDocument[]): number {
    const maxTeamLength = broadcasts.reduce((acc, broadcast) => {
      if (!broadcast.name.includes("🆚")) {
        return acc
      }
      const [team1, team2] = broadcast.name.split("🆚")
      return Math.max(acc, team1.length, team2.length)
    }, 0)
    return maxTeamLength + 1 // Add a space
  }

  private async generateBroadcastMessage(broadcast: BroadcastDocument, maxTeamLength: number): Promise<string> {
    // Format name
    const teamSeparator = "🆚"
    // The names are formatted like this: "Team 1 🆚 Team 2"
    // We want to align the 🆚 emoji
    // Clone broadcast.name
    let displayContent = `${broadcast.name}`
    if (displayContent.includes(teamSeparator)) {
      const [team1, team2] = displayContent.split(teamSeparator)
      const padding = " ".repeat(Math.max(maxTeamLength - team1.length, 0))
      const padding2 = " ".repeat(Math.max(maxTeamLength - team2.length, 0))
      displayContent = `${team1}${padding}${teamSeparator}${team2}${padding2}`
    } else {
      // Full length should be 2x maxTeamLength + 1
      const maxSize = 2 * maxTeamLength + 2
      const padding = " ".repeat(maxSize - displayContent.length)
      displayContent = `${displayContent}${padding}`
    }

    const { uuid: apiKey } = await UUIDController.getUUID()

    const url = broadcast.jellyfinId ? await JellyfinAPI.getContentUrl(broadcast.jellyfinId) : ""
    const watchLink = url ? `[▶️ Watch ▶️](<${url}>)` : ""
    const resetStreamIndex = urlJoin(apiKey, "broadcast", broadcast.id, "resetStreamIndex")
    const tryNextStreamUrl = urlJoin(apiKey, "broadcast", broadcast.id, "nextStream")
    const askForStreamNow = urlJoin(apiKey, "broadcast", broadcast.id, "askForStreamNow")

    // FYI Links do not work in code blocks
    const links = [
      // Markdown dash for list
      "- ",
      // Optionnal watch link
      watchLink ?? null,
      // Markdown code open
      "`",
      " ",
      // Start time
      convertTimeToEmoji(broadcast.startTime),
      "  ",
      // Display content
      displayContent,
      // Markdown code close
      "` ",
      watchLink ? ` [↩️ Reset ↩️](<${resetStreamIndex}>)` : "",
      // Optionnal next stream link
      watchLink ? ` [⏭️ Next ⏭️](<${tryNextStreamUrl}>)` : "",
      // Optionnal streamIndex
      watchLink ? ` Stream ${broadcast.streamIndex}` : "",
      // Optionnal ask for stream now
      ` [${watchLink ? "🔄 Refresh link 🔄" : "🔴 Ask for stream now 🔴"}](<${askForStreamNow}>)`,
      // Broadcast Link with browser emoji 🌐
      ` [🌐 Page 🌐](<${broadcast.link}>)`,
    ].filter((link) => link)

    return links.join("")
  }
}

export default MarkdownPublisher
