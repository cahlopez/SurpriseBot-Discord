import { Client, EmojiIdentifierResolvable, Message } from "discord.js";
import { Commands } from "../commands";

export default (client: Client): void => {
    client.on("messageCreate", async (message: Message) => {
        if(message.author.id == "244305794512846858") {
            //message.react(message.guild!.emojis.cache.get('21') as EmojiIdentifierResolvable);
            await message.react('👎');
        }
    });
};
