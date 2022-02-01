import { Client, EmojiIdentifierResolvable, Message } from "discord.js";
import { Commands } from "../commands";

export default (client: Client): void => {
    client.on("message", async (message: Message) => {
        if(message.author.id == "937913319996682291") {
            //message.react(message.guild!.emojis.cache.get('21') as EmojiIdentifierResolvable);
            await message.react('👎');
        }
    });
};
