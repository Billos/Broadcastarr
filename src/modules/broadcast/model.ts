import mongoose, { InferSchemaType } from "mongoose"

const streamsSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  referer: {
    type: String,
  },
  expiresAt: {
    type: Date,
  },
})

const broadcastSchema = new mongoose.Schema({
  indexer: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  displayTitle: {
    type: String,
    unique: true,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  link: {
    type: String,
    unique: true,
    required: true,
  },
  streams: [streamsSchema],
  logo: {
    type: String,
  },
  jellyfinId: {
    type: String,
  },
  tunerHostId: {
    type: String,
  },
  streamIndex: {
    type: Number,
    default: 0,
  },
})

// Export mongoose model for Broadcast
export type BroadcastDocument = InferSchemaType<typeof broadcastSchema> & { id?: string }

export type BroadcastStream = InferSchemaType<typeof streamsSchema>

export const BroadcastModel = mongoose.model<BroadcastDocument>("Broadcast", broadcastSchema)
