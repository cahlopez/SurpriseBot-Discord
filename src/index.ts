import { Client } from "discord.js";

import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";

const client = new Client({
    intents: []
});

ready(client);
interactionCreate(client);

client.login("NzQxNDkyNTA0NjgzMjE2OTM2.Xy4WtQ.6mba4wLGRbXN2FM8E-l-jewu_P0");