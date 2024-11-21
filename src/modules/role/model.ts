// Create a simple model of a unique document in a MongoDB collection.
import mongoose, { InferSchemaType } from "mongoose"

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  abilities: {
    type: [String],
    required: true,
    default: [],
  },
})

export const RoleModel = mongoose.model("Role", roleSchema)

export type RoleDocument = InferSchemaType<typeof roleSchema>
