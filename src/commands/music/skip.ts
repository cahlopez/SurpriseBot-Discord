
import { ApplicationCommandTypes } from "../../../deps.ts";
import { reply } from "../../utils/reply.ts"
import { createCommand } from "../mod.ts";

createCommand({
  name: "skip",
  description: "Skip the song that is currently playing.",
  type: ApplicationCommandTypes.ChatInput,
  execute: async (Bot, interaction) => {
    await Bot.lavadeno.queues.get(interaction.guildId!)?.skip();

    await reply(Bot, interaction, "Skipped!")
  },
});