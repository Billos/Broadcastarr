// Create a simple model of a unique document in a MongoDB collection.

import mongoose, { InferSchemaType } from "mongoose"

const uuidSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  state: {
    type: String,
    required: true,
    default: "active",
    unique: true,
  },
})

export const UuidModel = mongoose.model("Uuid", uuidSchema)

export type UuidDocument = InferSchemaType<typeof uuidSchema>
