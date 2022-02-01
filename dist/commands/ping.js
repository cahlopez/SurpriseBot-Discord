"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ping = void 0;
exports.Ping = {
    name: "ping",
    description: "Returns 'Pong!'",
    type: "CHAT_INPUT",
    run: async (client, interaction) => {
        const content = "Pong!";
        await interaction.reply({
            content,
            ephemeral: true
        });
    }
};
