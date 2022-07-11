
import { ApplicationCommandTypes } from "../../../deps.ts";
import { reply } from "../../utils/reply.ts"
import { createCommand } from "../mod.ts";

createCommand({
  name: "info",
  description: "Get information about the current song!",
  type: ApplicationCommandTypes.ChatInput,
  execute: async (Bot, interaction) => {
    const queue = Bot.lavadeno.queues.get(interaction.guildId!);
    const current = queue?.current;

    await reply(Bot, interaction, current? `Currently playing song ${queue?.current.info.title}` + `\nSongs in queue: ${queue.size}` : "Currently not playing anything")
  },
});