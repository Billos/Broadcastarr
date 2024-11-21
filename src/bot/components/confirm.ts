import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"

const confirmRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("confirm_yes")
    .setLabel("Yes")
    .setStyle(ButtonStyle.Danger), // Red color for confirmation
  new ButtonBuilder()
    .setCustomId("confirm_no")
    .setLabel("No")
    .setStyle(ButtonStyle.Secondary), // Grey color for cancel
)

export default confirmRow
