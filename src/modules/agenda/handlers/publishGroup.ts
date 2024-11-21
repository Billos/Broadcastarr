import { Job } from "@hokify/agenda"

import mainLogger from "../../../utils/logger"
import { BroadcastController } from "../../broadcast"
import { GroupController } from "../../group"
import { PublishersController } from "../../publishers"
import { PublishGroupOptions } from "../options"
import { Triggers } from "../triggers"

export async function handler(job: Job<PublishGroupOptions>): Promise<void> {
  const { group, category, country } = job.attrs.data
  const logger = mainLogger.getSubLogger({ name: "PublishGroupHandler", prefix: ["handler", `groub ${group}`, `category ${category}`] })

  // Get the group and the broadcasts
  const groupDocument = await GroupController.getGroup({ name: group, category, country })
  const broadcasts = await BroadcastController.getBroadcastsOfGroup(country, groupDocument.name, category)

  // For each, if they have a stream but no jellyfinId, we release them
  for (const broadcast of broadcasts) {
    if (broadcast.streams?.length > 0 && !broadcast.jellyfinId) {
      logger.warn(`Broadcast ${broadcast.name} has streams but no jellyfinId, releasing it`)
      await Triggers.releaseBroadcast(broadcast.id)
    }
  }
  // Publish the group
  logger.debug("Republishing the group")
  const res = await PublishersController.unpublishGroup(groupDocument)
  for (const publisher of Object.keys(res)) {
    await GroupController.setPublications(groupDocument, publisher, [])
  }

  if (groupDocument.active) {
    const result = await PublishersController.publishGroup(groupDocument, broadcasts)
    for (const publisher of Object.keys(result)) {
      await GroupController.setPublications(groupDocument, publisher, result[publisher])
    }
  }

  // schedule now the UpdateDiscordChannelName task
  // Check if the task is already scheduled
  await Triggers.updateCategoryChannelName(category)
}
