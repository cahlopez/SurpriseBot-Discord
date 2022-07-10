import { dotEnvConfig } from "./deps.ts";

// Get the .env file that the user should have created, and get the token
const env = dotEnvConfig({ export: true });
const token = Deno.env.get("BOT_TOKEN") || env.BOT_TOKEN;
const devGuildID = Deno.env.get("DEV_GUILD_ID") || env.DEV_GUILD_ID!

export interface Config {
  token: string;
  botId: bigint;
}

export const configs = {
  /** Get token from ENV variable */
  token,
  /** Get the BotId from the token */
  botId: BigInt(atob(token.split(".")[0])),
  /** The server id where you develop your bot and want dev commands created. */
  devGuildId: BigInt(devGuildID),
};
