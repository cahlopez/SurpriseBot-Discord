import { Bot, commands } from "../../bot.ts";
import { configs } from "../../configs.ts";

export async function updateApplicationCommands() {
  // const cmdNames = commands.map((val) => val.name);

  // if ((await Bot.helpers.getApplicationCommands()).filter((val) => cmdNames.includes(val.name)).size < cmdNames.length) {
  //   if()
  //   await Bot.helpers.upsertApplicationCommands(commands.array(), );
  // }

  await Bot.helpers.upsertApplicationCommands(
    commands
      // ONLY GLOBAL COMMANDS
      .filter((command) => !command.devOnly)
      .array(),
  );

  await Bot.helpers.upsertApplicationCommands(
    commands
      // ONLY GLOBAL COMMANDS
      .filter((command) => !!command.devOnly)
      .array(),
    configs.devGuildId,
  );
}
 