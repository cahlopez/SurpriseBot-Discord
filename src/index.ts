import { Client } from "discord.js";

import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";
import autoReaction from "./listeners/autoReaction";

const client = new Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS']
});

ready(client);
interactionCreate(client);
autoReaction(client);

client.login(process.env.BOT_TOKEN);