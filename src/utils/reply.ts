import { Interaction, InteractionResponseTypes, InteractionApplicationCommandCallbackData} from "../../deps.ts";
import { Bot as bBot } from "../../bot.ts";

export async function reply(Bot: typeof bBot, interaction: Interaction, content: InteractionApplicationCommandCallbackData): Promise<void> {
    await Bot.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: content
        },
    );
}
