import { DateTime } from "luxon"
import { Types } from "mongoose"
import { Page } from "puppeteer-core"

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

  abstract getBroadcastsData(page: Page): Promise<BroadcastData[]>
}
