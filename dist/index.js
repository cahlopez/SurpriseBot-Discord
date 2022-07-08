"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const interactionCreate_1 = __importDefault(require("./listeners/interactionCreate"));
const ready_1 = __importDefault(require("./listeners/ready"));
const autoReaction_1 = __importDefault(require("./listeners/autoReaction"));
const client = new discord_js_1.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES]
});
(0, ready_1.default)(client);
(0, interactionCreate_1.default)(client);
(0, autoReaction_1.default)(client);
client.login("NzQxNDkyNTA0NjgzMjE2OTM2.Xy4WtQ.72-gWflwD7Dx196AApZaozDfVW4");
