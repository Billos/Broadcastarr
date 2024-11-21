import { DateTime } from "luxon"
import { HTTPResponse, Page } from "puppeteer"

import PageScrapper from "./scrapper"
import mainLogger from "../../utils/logger"

export type StreamData = { url: string, referer?: string, expiresAt?: Date }

export type StreamDataCallback = (page: Page, index: number) => Promise<void>

export default abstract class BroadcastInterceptor extends PageScrapper {
  constructor(
    indexer: string,
    public broadcastName: string,
    protected streamIndex: number,
  ) {
    super(`${indexer}-interceptor-${broadcastName}`)
  }

  public getStreamIndex(): number {
    return this.streamIndex
  }

  abstract getStream(): Promise<StreamData>

  private async interceptResponse(link: string, search: string, timeout: number = 0, accessReferer?: string, cb?: (page: Page, index: number) => Promise<void>): Promise<HTTPResponse> {
    const logger = mainLogger.getSubLogger({ name: "BroadcastInterceptor", prefix: ["interceptResponse", `link ${link}`, `search ${search}`] })
    logger.debug(`Hitting url ${link} with search ${search} and timeout ${timeout} and accessReferer ${accessReferer}`)
    const browser = await this.getBrowser()
    const page = await browser.newPage()
    page.setRequestInterception(true)

    let responseIndex = 0
    page.on("request", (interceptedRequest) => {
      // Setting the referer only to the first request
      const headers = interceptedRequest.headers()
      if (responseIndex === 0 && accessReferer) {
        headers.referer = accessReferer
      }
      responseIndex++
      interceptedRequest.continue({ headers })
    })

    // await page.setExtraHTTPHeaders({ referer: accessReferer })
    const promise = new Promise<HTTPResponse>((resolve, reject) => {
      let timeoutInstance: NodeJS.Timeout
      if (timeout) {
        timeoutInstance = setTimeout(async () => {
          try {
            await page.close()
            await browser.close()
          } catch (error) {
            // Do nothing
          }
          reject(new Error("Timeout for intercepting response"))
        }, timeout)
      }

      page.on("response", async (response) => {
        const url = response.url()
        // if (url.includes(search)) {
        // console.log(`Intercepted url ${url} With response ${response.status()} - From ${link}`)
        // }
        if (url.includes(search)) {
          if (timeoutInstance) {
            clearTimeout(timeoutInstance)
          }
          try {
            await browser.close()
          } catch (error) {
            // Do nothing
          }
          logger.debug(`Response intercepted: ${url}`)
          return resolve(response)
        }
        // logger.warn(`Response not intercepted, result ${response.status()}: ${url} `)
      })
    })

    this.asyncGoto(browser, page, link, cb ? async (streamPage) => cb(streamPage, this.streamIndex) : null, 0)

    return promise
  }

  private async interceptM3U8(link: string, accessReferer?: string, cb?: StreamDataCallback): Promise<StreamData> {
    const logger = mainLogger.getSubLogger({ name: "BroadcastInterceptor", prefix: ["interceptM3U8", `name ${this.broadcastName}`, `link ${link}`] })
    logger.debug("Intercepting")
    const response = await this.interceptResponse(link, "m3u8", 20000, accessReferer, cb)
    const headers = response.request().headers()
    // console.log(response.headers())
    const referer = headers.referer ?? "www.google.fr"
    const url = response.url()

    const expirationRegex = [
      /e=(\d+)/,
      /expire=(\d+)/,
      /expires=(\d+)/,
    ]
    // Find the expires parameter in the stream url
    // If the url does not contain an expiration parameter, we set the expiration to 1 hour
    const matchingRegex = expirationRegex.find((reg) => reg.test(response.url()))
    logger.debug(`Found stream ${url} with referer ${referer}`)
    if (!matchingRegex) {
      logger.warn("No expiration parameter found, setting expiration to 1 hour")
      return {
        url,
        referer,
        expiresAt: DateTime.now().plus({ hours: 1 }).toJSDate(),
      }
    }
    const expiresTimestamp = parseInt(response.url().match(matchingRegex)?.[1], 10) * 1000
    const expiresAt = new Date(expiresTimestamp)

    logger.debug(`Found stream ${url} for ${this.broadcastName} with referer ${referer} and expiresAt ${expiresAt}`)

    return {
      url,
      referer,
      expiresAt,
    }
  }

  protected async getStreamData(allStreamsLinks: string[], accessReferer?: string, cb?: (page: Page, index: number) => Promise<void>): Promise<StreamData> {
    const logger = mainLogger.getSubLogger({ name: "BroadcastInterceptor", prefix: ["getStreamData", `name ${this.broadcastName}`] })

    // Filter the links that are valid URL
    const streamPages = allStreamsLinks.map((streamLink) => `${streamLink}`).filter((link) => {
      try {
        // eslint-disable-next-line no-new
        new URL(link)
        return true
      } catch (error) {
        return false
      }
    })

    logger.debug(`Found ${streamPages.length} streams links to try, starting with the link number ${this.streamIndex}`)
    while (this.streamIndex <= streamPages.length - 1) {
      try {
        logger.debug(`Trying to retrieve the link number ${this.streamIndex}`)
        const url = streamPages[this.streamIndex]
        const data = await this.interceptM3U8(url, accessReferer, cb)
        return data
      } catch (error) {
        logger.warn("No stream found, trying to get the next one")
        this.streamIndex++
      }
    }
    // If we reach this point, it means that we did not find any stream, we can reset the stream index
    this.streamIndex = 0
    throw new Error(`No stream found for ${this.broadcastName} - To be fixed`)
  }
}
