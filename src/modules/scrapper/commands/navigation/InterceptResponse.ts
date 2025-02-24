import { Types } from "mongoose"
import { HTTPResponse, Page } from "puppeteer-core"

import { ExtractValue, InterceptResponseCommandArgs } from "../../../indexer"
import { templater } from "../../../templater"
import { CommandClass, Context } from "../command"
import { SetValuesCommand } from "../scenario/SetValues"

export class InterceptResponseCommand extends CommandClass<InterceptResponseCommandArgs> {
  async execute(page: Page, context: Context): Promise<void> {
    const { filters } = this.args

    await page.setRequestInterception(true)

    const { method } = filters
    const urlRegex = filters.urlRegex ? new RegExp(templater.renderString(filters.urlRegex, context)) : null

    const promises = [
      this.timeoutPromise(),
      this.interceptPromise(page, context, method, urlRegex),
    ]

    await Promise.any(promises)
    await page.setRequestInterception(false)
  }

  private async interceptPromise(page: Page, context: Context, method: string, urlRegex: RegExp): Promise<void> {
    return new Promise((resolve) => {
      page.on("response", async (response) => {
        if (method && response.request().method() !== method) {
          return
        }

        if (urlRegex && !urlRegex.test(response.url())) {
          return
        }

        for (const extract of this.args.extracts) {
          await this.extractValue(page, context, response, extract)
        }
      })
      resolve()
    })
  }

  private async timeoutPromise(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), this.args.timeout)
    })
  }

  private async extractValue(
    page: Page,
    context: Context,
    response: HTTPResponse,
    extract: ExtractValue,
  ): Promise<void> {
    switch (extract.source) {
      case "query":
        await this.extractQueryParams(page, context, response, extract)
      case "headers":
        await this.extractHeaders(page, context, response, extract)
      case "url":
        await this.extractURL(page, context, response, extract)
      case "urlRegex":
        throw new Error("Not implemented")
    }
  }

  private async extractQueryParams(
    page: Page,
    context: Context,
    response: HTTPResponse,
    extract: ExtractValue,
  ): Promise<void> {
    const url = new URL(response.url())
    const value = url.searchParams.get(extract.key)
    await this.storeValue(page, context, extract.replacements, extract.store, value)
  }

  private async extractHeaders(
    page: Page,
    context: Context,
    response: HTTPResponse,
    extract: ExtractValue,
  ): Promise<void> {
    const value = response.headers()[extract.key]
    await this.storeValue(page, context, extract.replacements, extract.store, value)
  }

  private async extractURL(page: Page, context: Context, response: HTTPResponse, extract: ExtractValue): Promise<void> {
    const value = response.url()
    await this.storeValue(page, context, extract.replacements, extract.store, value)
  }

  private performReplacements(context: Context, value: string, replacements: ExtractValue["replacements"]): string {
    let result = value
    for (const { from, to } of replacements) {
      const fromValue = templater.renderString(from, context)
      const toValue = templater.renderString(to, context)
      result = result.replace(fromValue, toValue)
    }
    return result
  }

  private async storeValue(
    page: Page,
    context: Context,
    replacements: ExtractValue["replacements"],
    store: string,
    value: string,
  ): Promise<void> {
    const finalValue = this.performReplacements(context, value, replacements)

    const storeValue = templater.renderString(store, context)
    const command = new SetValuesCommand("VirtualStorer", {
      values: new Types.DocumentArray([{ store: storeValue, value: finalValue }]),
    })
    await command.execute(page, context)
  }
}
