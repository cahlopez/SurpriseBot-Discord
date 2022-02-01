"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (client) => {
    client.on("messageCreate", async (message) => {
        console.log("NEW MESSAGE");
        if (message.author.id == "937913319996682291") {
            console.log("CORRECT USER");
            //message.react(message.guild!.emojis.cache.get('21') as EmojiIdentifierResolvable);
            await message.react('👎');
        }
    });
};
