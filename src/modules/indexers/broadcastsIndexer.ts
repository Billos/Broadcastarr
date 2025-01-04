import { DateTime } from "luxon"
import { Types } from "mongoose"
import { Page } from "puppeteer"

import * as TheSportsDb from "../../api/theSportsDB"
import mainLogger from "../../utils/logger"
import sleep from "../../utils/sleep"
import { BroadcastDocument } from "../broadcast"
import PageScrapper, { Selector } from "./scrapper"

export type BroadcastData = { link: string; textContent: string; group: string; country: string; startTime: DateTime }

export type CategoryDetails = {
  links?: Selector[]
  clicks?: Selector[]
  lookups: Map<string, string[]>
}

export default abstract class BroadcastsIndexer extends PageScrapper {
  public docs: BroadcastDocument[] = []

  protected abstract loadPageElement: string

  protected abstract categoryDetails: CategoryDetails

  constructor(
    protected baseUrl: string,
    public name: string,
    public category: string,
  ) {
    super(`${name}-indexer-${category}`)
  }

  protected async getCategoryLink(url: string): Promise<string[]> {
    const logger = mainLogger.getSubLogger({
      name: "BroadcastsIndexer",
      prefix: [
        "getCategoryLink",
        `Indexer ${this.name}`,
        `category ${this.category}`,
        `url ${url}`,
      ],
    })
    const [eltLoad] = this.categoryDetails.links
    logger.debug(`Getting page ${url} with element ${eltLoad}`)
    const page = await this.getPage(url, eltLoad.path)

    const ret: string[] = []
    for (const { path } of this.categoryDetails.links) {
      logger.debug(`Evaluating with linkSelector ${path}`)
      const links = await page.$$eval(path, (innerLinks) =>
        (innerLinks as HTMLAnchorElement[]).map(({ href, textContent }) => ({ href, textContent })),
      )
      logger.debug(`Found ${links.length} links`)
      // Default lookup is the category
      const lookups = this.categoryDetails.lookups?.get(this.category) || [this.category]
      logger.debug(`Looking for ${lookups.join(", ")}`)
      for (const categoryLookup of lookups) {
        const allLinks = links.filter((link) => !!link)
        const categoryLink = allLinks.find((link) =>
          link.textContent?.toLocaleLowerCase().includes(categoryLookup.toLocaleLowerCase()),
        )
        if (categoryLink) {
          logger.info(`Found category link ${categoryLink.href}`)
          ret.push(categoryLink.href)
        }
      }
    }
    return ret
  }

  public async generate(): Promise<BroadcastDocument[]> {
    const logger = mainLogger.getSubLogger({
      name: "BroadcastsIndexer",
      prefix: [
        "generate",
        `Indexer ${this.name}`,
        `category ${this.category}`,
      ],
    })
    try {
      // If the links are anchors, we can directly get the broadcasts
      if (this.categoryDetails.links && this.categoryDetails.links.length > 0) {
        const links = await this.getCategoryLink(this.baseUrl)
        for (const link of links) {
          const page = await this.getPage(link, this.loadPageElement)
          const broadcastData = await this.getBroadcastsData(page)
          for (const data of broadcastData) {
            this.docs.push(await this.broadcastDataToBroadcastDocument(data))
          }
        }
      }

      // If the links are not anchors, we need to find elements to click on
      if (this.categoryDetails.clicks && this.categoryDetails.clicks.length > 0) {
        const page = await this.getPage(this.baseUrl, this.loadPageElement)
        let index = 0
        for (const selector of this.categoryDetails.clicks) {
          await page.screenshot({ path: `/data/images/${index}.png`, fullPage: true })
          const elts = await this.getElements(page, [selector])
          if (elts.length === 0) {
            logger.warn(`No element found for selector ${selector.path}`)
            console.log(await page.url())
            continue
          }
          const [elt] = elts
          logger.info(`Clicking on element ${selector.path}`)
          await elt.click()
          await sleep(500)
          index++
        }
        await page.screenshot({ path: `/data/images/${index}.png` })
        const broadcastData = await this.getBroadcastsData(page)
        for (const data of broadcastData) {
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

    return {
      indexer: this.name,
      category: this.category,
      group: data.group || "Amical",
      country: data.country,
      name: data.textContent,
      startTime: data.startTime.toJSDate(),
      link: data.link,
      streams: new Types.DocumentArray<{
        url: string
        referer?: string
        expiresAt?: Date
      }>([]),
      streamIndex: 0,
    }
  }

  abstract getBroadcastsData(page: Page): Promise<BroadcastData[]>
}
