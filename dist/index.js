"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const interactionCreate_1 = __importDefault(require("./listeners/interactionCreate"));
const ready_1 = __importDefault(require("./listeners/ready"));
const client = new discord_js_1.Client({
    intents: []
});
(0, ready_1.default)(client);
(0, interactionCreate_1.default)(client);
client.login(process.env.BOT_TOKEN);
