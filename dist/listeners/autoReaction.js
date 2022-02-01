"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (client) => {
    client.on("messageCreate", async (message) => {
        console.log(message.author.username);
        console.log(message.author.id);
        if (message.author.id == "176538779010596864") {
            //message.react(message.guild!.emojis.cache.get('21') as EmojiIdentifierResolvable);
            await message.react('👎');
        }
    });
};
