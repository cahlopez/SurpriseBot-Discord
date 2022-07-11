import { dotEnvConfig } from "./deps.ts";

// Get the .env file that the user should have created, and get the token
const env = dotEnvConfig({ export: true });
const token = Deno.env.get("BOT_TOKEN") || env.BOT_TOKEN;
const devGuildID = Deno.env.get("DEV_GUILD_ID") || env.DEV_GUILD_ID!
const lavalinkHost = Deno.env.get("LLHOST") || env.LLHOST
const lavalinkPort = Deno.env.get("LLPORT") || env.LLPPORT
const lavalinkPassword = Deno.env.get("LLPASSWORD") || env.LLPASSWORD
const lavalinkSecure = Deno.env.get("LLSECURE") || env.LLSECURE

export interface Config {
  token: string;
  botId: bigint;
  lavalinkHost: string;
  lavalinkPort: number;
  lavalinkPassword: string;
  lavalinkSecure: boolean;
}

export const configs = {
  /** Get token from ENV variable */
  token,
  /** Get the BotId from the token */
  botId: BigInt(atob(token.split(".")[0])),
  /** The server id where you develop your bot and want dev commands created. */
  devGuildId: BigInt(devGuildID),
  /** All lavalink server information */
  lavalinkHost: String(lavalinkHost),
  lavalinkPort: Number(lavalinkPort),
  lavalinkPassword: String(lavalinkPassword),
  lavalinkSecure: Boolean(lavalinkSecure),
};
