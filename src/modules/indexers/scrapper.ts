import { DateTime } from "luxon"
import puppeteer, { Browser, ElementHandle, Page } from "puppeteer"
import { v4 as uuidv4 } from "uuid"

import env from "../../config/env"
import mainLogger from "../../utils/logger"
import onExit from "../../utils/onExit"
import sleep from "../../utils/sleep"
import { LoginData } from "../indexer/model"
import { NodePropertiesController } from "../nodeProperties"
import { templater } from "../templater"

process.setMaxListeners(Infinity)

const browsers: Map<PageScrapper, Browser> = new Map()

type Replacement = {
  regex: RegExp
  replace: string
}

type DateReplacement = {
  regex: RegExp
  format: string
}

export type Selector = {
  path: string
}

export type TextContentSelector = Selector & {
  attribute?: string
  replacement?: Replacement
}

export type DateSelector = TextContentSelector & {
  format?: string
  dateReplacement?: DateReplacement
}

export type RegexSelector<T extends Record<string, string>> = TextContentSelector & {
  regex: RegExp
  default?: T
}

export default abstract class PageScrapper {
  private browserUuid: string = null

  private browser: Browser = null

  private browserTimeout: NodeJS.Timeout = null

  private browserTimeoutDelay: number = 2 * 60 * 1000

  protected loginDetails: LoginData

  private loggedIn: boolean

  constructor(public scrapperName: string) {
    this.browserUuid = uuidv4()
    this.loggedIn = false
  }

  protected async getBrowser(): Promise<Browser> {
    const logger = mainLogger.child({ name: "Scrapper", func: "getBrowser" })
    logger.silly("getBrowser")
    if (!this.browser) {
      const args = [
        "--disable-gpu",
        "--single-process",
        "--autoplay-policy=no-user-gesture-required",
        "--disable-web-security",
        "--disable-features=IsolateOrigins",
        "--disable-site-isolation-trials",
        // "--disable-dev-shm-usage",
        // "--no-first-run",
        // "--no-zygote",
        // "--no-sandbox",
        // "--disable-setuid-sandbox",
        // "--disable-features=site-per-process",
      ]

      this.browser = await puppeteer.launch({
        headless: true,
        browser: "firefox",
        // // ignoreHTTPSErrors: true,
        // // product: "firefox",
        // protocol: "webDriverBiDi",
        args,
      })
      const ip = await this.getRemoteIP("http://ifconfig.me/ip")
      logger.info(`Browser launched with IP ${ip}`)
      browsers.set(this, this.browser)

      this.browser.on("targetcreated", async () => this.setNodeProperty())
      this.browser.on("targetchanged", async () => this.setNodeProperty())
      this.browser.on("targetdestroyed", async () => this.setNodeProperty())

      this.browser.on("disconnected", async () => {
        logger.info("Browser disconnected")
        browsers.delete(this)
        this.browser.close()
        this.browser = null
        await NodePropertiesController.deleteNodeProperty(this.browserUuid)
      })

      // For security reasons, we close the page and the browser after in 2 minutes if the page is still open
      await this.resetBrowserTimeout()
    }
    logger.silly("getBrowser done")

    if (!this.loggedIn) {
      await this.login()
    }

    return this.browser
  }

  private async login(): Promise<void> {
    this.loggedIn = true
    const logger = mainLogger.child({ name: "Scrapper", func: "login" })
    if (this.loginDetails) {
      logger.debug("Performing login")
      const { clicks, username, password, submit, url, validation } = this.loginDetails
      const page = await this.getPage(url, "body")

      // Performing clicks
      for (const { path } of clicks) {
        await sleep(500)
        await page.click(path)
      }

      await page.waitForSelector(username.selector[0].path)
      const [usernameField] = await this.getElements(page, username.selector)
      const [passwordField] = await this.getElements(page, password.selector)

      await usernameField.type(username.value, { delay: 10 })
      await passwordField.type(password.value, { delay: 10 })

      await page.waitForSelector(submit[0].path)
      const [submitButton] = await this.getElements(page, submit)
      await submitButton.click()
      await sleep(1000)

      if (validation?.selector[0]?.path) {
        await page.waitForSelector(validation.selector[0].path)
        const [validationField] = await this.getElements(page, validation.selector)
        await validationField.type(validation.value, { delay: 10 })
        await page.waitForSelector(validation.submit[0].path)
        const [validationSubmit] = await this.getElements(page, validation.submit)
        await validationSubmit.click()
        await sleep(1000)
      }

      await page.close()
      logger.debug("login done")
    } else {
      logger.debug("No login details")
    }
  }

  private async setNodeProperty(): Promise<void> {
    const pages = await this.browser.pages()
    const urls = pages.map((page) => page.url())
    await NodePropertiesController.setNodeProperty("pages", this.browserUuid, urls.join(","))
  }

  protected resetBrowserTimeout(): void {
    const logger = mainLogger.child({ name: "Scrapper", func: "resetBrowserTimeout" })
    logger.debug("resetBrowserTimeout")
    if (this.browserTimeout) {
      clearTimeout(this.browserTimeout)
    }

    this.browserTimeout = setTimeout(async () => {
      if (this.browser) {
        logger.warn("Closing browser because it's been open for too long")
        await this.browser.close()
      }
    }, this.browserTimeoutDelay)
  }

