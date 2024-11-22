import mongoose, { InferSchemaType } from "mongoose"

const releaserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
})

export type ReleaserDocument = InferSchemaType<typeof releaserSchema>

export const ReleaserModel = mongoose.model<ReleaserDocument>("Releaser", releaserSchema)
