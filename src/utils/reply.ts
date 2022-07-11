import { Interaction, InteractionResponseTypes } from "../../deps.ts";
import { Bot as bBot } from "../../bot.ts";

export async function reply(Bot: typeof bBot, interaction: Interaction, content: string) {
    await Bot.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
            content: content,
            },
        },
    );
}