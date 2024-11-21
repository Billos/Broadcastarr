import mongoose, { InferSchemaType } from "mongoose"

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  emoji: {
    type: String,
    required: false,
  },
  publications: {
    type: Map,
    of: [String],
    required: false,
    default: {},
  },
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
})

groupSchema.index({ name: 1, country: 1, category: 1 }, { unique: true })

export type GroupDocument = InferSchemaType<typeof groupSchema>

export type GroupIndex = Pick<GroupDocument, "name" | "country" | "category">

export const GroupModel = mongoose.model<GroupDocument>("Group", groupSchema)
