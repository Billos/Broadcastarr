import mongoose, { InferSchemaType } from "mongoose"

const publisherSchema = new mongoose.Schema({
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

export type PublisherDocument = InferSchemaType<typeof publisherSchema>

export const PublisherModel = mongoose.model<PublisherDocument>("Publisher", publisherSchema)
