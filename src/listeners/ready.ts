import { Client, MessageEmbed } from "discord.js";
import { Commands } from "../commands";

import schedule from 'node-schedule';

import { bot_info } from "../config.json"

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }

        await client.application.commands.set(Commands);

        const wordleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Wordle Announcement')
            .setURL('https://www.powerlanguage.co.uk/wordle/')
            .setDescription('There is a new wordle!')
            .setThumbnail('https://i.imgur.com/5QI3JV2.png')
            .setTimestamp()

        const job = schedule.scheduleJob('0 0 * * *', async function() {
            const channel = await client.guilds.cache.get('596817382392070146')?.channels.fetch('753667809539522713')

            if(channel?.isText()) {
                channel.send({embeds: [wordleEmbed]});
            }
        });

        console.log(bot_info.name + ' has started with version: ' + bot_info.version + ' and is now ready!');
    });
}; 