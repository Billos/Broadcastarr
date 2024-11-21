import { ElementHandle } from "puppeteer"

import BroadcastInterceptor, { StreamData, StreamDataCallback } from "./broadcastInterceptor"
import { Selector, TextContentSelector } from "./scrapper"
import mainLogger from "../../utils/logger"

type StreamLink = { link: string, score?: number }

export default abstract class GenericBroadcastInterceptor extends BroadcastInterceptor {
  constructor(
    indexer: string,
    broadcastName: string,
    protected broadcastLink: string,
    streamIndex: number,
  ) {
    super(indexer, broadcastName, streamIndex)
  }

  protected abstract loadPageElement: string

  protected abstract streamItems: Selector[]

  protected abstract positiveScores: Selector[]

  protected abstract link: TextContentSelector[]

  protected abstract clickButton: Selector[]

  protected abstract referer: string

  public override async getStream(): Promise<StreamData> {
    const logger = mainLogger.getSubLogger({ name: "BroadcastInterceptor", prefix: ["getStream", `name ${this.broadcastName}`] })
    logger.debug("Getting stream")
    const page = await this.getPage(this.broadcastLink, this.loadPageElement)

    // Now retrieving the stream links
    const ratedStreamsLinks: StreamLink[] = []

    const streamsItems = await this.getElements(page, this.streamItems)

    for (const streamItem of streamsItems) {
      const score = await this.getElements(streamItem, this.positiveScores)

      try {
        const link = await this.getTextContent(streamItem, this.link)
        ratedStreamsLinks.push({ link, score: score.length })
      } catch (error) {
        // Assuming that the link was not found
        const elt = await streamItem as ElementHandle<HTMLAnchorElement>
        const prop = await elt.getProperty("href")
        const link = await prop.jsonValue()
        ratedStreamsLinks.push({ link, score: score.length })
      }
    }

    // Sort the links by the number of stars
    const allStreamsLinks = ratedStreamsLinks.sort((itemA, itemB) => itemB.score - itemA.score).map((link) => link.link)

    // Define callback if the clickButtonSelector is defined
    const clickButtonCallback: StreamDataCallback = this.clickButton ? async (streamPage, index) => {
      logger.debug("Callback for streamIndex", index)
      const btns = await this.getElements(streamPage, this.clickButton)
      for (const button of btns) {
        logger.debug("Clicking on the button")
        await button.click()
      }
    } : () => Promise.resolve()

    return this.getStreamData(allStreamsLinks, this.referer, clickButtonCallback)
  }
}
