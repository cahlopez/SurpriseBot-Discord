"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (client) => {
    client.on("messageCreate", async (message) => {
        if (message.author.id == "994625978657673368") {
            //message.react(message.guild!.emojis.cache.get('21') as EmojiIdentifierResolvable);
            await message.react('👎');
        }
    });
};
