import { convertTextSelector } from "./converters"
import GenericBroadcastInterceptor from "./genericBroadcastInterceptor"
import { BroadcastDocument } from "../broadcast"
import { IndexerDocument } from "../indexer"
import { Selector, TextContentSelector } from "./scrapper"

export default class DynamicBroadcastInterceptor extends GenericBroadcastInterceptor {
  protected override loadPageElement: string

  protected override streamItems: Selector[]

  protected override positiveScores: Selector[]

  protected override link: TextContentSelector[]

  protected override clickButton: Selector[]

  protected override referer: string

  constructor(indexer: IndexerDocument, broadcast: BroadcastDocument) {
    super(indexer.name, broadcast.name, broadcast.link, broadcast.streamIndex)
    this.loadPageElement = indexer.interceptorData.loadPageElement
    this.streamItems = indexer.interceptorData.streamItems
    this.positiveScores = indexer.interceptorData.positiveScores
    this.link = indexer.interceptorData.link.map((item) => convertTextSelector(item))
    this.clickButton = indexer.interceptorData.clickButton
    this.referer = indexer.interceptorData.referer
  }
}