  protected async asyncGoto(
    browser: Browser,
    page: Page,
    url: string,
    cb: (page: Page) => Promise<void>,
    timeout: number,
  ): Promise<void> {
    const logger = mainLogger.child({ name: "Scrapper", func: "asyncGoto", data: { url } })
    logger.debug(`Hitting url ${url} with timeout ${timeout}`)
    try {
      await page.goto(url, { timeout })
      if (cb) {
        logger.debug("Calling callback")
        await cb(page)
        logger.debug("Callback done")
      }
    } catch (error) {
      logger.error(`Error while hitting url ${url}: ${error}`)
      await page.close()
      await browser.close()
    }
  }

  protected async getPage(url: string, elementToWait: string, timeout: number = 10000): Promise<Page> {
    const logger = mainLogger.child({
      name: "Scrapper",
      func: "getPage",
      data: {
        url,
        elementToWait,
      },
    })
    logger.silly("Hitting url")
    const browser = await this.getBrowser()
    const page = await browser.newPage()
    await page.setCacheEnabled(false)
    await page.setUserAgent(env.browser.userAgent)

    await page.goto(url, { timeout, waitUntil: "domcontentloaded" })
    await page.waitForSelector(elementToWait, { visible: true, timeout })

    return page
  }

  public async getRemoteIP(url: string): Promise<string> {
    const logger = mainLogger.child({ name: "Scrapper", func: "getRemoteIp", data: { url } })
    logger.silly("Hitting url")
    const browser = await this.getBrowser()
    const page = await browser.newPage()
    await page.goto(url)
    const ip = await page.evaluate(() => document.body.textContent)
    await page.close()
    return ip
  }

  protected async evaluate(root: Page | ElementHandle, selector: string, attribute: string): Promise<string> {
    if (!attribute) {
      return root.$eval(selector, (item) => item.textContent)
    }
    return root.$eval(selector, (item, attr) => item.getAttribute(attr), attribute)
  }

  protected async getElements(
    root: ElementHandle<Element> | Page,
    selectors: Selector[],
  ): Promise<ElementHandle<Element>[]> {
    const res: ElementHandle<Element>[] = []
    for (const { path } of selectors) {
      try {
        // Templating the path
        const rendered = templater.renderString(path, this)
        const elements = await root.$$(rendered)
        res.push(...elements)
      } catch (error) {
        // Do nothing
      }
    }
    return res
  }

  protected async getTextContent(
    root: ElementHandle<Element> | Page,
    selectors: TextContentSelector[],
  ): Promise<string> {
    for (const { path, attribute, replacement } of selectors) {
      try {
        if (attribute === "href") {
          const elt = (await root.$(path)) as ElementHandle<HTMLAnchorElement>
          const prop = await elt.getProperty(attribute)
          const value = await prop.jsonValue()
          return value
        }

        const raw = await this.evaluate(root, path, attribute)

        if (replacement) {
          return raw.replace(new RegExp(replacement.regex), replacement.replace)
        }
        return raw
      } catch (error) {
        // Do nothing
      }
    }
    throw new Error(`No content found for selectors ${selectors.map((selector) => selector.path).join(", ")}`)
  }

  protected async getDateTime(root: ElementHandle<Element> | Page, selectors: DateSelector[]): Promise<DateTime> {
    for (const selector of selectors) {
      try {
        const { dateReplacement, format } = selector
        let raw = await this.getTextContent(root, [selector])

        if (dateReplacement) {
          const now = DateTime.now().toFormat(dateReplacement.format)
          raw = raw.replace(dateReplacement.regex, now)
        }

        const date = DateTime.fromFormat(raw, format, { zone: "local" })
        if (!date.isValid) {
          throw new Error("Invalid day")
        }
        return date
      } catch (error) {
        // Do nothing
      }
    }
    throw new Error("No date found")
  }

  protected async getRegexContent<T extends Record<string, string>>(
    root: ElementHandle<Element> | Page,
    selectors: RegexSelector<T>[],
  ): Promise<T> {
    for (const { path, attribute, regex, default: defaultValue, replacement } of selectors) {
      try {
        const raw = await this.getTextContent(root, [{ path, attribute, replacement }])
        const groups = raw.match(regex)?.groups as Partial<T>
        const result: T = {
          ...defaultValue,
        }
        const keys = Object.keys(groups) as (keyof T)[]
        for (const key of keys) {
          if (groups[key]) {
            result[key] = groups[key] as T[keyof T]
          }
        }

        return result
      } catch (error) {
        // Do nothing
      }
    }
    throw new Error(`No content found for regex selectors ${selectors.map((selector) => selector.path).join(", ")}`)
  }
}

process.on("uncaughtException", (reason) => {
  const logger = mainLogger.child({ name: "Scrapper", func: "uncaughtException" })
  logger.error(`Uncaught Exception: ${reason}`)
})

onExit(async () => {
  const logger = mainLogger.child({ name: "Scrapper", func: "onExit" })
  logger.info("Killing all browsers")
  for (const browser of browsers.values()) {
    browser.removeAllListeners()
    await browser.close()
  }
  logger.info("All browsers killed")
})
