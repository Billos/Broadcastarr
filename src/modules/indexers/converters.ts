import {
  DBDateSelector,
  DBRegexSelector,
  DBSelector,
  DBTextContentSelector,
} from "../indexer"
import {
  DateSelector,
  RegexSelector,
  Selector,
  TextContentSelector,
} from "./scrapper"

const convertSelector = (item: DBSelector): Selector => ({
  path: item.path,
})

const convertTextSelector = (item: DBTextContentSelector): TextContentSelector => ({
  ...(convertSelector(item)),
  attribute: item.attribute,
  replacement: item.replacement ? {
    regex: new RegExp(item.replacement.regex),
    replace: item.replacement.replace,
  } : null,
})

const convertDateSelector = (item: DBDateSelector): DateSelector => ({
  ...(convertTextSelector(item)),
  format: item.format,
  dateReplacement: item.dateReplacement ? {
    regex: new RegExp(item.dateReplacement.regex),
    format: item.dateReplacement.format,
  } : null,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertRegexSelector = (item: DBRegexSelector): RegexSelector<any> => ({
  ...(convertTextSelector(item)),
  regex: new RegExp(item.regex),
  default: item.default,
})

export {
  convertSelector, convertTextSelector, convertDateSelector, convertRegexSelector,
}
