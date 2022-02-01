import { Client } from "discord.js";

import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";
import autoReaction from "./listeners/autoReaction";

const client = new Client({
    intents: []
});

ready(client);
interactionCreate(client);
autoReaction(client);

client.login(process.env.BOT_TOKEN);