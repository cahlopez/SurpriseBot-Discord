
import { ApplicationCommandTypes } from "../../../deps.ts";
import { reply } from "../../utils/reply.ts"
import { createCommand } from "../mod.ts";

createCommand({
  name: "stop",
  description: "Stop the current song queue.",
  type: ApplicationCommandTypes.ChatInput,
  execute: async (Bot, interaction) => {
    await Bot.lavadeno.queues.get(interaction.guildId!)?.disconnect().destroy()

    reply(Bot, interaction, "Stopped current queue!");
  },
});
