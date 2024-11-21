import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js"

import { GroupDocument } from "../../modules/group"
import mainLogger from "../../utils/logger"

export default function selectGroup(groups: GroupDocument[]): ActionRowBuilder<StringSelectMenuBuilder> {
  const logger = mainLogger.getSubLogger({ name: "SelectGroup", prefix: ["selectGroup"] })
  const select = new StringSelectMenuBuilder()
  select.setCustomId("selectGroup")
  select.setPlaceholder("Select a group")

  for (const { name, country } of groups) {
    const label = `${country}:${name}`
    const option = new StringSelectMenuOptionBuilder().setLabel(label).setValue(label)
    try {
      select.addOptions(option)
    } catch (error) {
      logger.error(`Error while adding options: ${name}`)
      break
    }
  }
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)
}
