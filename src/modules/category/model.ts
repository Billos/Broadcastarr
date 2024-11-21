import mongoose, { InferSchemaType } from "mongoose"

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  publications: {
    type: Map,
    of: [String],
    required: false,
    default: {},
  },
  emoji: {
    type: String,
    required: false,
    default: "",
  },
})

export const CategoryModel = mongoose.model("Category", categorySchema)

export type CategoryDocument = InferSchemaType<typeof categorySchema>
