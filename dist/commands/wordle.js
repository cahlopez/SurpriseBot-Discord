"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wordle = void 0;
function updateBoard() {
    let board = "";
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            board += "⬛ ";
        }
        board += `\n`;
        board += `\n`;
    }
    return board;
}
exports.Wordle = {
    name: "wordle",
    description: "Starts a wordle game if available!",
    type: "CHAT_INPUT",
    run: async (client, interaction) => {
        let content = updateBoard();
        await interaction.reply({
            content,
            ephemeral: true
        });
    }
};
