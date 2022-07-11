
import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from "../../../deps.ts";
import { reply } from "../../utils/reply.ts"
import { createCommand } from "../mod.ts";

createCommand({
  name: "loop",
  description: "Make the song/queue loop or disable looping.",
  type: ApplicationCommandTypes.ChatInput,
  options: [
    {
    name: "mode",
    description: "Mode to set looping to",
    required: true,
    type: ApplicationCommandOptionTypes.String,
    choices: [
        {name: "Disable", value: "None"},
        {name: "Song", value: "Song"},
        {name: "Queue", value: "Queue"},
    ],
    }
],
  execute: async (Bot, interaction) => {
    const mode = interaction.data!.options![0].value as "None" | "Song" | "Queue";
    const queue = Bot.lavadeno.queues.get(interaction.guildId!);

    if(!queue) return reply(Bot, interaction, "Not playing!");

    queue.loop = mode;
    await reply(Bot, interaction, `Looping mode set to **${mode}**`);
  },
});