import { Job } from "@hokify/agenda"

import mainLogger from "../../../utils/logger"
import { BroadcastController } from "../../broadcast"
import { IndexerController } from "../../indexer"
import { DynamicBroadcastInterceptor } from "../../indexers"
import { StreamData } from "../../indexers/broadcastInterceptor"
import { Orchestrator } from "../../scrapper/Orchestrator"
import { GrabBroadcastStreamOptions } from "../options"
import { Triggers } from "../triggers"

export async function handler(job: Job<GrabBroadcastStreamOptions>): Promise<void> {
  const { broadcastId } = job.attrs.data
  const broadcast = await BroadcastController.getBroadcast(broadcastId)
  const logger = mainLogger.child({
    name: "GrabBroadcastStreamHandler",
    func: "handler",
    data: {
      broadcastId: broadcast.id,
      broadcastName: broadcast.name,
    },
  })

  let stream: StreamData
  let streamIndex: number

  const indexerDocument = await IndexerController.getIndexer(broadcast.indexer)

  if (indexerDocument.scenarios) {
    logger.info("Grabbing the broadcast stream")
    const { scenarios } = indexerDocument
    const orchestrator = new Orchestrator(scenarios, broadcast)
    const result = await orchestrator.run("intercept")
    // eslint-disable-next-line prefer-destructuring
    stream = result.stream
    // eslint-disable-next-line prefer-destructuring
    streamIndex = result.streamIndex
  } else {
    logger.info("LEGACY - Grabbing the broadcast stream")
    const interceptor = new DynamicBroadcastInterceptor(indexerDocument, broadcast)
    stream = await interceptor.getStream()
    // Saving the current stream index
    streamIndex = interceptor.getStreamIndex()
  }
  await BroadcastController.setStreamIndex(broadcast.id, streamIndex)

  if (!stream) {
    logger.error("No stream found")
    // Still need to publish the group
    throw new Error(`No stream found for broadcast ${broadcast.name} - ${broadcastId}`)
  }

  // Will need to be updated 10 minutes before the stream expires
  logger.debug("Renewing the GrabBroadcastStream task")
  await Triggers.renewGrabBroadcastStream(broadcastId, streamIndex)

  // Set the stream in the database
  logger.debug("Setting the stream in the database")
  await BroadcastController.setStream(broadcast.id, stream)

  // If the file already exists, we don't need to do anything
  const m3u8FileExists = await BroadcastController.m3u8FileExists(broadcastId)
  logger.debug(`M3U8 file exists: ${m3u8FileExists}`)
  if (!m3u8FileExists) {
    // Writing the M3U8 file
    logger.debug("Writing the M3U8 file")
    await BroadcastController.generateM3U8File(broadcastId)
  }
  await Triggers.releaseBroadcast(broadcastId)
}

export async function onError(error: Error, job: Job<GrabBroadcastStreamOptions>): Promise<boolean> {
  const { broadcastId } = job.attrs.data
  const logger = mainLogger.child({
    name: "GrabBroadcastStreamHandler",
    func: "onError",
    data: { broadcastId },
  })
  logger.error(`An error occurred while grabbing the broadcast stream: ${error.message}`)
  try {
    const broadcast = await BroadcastController.getBroadcast(broadcastId)
    await Triggers.publishGroup(broadcast.group, broadcast.category, broadcast.country)
    return false
  } catch (err) {
    logger.warn("Broadcast not found, cannot publish the group, and deleting the job")
    return true
  }
}
