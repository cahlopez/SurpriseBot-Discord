import { configs } from "./configs.ts";
import {
  BotWithCache,
  Collection,
  createBot,
  enableCachePlugin,
  enableCacheSweepers,
  enableHelpersPlugin,
  enablePermissionsPlugin,
  enableLavadenoPlugin,
  GatewayIntents
} from "./deps.ts";
import { Command } from "./src/types/commands.ts";
import { fixCacheUpdating } from "./src/utils/fixes.ts";
import log from "./src/utils/logger.ts";

const nodes = [];

nodes.push({
  id: "main",
  host: configs.lavalinkHost,
  port: configs.lavalinkPort,
  password: configs.lavalinkPassword,
  secure: configs.lavalinkSecure,
  resuming: { key: configs.lavalinkResume },
  reconnect: {
    type: "exponential",
    maxDelay: 15000,
    initialDelay: 1000,
    tries: -1 // unlimited
  },
});

if (nodes.length == 0) throw log.error("No nodes specified");

// MAKE THE BASIC BOT OBJECT
const baseBot = createBot({
  token: configs.token,
  botId: configs.botId,
  intents: GatewayIntents.Guilds | GatewayIntents.GuildMessages | GatewayIntents.GuildVoiceStates,
  events: {},
});

const bot = enableLavadenoPlugin(enableCachePlugin(baseBot), {
  mode: "Cluster",
  nodes: nodes,
  includeQueue: true,
});

// ENABLE ALL THE PLUGINS THAT WILL HELP MAKE IT EASIER TO CODE YOUR BOT
fixCacheUpdating(bot);
enableHelpersPlugin(bot);
enableCacheSweepers(bot as BotWithCache);
enablePermissionsPlugin(bot as BotWithCache);

// THIS IS THE BOT YOU WANT TO USE EVERYWHERE IN YOUR CODE! IT HAS EVERYTHING BUILT INTO IT!
export const Bot = bot;

// PREPARE COMMANDS HOLDER
export const commands = new Collection<string, Command>();
