import { Client, EmojiIdentifierResolvable, Message } from "discord.js";
import { Commands } from "../commands";

export default (client: Client): void => {
    client.on("messageCreate", async (message: Message) => {
        console.log(message.author.username);
        console.log(message.author.id);
        if(message.author.id == "176538779010596864") {
            //message.react(message.guild!.emojis.cache.get('21') as EmojiIdentifierResolvable);
            await message.react('👎');
        }
    });
};
