import puppeteer, { Browser, Page } from "puppeteer"

import mainLogger from "../../utils/logger"

export abstract class Scrapper {
  private browser: Browser = null

  protected async getBrowser(): Promise<Browser> {
    const logger = mainLogger.getSubLogger({ name: "Scrapper", prefix: ["getBrowser"] })
    logger.trace("getBrowser")
    if (!this.browser) {
      logger.info("Creating a new browser")
      const args = [
        "--disable-gpu",
        "--single-process",
        "--autoplay-policy=no-user-gesture-required",
        "--disable-web-security",
        "--disable-features=IsolateOrigins",
        "--disable-site-isolation-trials",
        "--no-sandbox",
      ]

      this.browser = await puppeteer.launch({
        headless: true,
        browser: "firefox",
        args,
      })
    }
    logger.trace("getBrowser done")

    return this.browser
  }

  public async screenshot(page: Page, filename: string = `${Date.now()}`): Promise<void> {
    await page.screenshot({ path: `/data/images/${filename}.png`, fullPage: true })
  }
}
