import { Bot, commands } from "../../bot.ts";
import { InteractionTypes } from "../../deps.ts";
import log from "../utils/logger.ts";

Bot.events.interactionCreate = async (_, interaction) => {
  try {
    if (!interaction.data) return;

    switch (interaction.type) {
      case InteractionTypes.ApplicationCommand:
        log.info(
          `[Application Command] ${interaction.data.name} command executed.`,
        );
        await commands.get(interaction.data.name!)?.execute(Bot, interaction);
        break;
    }
  } catch(error) {
    log.error(error)
  }
};