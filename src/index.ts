import { Client } from "discord.js";

import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";

const client = new Client({
    intents: []
});

ready(client);
interactionCreate(client);

client.login(process.env.BOT_TOKEN);