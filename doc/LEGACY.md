# Legacy indexer and interceptor

```typescript
type Replacement = {
  regex: RegExp
  replace: string
}

type DateReplacement = {
  regex: RegExp
  format: string
}

type Selector = {
  path: string
}

type TextContentSelector = Selector & {
  attribute?: string
  replacement?: Replacement
}

type DateSelector = TextContentSelector & {
  format?: string
  dateReplacement?: DateReplacement
}

type RegexSelector<T extends Record<string, string>> = TextContentSelector & {
  regex: RegExp
  default?: T
}
```

```jsonc
{
  "name": string,
  "url": string,
  "active": boolean,
  // The data to configure the indexation
  "data": {
    "category": {
      // The links to retrieve the categories
      "links": Selector[],
      // When set, the lookup is a map category => strings to look for in the category name in the links textContent retrieved by the links selectors
      "lookups": Map<string, string[]>,
    },
    // Element to wait before looking for links
    "loadPageElement": string,
    // Broadcasts can be grouped by sets, in this case we start by looking for the day
    "broadcastSets": {
        // The selectors to retrieve the sets of broadcasts
        "selector": Selector[],
        // The selectors to retrieve the day
        "day": DateSelector[],
        // Some sites have  a "today" string instead of the current date, in this case we need to replace it
        "today": {
        "regex": string,
        "format": string,
        },
    },
    // The selectors to retrieve the broadcasts, is run in the context of the set, or the page if not set
    "broadcast": {
      // The selectors to retrieve the broadcasts
      "selector": Selector[],
      // The selectors to retrieve the broadcast start time, is run in the context of the broadcast
      "startTime": DateSelector[],
      // The selectors to retrieve the broadcast link, is run in the context of the broadcast
      "link": TextContentSelector[],
      // The selectors to retrieve the broadcast title, is run in the context of the broadcast
      "name": TextContentSelector[],
      // The selectors to retrieve the broadcast group, is run in the context of the broadcast
      "group": RegexSelector[],
    },
    // The selectors to retrieve the next page link, as long as there is a next page, and the broadcastSets start before the future limit, we go to the next page and continue the indexation
    "nextPage": Selector[],
  },
  // The data to configure the grabbing
  "interceptorData": {
    // Element to wait before looking for stream items
    "loadPageElement": string,
    // The selectors to retrieve the stream items
    "streamItems": Selector[],
    // The selectors to retrieve the score of the broadcast, is run in the context of the stream item
    "positiveScores": Selector[],
    // The selectors to retrieve the link of the broadcast, is run in the context of the stream item
    "link": TextContentSelector[],
    // If set, we go to the link(s) previously found with a referer header
    "referer": string,
    // If set, we click on the items found (play button for instance)
    "clickButton": Selector[],
  }
}
```
