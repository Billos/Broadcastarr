import { DateTime } from "luxon"
import { ElementHandle, Page } from "puppeteer"

import BroadcastsIndexer, { BroadcastData } from "./broadcastsIndexer"
import { ConfigController } from "../config"
import { GroupController, GroupDocument } from "../group"
import {
  DateSelector,
  RegexSelector,
  Selector,
  TextContentSelector,
} from "./scrapper"
import mainLogger from "../../utils/logger"
import SilentError from "../../utils/silentError"

export type GroupSelector = {
  path?: string;
  regex?: RegExp;
}

export type BroadcastSetDetails = {
  day: DateSelector[];
  selector: Selector[];
}

type Group = {
  country: string;
  name: string;
}

export type BroadcastDetails = {
  selector: Selector[];
  startTime: DateSelector[];
  link: TextContentSelector[];
  name: TextContentSelector[];
  group: RegexSelector<Group>[];
}

export default abstract class GenericBroadcastsIndexer extends BroadcastsIndexer {
  private latestDate: DateTime

  protected abstract loadPageElement: string

  protected abstract broadcastSets: BroadcastSetDetails

  protected abstract broadcast: BroadcastDetails

  protected abstract nextPage: Selector[]

  protected abstract teamSplitterRegex: RegExp

  async getBroadcastsData(url: string): Promise<BroadcastData[]> {
    // Initialisation et Préparation :
    //     Initialiser le logger avec les informations de la catégorie et de l'URL.
    const logger = mainLogger.getSubLogger({ name: "GenericBroadcastsIndexer", prefix: ["getBroadcastsData", `category ${this.category}`, `url ${url}`] })
    //     Charger la page à partir de l'URL donnée.
    const page = await this.getPage(url, this.loadPageElement)
    //     Initialiser un tableau pour stocker les données de diffusion (BroadcastData).
    const data: BroadcastData[] = []
    // Boucle de Pagination :
    let endReached = false
    let pageIndex = 0
    do {
      //     Incrémenter l'index de page.
      pageIndex += 1
      logger.debug("Parsing page ", pageIndex)
      //     Récupérer les blocs de diffusion de la page actuelle.
      const broadcastData = await this.parseCurrentPage(page)
      //     Ajouter les données de diffusion au tableau.
      data.push(...broadcastData)
      //     Vérifier si on doit arrêter de parser.
      const shouldStop = await this.shouldStopParsing()
      logger.debug(`Page ${pageIndex} Should stop parsing: ${shouldStop}`)
      const lastPage = await this.lastPageReached(page)
      logger.debug(`Page ${pageIndex} Last page: ${lastPage}`)
      if (shouldStop || lastPage) {
        endReached = true
        break
      }
      //     Aller à la page suivante.
      logger.debug("Going to next page")
      await this.goToNextPage(page)
    } while (!endReached)
    logger.debug("End of parsing")
    return data
  }

  private async parseCurrentPage(page: Page): Promise<BroadcastData[]> {
    const logger = mainLogger.getSubLogger({ name: "GenericBroadcastsIndexer", prefix: ["parseCurrentPage", `category ${this.category}`] })
    const activeGroups = await GroupController.getActiveGroups(this.category)
    const inactiveGroups = await GroupController.getInactiveGroups(this.category)

    // There are 2 possibilities here
    // We have different sets of broadcasts and they have a common day
    // We have a single set of broadcasts
    const containers = await this.getBroadcastsSets(page)
    const data: BroadcastData[] = []

    logger.info(`Found ${containers.length} broadcast sets`)
    for (const container of containers) {
      try {
        const broadcastData = await this.parseBroadcastSet(container, activeGroups, inactiveGroups)
        data.push(...broadcastData)
      } catch (error) {
        logger.warn(`Could not parse broadcast set ${error.message}`)
      }
    }

    return data
  }

  private async getBroadcastsSets(page: Page): Promise<(ElementHandle<Element> | Page)[]> {
    if (!this.broadcastSets) {
      return [page]
    }

    return this.getElements(page, this.broadcastSets.selector)
  }

  private async parseBroadcastSet(broadcastSet: ElementHandle<Element> | Page, activeGroups: GroupDocument[], inactiveGroups: GroupDocument[]): Promise<BroadcastData[]> {
    const logger = mainLogger.getSubLogger({ name: "GenericBroadcastsIndexer", prefix: ["parseBroadcastSet", `category ${this.category}`] })
    logger.debug("Parsing broadcast set")
    const day: DateTime = await this.getBroadcastSetDay(broadcastSet)

    const broadcastBlocks = await this.getElements(broadcastSet, this.broadcast.selector)
    logger.info(`Found ${broadcastBlocks.length} broadcast blocks`)
    const broadcastData = await this.parseBroadcasts(broadcastBlocks, activeGroups, inactiveGroups, day)
    return broadcastData
  }

