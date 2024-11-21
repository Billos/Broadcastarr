// Create a simple model of a unique document in a MongoDB collection.

import mongoose, { InferSchemaType } from "mongoose"

const authSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["user", "channel"],
    required: true,
  },
  value: {
    type: String,
    required: true,
    unique: true,
  },
  roles: {
    type: [String],
    default: [],
  },
})

export const AuthModel = mongoose.model("Auth", authSchema)

export type AuthDocument = InferSchemaType<typeof authSchema>
