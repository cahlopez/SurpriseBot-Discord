"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const commands_1 = require("../commands");
const node_schedule_1 = __importDefault(require("node-schedule"));
const config_json_1 = require("../config.json");
exports.default = (client) => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }
        await client.application.commands.set(commands_1.Commands);
        const wordleEmbed = new discord_js_1.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Wordle Announcement')
            .setURL('https://www.powerlanguage.co.uk/wordle/')
            .setDescription('There is a new wordle!')
            .setThumbnail('https://i.imgur.com/5QI3JV2.png')
            .setTimestamp();
        const job = node_schedule_1.default.scheduleJob({ hour: 0, minute: 0, tz: 'America/Los_Angeles' }, async function () {
            const channel = await client.guilds.cache.get('596817382392070146')?.channels.fetch('753667809539522713');
            if (channel?.isText()) {
                channel.send({ embeds: [wordleEmbed] });
            }
        });
        console.log(config_json_1.bot_info.name + ' has started with version: ' + config_json_1.bot_info.version + ' and is now ready!');
    });
};
