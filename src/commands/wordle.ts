import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../command";

function updateBoard(): string {
    let board = "";

    for(let i = 0; i < 6; i++) {
        for(let j = 0; j < 5; j++) {
            board += "⬛ ";
        }
        board += `\n`;
        board += `\n`;
    }

    return board;
}

export const Wordle: Command = {
    name: "wordle",
    description: "Starts a wordle game if available!",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        let content: string = updateBoard();

        await interaction.reply({
            content,
            ephemeral: true
        });
    }
}; 