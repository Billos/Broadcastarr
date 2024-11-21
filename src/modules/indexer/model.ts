/* eslint-disable @typescript-eslint/no-explicit-any */
// Create a simple model of a unique document in a MongoDB collection.

import mongoose, { InferSchemaType } from "mongoose"

const selectorSchemaRaw = {
  path: { type: String, required: true },
}

const selectorSchema = new mongoose.Schema(selectorSchemaRaw, { _id: false })

const textContentSelectorSchemaRaw = {
  ...selectorSchemaRaw,
  attribute: { type: String },
  replacement: {
    type: {
      regex: { type: String, required: true },
      replace: { type: String, required: true },
    },
    default: null as any,
  },
}

const textContentSelectorSchema = new mongoose.Schema(textContentSelectorSchemaRaw, { _id: false })

const regexSelectorSchemaRaw = {
  ...textContentSelectorSchemaRaw,
  regex: { type: String, required: true },
  default: { type: Map, of: String },
}

const regexSelectorSchema = new mongoose.Schema(regexSelectorSchemaRaw, { _id: false })

const dateSelectorSchemaRaw = {
  ...textContentSelectorSchemaRaw,
  format: { type: String },
  dateReplacement: {
    type: {
      regex: { type: String, required: true },
      format: { type: String, required: true },
    },
    default: null as any,
  },
}

const dateSelectorSchema = new mongoose.Schema(dateSelectorSchemaRaw, { _id: false })

const broadcastSchema = new mongoose.Schema({
  default: {},
  selector: { type: [selectorSchema], required: true },
  startTime: { type: [dateSelectorSchema], required: true },
  link: { type: [textContentSelectorSchema], required: true },
  name: { type: [textContentSelectorSchema], required: true },
  group: { type: [regexSelectorSchema], required: true },
}, { _id: false })

const broadcastSetSchema = new mongoose.Schema({
  day: { type: [dateSelectorSchema] },
  selector: { type: [selectorSchema], required: true },
  today: {
    regex: { type: String, required: true },
    format: { type: String, required: true },
  },
}, { _id: false })

const categorySchema = new mongoose.Schema({
  links: { type: [selectorSchema], required: true },
  lookups: { type: Map, of: [String] },
}, { _id: false })

const indexerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  data: {
    category: { type: categorySchema },
    loadPageElement: { type: String },
    broadcastSets: { type: broadcastSetSchema },
    broadcast: { type: broadcastSchema },
    nextPage: { type: [selectorSchema] },
  },
  interceptorData: {
    loadPageElement: { type: String },
    streamItems: { type: [selectorSchema] },
    positiveScores: { type: [selectorSchema] },
    link: { type: [textContentSelectorSchema] },
    referer: { type: String },
    clickButton: { type: [selectorSchema] },
  },
})

export const IndexerModel = mongoose.model("Indexer", indexerSchema)

export type IndexerDocument = InferSchemaType<typeof indexerSchema >

export type IndexerData = IndexerDocument["data"]

export type Selector = IndexerDocument["data"]["broadcast"]["selector"][0]

export type TextContentSelector = IndexerDocument["data"]["broadcast"]["name"][0]

export type DateSelector = IndexerDocument["data"]["broadcast"]["startTime"][0]

export type RegexSelector = IndexerDocument["data"]["broadcast"]["group"][0]

export type IndexerInterceptorData = IndexerDocument["interceptorData"]
