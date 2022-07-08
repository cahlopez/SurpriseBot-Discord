import { Client, Intents } from "discord.js";

import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";
import autoReaction from "./listeners/autoReaction";

const client = new Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

ready(client);
interactionCreate(client);
autoReaction(client);

client.login("NzQxNDkyNTA0NjgzMjE2OTM2.Xy4WtQ.72-gWflwD7Dx196AApZaozDfVW4");