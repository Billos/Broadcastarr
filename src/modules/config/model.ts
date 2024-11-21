// Create a simple model of a unique document in a MongoDB collection.

import mongoose, { InferSchemaType } from "mongoose"

const configSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
  },
})

export const ConfigModel = mongoose.model("Config", configSchema)

export type ConfigDocument = InferSchemaType<typeof configSchema>
