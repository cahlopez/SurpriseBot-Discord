import { startBot } from "./deps.ts";
import log from "./src/utils/logger.ts";
import { fileLoader, importDirectory } from "./src/utils/loader.ts";
import { updateApplicationCommands } from "./src/utils/updateCommands.ts";
// setup db
import "./src/database/mod.ts";
import { Bot } from "./bot.ts";

log.info("Starting bot...");

// Forces deno to read all the files which will fill the commands/inhibitors cache etc.
await Promise.all(
  [
    "./src/commands",
    "./src/events",
    // "./src/tasks",
  ].map((path) => importDirectory(Deno.realPathSync(path))),
);
await fileLoader();

// UPDATES YOUR COMMANDS TO LATEST COMMANDS
await updateApplicationCommands();

// STARTS THE CONNECTION TO DISCORD
await startBot(Bot);

Bot.lavadeno.core.on("nodeConnect", (node) => console.log(`Node ${node.id} connected.`));
Bot.lavadeno.core.on("nodeDisconnect", (node, code, reason) =>
  console.log(`Node ${node.id} disconnected with code ${code}`, reason)
);
Bot.lavadeno.core.on("nodeError", (node, err) => console.error(`Node ${node.id} error`, err));
await Bot.lavadeno.connect();