  private async getBroadcastSetDay(broadcastSet: ElementHandle<Element> | Page): Promise<DateTime> {
    if (!this.broadcastSets || !this.broadcastSets.day) {
      return null
    }
    return this.getDateTime(broadcastSet, this.broadcastSets.day)
  }

  private async parseBroadcasts(broadcastBlocks: ElementHandle<Element>[], activeGroups: GroupDocument[], inactiveGroups: GroupDocument[], day?: DateTime): Promise<BroadcastData[]> {
    const logger = mainLogger.getSubLogger({ name: "GenericBroadcastsIndexer", prefix: ["parseBroadcasts", `category ${this.category}`] })
    logger.debug(`Parsing ${broadcastBlocks.length} blocks`)
    const data: BroadcastData[] = []

    for (const broadcastBlock of broadcastBlocks) {
      try {
        let startTime = await this.getDateTime(broadcastBlock, this.broadcast.startTime)
        if (day) {
          startTime = startTime.set({ day: day.day, month: day.month, year: day.year })
        }
        if (!this.latestDate || startTime > this.latestDate) {
          this.latestDate = startTime
        }
        const group = await this.getGroup(broadcastBlock, activeGroups, inactiveGroups)
        const link = await this.getTextContent(broadcastBlock, this.broadcast.link)
        const textContent = await this.getTextContent(broadcastBlock, this.broadcast.name)
        data.push({ startTime, group: group.name, country: group.country, link, textContent })
      } catch (error) {
        logger.warn(error.message)
      }
    }
    return data
  }

  protected async lastPageReached(page: Page): Promise<boolean> {
    if (!this.nextPage) {
      return true
    }

    const elements = await this.getElements(page, this.nextPage)
    return (elements.length === 0)
  }

  protected async goToNextPage(page: Page): Promise<void> {
    const [nextPageBtn] = await this.getElements(page, this.nextPage)
    await nextPageBtn.click()
    await page.waitForNavigation({ waitUntil: "domcontentloaded" })
  }

  private async getGroup(broadcastBlock: ElementHandle, activeGroups: GroupDocument[], inactiveGroups: GroupDocument[]): Promise<Group> {
    const logger = mainLogger.getSubLogger({ name: "GenericBroadcastsIndexer", prefix: ["getGroup", `name ${this.name}`] })
    if (this.broadcast.group.length === 0) {
      logger.warn("No group selector or regex, using default group")
      const group = { country: "World", name: "Ungrouped" }
      await this.assertGroupExists(group, true)
      return group
    }

    const group = await this.getRegexContent(broadcastBlock, this.broadcast.group)
    if (inactiveGroups.find(({ country, name }) => name.toLocaleLowerCase() === group.name.toLocaleLowerCase() && group.country.toLocaleLowerCase() === country.toLocaleLowerCase())) {
      throw new SilentError(`Group ${group.name} of Country ${group.country} is inactive`)
    }

    // If group is not in the filters, we don't need to parse the Broadcast, and we save time
    if (!activeGroups.find(({ country, name }) => name.toLocaleLowerCase() === group.name.toLocaleLowerCase() && group.country.toLocaleLowerCase() === country.toLocaleLowerCase())) {
      // If the group does not exist, we create it in the DB as inactive and raise an error
      const created = await this.assertGroupExists(group, false)
      if (created) {
        throw new SilentError(`Creating group ${group} and set it to inactive groups`)
      }
      throw new SilentError(`Group ${group} is not in filters`)
    }
    logger.debug(`Group ${group} is in filters`)

    return group
  }

  // Returns the value created
  private async assertGroupExists({ name, country }: Group, active: boolean): Promise<boolean> {
    try {
      await GroupController.getGroup({ name, category: this.category, country })
      return false
    } catch (error) {
      await GroupController.createGroup({ name, category: this.category, country }, active)
      return true
    }
  }

  private async shouldStopParsing(): Promise<boolean> {
    const futureLimit = await ConfigController.getNumberConfig("filter-limit-future")
    const latestDate = this.latestDate || DateTime.now()
    return latestDate.diffNow("minutes").minutes > futureLimit
  }
}
