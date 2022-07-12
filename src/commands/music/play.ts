
import { ApplicationCommandTypes, ApplicationCommandOptionTypes, Song } from "../../../deps.ts";
import { reply } from "../../utils/reply.ts"
import { createCommand } from "../mod.ts";

createCommand({
  name: "play",
  description: "Request a song to be played.",
  type: ApplicationCommandTypes.ChatInput,
  options: [
        {
        name: "query",
        description: "Song query",
        required: true,
        type: ApplicationCommandOptionTypes.String,
        }
    ],
  execute: async (Bot, interaction) => {
    if(!interaction.guildId) return reply(Bot, interaction, "Call this command from a guild!");

    const userVoiceChannel = Bot.guilds.get(interaction.guildId)?.voiceStates.get(interaction.user.id);
    if (!userVoiceChannel?.channelId) return reply(Bot, interaction, "You're not currently connected to a voice channel!");

    const song = interaction.data!.options![0].value as string;

    let queue = Bot.lavadeno.queues.get(interaction.guildId);

    const newQueue = queue == undefined;

    if(!queue) {
        queue = Bot.lavadeno.createQueue(interaction.guildId!, interaction.channelId!, {
            songStart: (channelId, song) => {
                Bot.helpers.sendMessage(channelId, {
                    content: `Playing ${song.info.title}`,
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: "Link",
                                    style: 5,
                                    url: song.info.uri,
                                },
                            ],
                        },
                    ],
                })
                .catch(console.error);
            },
            finish: (channelId) => {
                (async () => {
                    await Bot.helpers.sendMessage(channelId, {content: `Queue finished!`}).catch(console.error);
                    await queue?.disconnect().destroy();
                })();
            },
        });
    }
    const tracks = await Bot.lavadeno.core.rest.loadTracks(/*`scsearch:${song}`*/ "ytsearch:" + song);

    if(tracks.tracks.length == 0) return reply(Bot, interaction, "I was unable to find any songs!");
    if(!queue.connected) queue.connect(userVoiceChannel.channelId);

    queue.add(new Song(tracks.tracks[0]));
    await queue.start();
    
    await reply(Bot, interaction, newQueue ? "Playing song" : "Song added to queue");
  },
});