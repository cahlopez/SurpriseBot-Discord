import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../command";

export const Ping: Command = {
    name: "ping",
    description: "Returns 'Pong!'",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const content: string = "Pong!";

        await interaction.reply({
            content,
            ephemeral: true
        });
    }
}; 