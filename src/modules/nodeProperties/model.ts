// Create a simple model of a unique document in a MongoDB collection.

import mongoose, { InferSchemaType } from "mongoose"

const nodePropertiesSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
}, { timestamps: true })

// Index is uuid + key
nodePropertiesSchema.index({ uuid: 1, key: 1 }, { unique: true })

export const NodePropertiesModel = mongoose.model("NodeProperties", nodePropertiesSchema)

export type NodePropertiesDocument = InferSchemaType<typeof nodePropertiesSchema>
