import { CategoryDetails } from "./broadcastsIndexer"
import { convertDateSelector, convertRegexSelector, convertTextSelector } from "./converters"
import GenericBroadcastsIndexer, {
  BroadcastDetails,
  BroadcastSetDetails,
} from "./genericBroadcastsIndexer"
import { IndexerDocument } from "../indexer"
import { Selector } from "./scrapper"

export default class DynamicBroadcastsIndexer extends GenericBroadcastsIndexer {
  protected override loadPageElement: string

  protected override categoryDetails: CategoryDetails

  protected override broadcastSets: BroadcastSetDetails

  protected override broadcast: BroadcastDetails

  protected override nextPage: Selector[]

  protected override teamSplitterRegex: RegExp

  constructor(private indexer: IndexerDocument, category: string) {
    super(indexer.url, indexer.name, category)
    this.loadPageElement = this.indexer.data.loadPageElement

    if (this.indexer.data.broadcastSets) {
      this.broadcastSets = {
        selector: this.indexer.data.broadcastSets.selector,
        day: this.indexer.data.broadcastSets.day.map((item) => convertDateSelector(item)),
      }
    } else {
      this.broadcastSets = null
    }

    this.broadcast = {
      selector: this.indexer.data.broadcast.selector,
      startTime: this.indexer.data.broadcast.startTime.map((item) => convertDateSelector(item)),
      link: this.indexer.data.broadcast.link.map((item) => convertTextSelector(item)),
      name: this.indexer.data.broadcast.name.map((item) => convertTextSelector(item)),
      group: this.indexer.data.broadcast.group.map((item) => convertRegexSelector(item)),
    }
    this.nextPage = this.indexer.data.nextPage

    this.categoryDetails = {
      links: this.indexer.data.category.links,
      lookups: this.indexer.data.category.lookups,
    }
  }
}
