import mongoose, { InferSchemaType } from "mongoose"

export const CommandSchema = new mongoose.Schema(
  {
    description: { type: String, required: false },
    type: { type: String, required: true },
    args: {
      type: Object,
      required: false,
    },
    next: { type: String, required: false },
  },
  {
    _id: false,
    discriminatorKey: "type",
  },
)

const GoToPageCommandSchema = new mongoose.Schema(
  {
    args: {
      url: { type: String, required: true },
    },
  },
  { _id: false },
)

const ClickCommandSchema = new mongoose.Schema(
  {
    args: {
      selector: { type: String, required: true },
      safe: { type: Boolean, required: false },
    },
  },
  { _id: false },
)

const FillInputCommandSchema = new mongoose.Schema(
  {
    args: {
      selector: { type: String, required: true },
      value: { type: String, required: true },
    },
  },
  { _id: false },
)

const SleepCommandSchema = new mongoose.Schema(
  {
    args: {
      duration: { type: String, required: true },
    },
  },
  { _id: false },
)

const RunScenarioCommandSchema = new mongoose.Schema(
  {
    args: {
      scenario: { type: String, required: true },
    },
  },
  { _id: false },
)

const GetValuesCommandSchema = new mongoose.Schema(
  {
    args: {
      root: { type: String, required: false },
      values: {
        type: [
          {
            selector: { type: String, required: true },
            attribute: { type: String, required: false },
            replacements: {
              type: Array,
              of: {
                from: { type: String, required: true },
                to: { type: String, required: true },
              },
              required: false,
            },
            store: {
              type: String,
              required: false,
            },
            canFail: {
              type: Boolean,
              required: false,
              default: false,
            },
            elementExists: {
              type: Boolean,
              required: false,
            },
            valueIfFailed: {
              type: String,
              required: false,
            },
          },
        ],
      },
    },
  },
  { _id: false },
)

const CounterCommandSchema = new mongoose.Schema(
  {
    args: {
      root: { type: String, required: false },
      selector: { type: String, required: true },
      store: {
        type: String,
        required: false,
      },
    },
  },
  { _id: false },
)

const SetValuesCommandSchema = new mongoose.Schema({
  args: {
    values: {
      type: [
        {
          store: { type: String, required: true },
          value: { type: String, required: true },
          isDate: { type: Boolean, required: false, default: false },
          isEmptyArray: { type: Boolean, required: false, default: false },
          dateFormat: { type: String, required: false },
        },
      ],
    },
  },
})

const AssertGroupCommandSchema = new mongoose.Schema(
  {
    args: {
      category: { type: String, required: true },
      country: { type: String, required: true },
      name: { type: String, required: true },
    },
  },
  { _id: false },
)

const GenerateBroadcastCommandSchema = new mongoose.Schema(
  {
    args: {
      indexer: { type: String, required: true },
      category: { type: String, required: true },
      startTime: {
        type: {
          value: { type: String, required: true },
          format: { type: String, required: true },
        },
        required: true,
      },
      group: {
        type: {
          country: { type: String, required: true },
          name: { type: String, required: true },
        },
        required: true,
      },
      link: { type: String, required: true },
      textContent: { type: String, required: true },
    },
  },
  { _id: false },
)

const ExtractValueSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      enum: [
        "query",
        "headers",
        "url",
        "urlRegex",
      ],
    },
    key: { type: String, required: false },
    replacements: [
      {
        from: { type: String, required: true },
        to: { type: String, required: true },
      },
    ],
    store: { type: String, required: true },
  },
  { _id: false },
)

const InterceptResponseCommandSchema = new mongoose.Schema(
  {
    args: {
      filters: {
        type: {
          urlRegex: { type: String, required: false },
          method: {
            type: String,
            required: false,
            enum: [
              "GET",
              "POST",
              "PUT",
              "DELETE",
            ],
          },
        },
        required: true,
      },

      timeout: { type: Number, required: true },
      extracts: {
        type: [ExtractValueSchema],
        required: true,
      },
    },
  },
  { _id: false },
)

CommandSchema.discriminator("GoToPage", GoToPageCommandSchema)
CommandSchema.discriminator("Click", ClickCommandSchema)
CommandSchema.discriminator("FillInput", FillInputCommandSchema)
CommandSchema.discriminator("Sleep", SleepCommandSchema)
CommandSchema.discriminator("RunScenario", RunScenarioCommandSchema)
CommandSchema.discriminator("GetValues", GetValuesCommandSchema)
CommandSchema.discriminator("Counter", CounterCommandSchema)
CommandSchema.discriminator("SetValues", SetValuesCommandSchema)
CommandSchema.discriminator("AssertGroup", AssertGroupCommandSchema)
CommandSchema.discriminator("GenerateBroadcast", GenerateBroadcastCommandSchema)
CommandSchema.discriminator("InterceptResponse", InterceptResponseCommandSchema)

export type GoToPageCommandArgs = InferSchemaType<typeof GoToPageCommandSchema>["args"]

export type ClickCommandArgs = InferSchemaType<typeof ClickCommandSchema>["args"]

export type FillInputCommandArgs = InferSchemaType<typeof FillInputCommandSchema>["args"]

export type SleepCommandArgs = InferSchemaType<typeof SleepCommandSchema>["args"]

export type RunScenarioCommandArgs = InferSchemaType<typeof RunScenarioCommandSchema>["args"]

export type GetValueCommandArgs = InferSchemaType<typeof GetValuesCommandSchema>["args"]

export type CounterCommandArgs = InferSchemaType<typeof CounterCommandSchema>["args"]

export type SetValueCommandArgs = InferSchemaType<typeof SetValuesCommandSchema>["args"]

export type AssertGroupCommandArgs = InferSchemaType<typeof AssertGroupCommandSchema>["args"]

export type GenerateBroadcastCommandArgs = InferSchemaType<typeof GenerateBroadcastCommandSchema>["args"]

export type InterceptResponseCommandArgs = InferSchemaType<typeof InterceptResponseCommandSchema>["args"]

export type CommandDocument = InferSchemaType<typeof CommandSchema> &
  (
    | InferSchemaType<typeof GoToPageCommandSchema>
    | InferSchemaType<typeof ClickCommandSchema>
    | InferSchemaType<typeof FillInputCommandSchema>
    | InferSchemaType<typeof SleepCommandSchema>
    | InferSchemaType<typeof RunScenarioCommandSchema>
    | InferSchemaType<typeof GetValuesCommandSchema>
    | InferSchemaType<typeof CounterCommandSchema>
    | InferSchemaType<typeof SetValuesCommandSchema>
    | InferSchemaType<typeof AssertGroupCommandSchema>
    | InferSchemaType<typeof GenerateBroadcastCommandSchema>
    | InferSchemaType<typeof InterceptResponseCommandSchema>
  )

export type ExtractValue = InferSchemaType<typeof ExtractValueSchema>
