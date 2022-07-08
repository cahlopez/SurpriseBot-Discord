import { Client, EmojiIdentifierResolvable, Message } from "discord.js";

export default (client: Client): void => {
    client.on("messageCreate", async (message: Message) => {
        if(message.author.id == "994625978657673368") {
            //message.react(message.guild!.emojis.cache.get('21') as EmojiIdentifierResolvable);
            await message.react('👎');
        }
    });
};
