import { DateTime } from "luxon"
import { Types } from "mongoose"

import * as TheSportsDb from "../../api/theSportsDB"
import getGroupEmoji from "../../utils/getEmoji"
import { BroadcastDocument } from "../broadcast"
import { CategoryController } from "../category"
import { GroupController } from "../group"
import PageScrapper, { Selector } from "./scrapper"
import mainLogger from "../../utils/logger"

export type BroadcastData = { link: string, textContent: string, group: string, country: string, startTime: DateTime }

export type CategoryDetails = {
  links: Selector[];
  lookups: Map<string, string[]>;
}

export default abstract class BroadcastsIndexer extends PageScrapper {
  public docs: BroadcastDocument[] = []

  protected abstract categoryDetails: CategoryDetails

  constructor(protected baseUrl: string, public name: string, public category: string) {
    super(`${name}-indexer-${category}`)
  }

  protected async getCategoryLink(url: string): Promise<string[]> {
    const logger = mainLogger.getSubLogger({ name: "BroadcastsIndexer", prefix: ["getCategoryLink", `Indexer ${this.name}`, `category ${this.category}`, `url ${url}`] })
    const [eltLoad] = this.categoryDetails.links
    logger.debug(`Getting page ${url} with element ${eltLoad}`)
    const page = await this.getPage(url, eltLoad.path)

    const ret: string[] = []
    for (const { path } of this.categoryDetails.links) {
      logger.debug(`Evaluating with linkSelector ${path}`)
      const links = await page.$$eval(path, (innerLinks) => (innerLinks as HTMLAnchorElement[]).map(({ href, textContent }) => ({ href, textContent })))
      logger.debug(`Found ${links.length} links`)
      // Default lookup is the category
      const lookups = this.categoryDetails.lookups?.get(this.category) || [this.category]
      logger.debug(`Looking for ${lookups.join(", ")}`)
      for (const categoryLookup of lookups) {
        const allLinks = links.filter((link) => !!link)
        const categoryLink = allLinks.find((link) => link.textContent?.toLocaleLowerCase().includes(categoryLookup.toLocaleLowerCase()))
        if (categoryLink) {
          logger.info(`Found category link ${categoryLink.href}`)
          ret.push(categoryLink.href)
        }
      }
    }
    return ret
  }

  public async generate(): Promise<BroadcastDocument[]> {
    const logger = mainLogger.getSubLogger({ name: "BroadcastsIndexer", prefix: ["generate", `Indexer ${this.name}`, `category ${this.category}`] })
    try {
      const links = await this.getCategoryLink(this.baseUrl)
      for (const link of links) {
        for (const data of await this.getBroadcastsData(link)) {
          this.docs.push(await this.broadcastDataToBroadcastDocument(data))
        }
      }
    } catch (error) {
      logger.error(error)
      logger.warn("No data found")
    }
    const browser = await this.getBrowser()
    await browser.close()
    return this.docs.filter((doc) => !!doc)
  }

  protected async broadcastDataToBroadcastDocument(data: BroadcastData): Promise<BroadcastDocument> {
    const logger = mainLogger.getSubLogger({ name: "BroadcastsIndexer", prefix: ["broadcastDataToBroadcastDocument"] })

    // streamName will be either
    // Team1 v Team2
    // Team1 vs Team2
    // Team1 - Team2
    // We want to get the 2 teams name and use the sportAPI to get the group
    if (!data.group) {
      const eventRegex = /^(?<team1>.+?) (?:v|vs|-) (?<team2>.+)$/
      const eventMatch = data.textContent.match(eventRegex)
      if (!eventMatch) {
        logger.warn(`No event match found for ${data.textContent}`)
        return null
      }
      const { team1, team2 } = eventMatch.groups
      const event = await TheSportsDb.searchGame(team1, team2)
      if (!event) {
        logger.warn(`No event found for ${team1} vs ${team2}`)
      } else {
        logger.info(`Found event ${event.strEvent} for ${team1} vs ${team2}`)
        data.group = event.strEvent
      }
    }

    if (!data.group) {
      logger.warn(`No group found for broadcast ${data.textContent}`)
      return null
    }

    const startTimeStr = data.startTime.toFormat("HH:mm")
    let groupEmoji = getGroupEmoji(data.group.toLocaleLowerCase(), data.group)

    try {
      const group = await GroupController.getGroup({ name: data.group, category: this.category, country: data.country })
      if (group) {
        groupEmoji = group.emoji
      }
    } catch (error) {
      // Do nothing
    }
    // const formattedContent = convertBroadcastTitle(data.textContent)
    const category = await CategoryController.getCategory(this.category)
    const channelEmoji = category.emoji ?? ""
    const displayTitle = `${channelEmoji}${groupEmoji} ${startTimeStr} - ${data.textContent}`
    return {
      indexer: this.name,
      category: this.category,
      group: data.group || "Amical",
      country: data.country,
      name: data.textContent,
      displayTitle,
      startTime: data.startTime.toJSDate(),
      link: data.link,
      streams: new Types.DocumentArray<{
        url: string;
        referer?: string;
        expiresAt?: Date;
      }>([]),
      streamIndex: 0,
    }
  }

  abstract getBroadcastsData(url: string): Promise<BroadcastData[]>
}
