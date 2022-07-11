import { CacheProps } from "https://deno.land/x/discordeno@13.0.0-rc45/plugins/cache/mod.ts";
import { Bot, DiscordVoiceState } from "https://deno.land/x/discordeno@13.0.0-rc45/mod.ts";
export function fixCacheUpdating(fBot: Bot & CacheProps) {
  // Temporary fix so voice states update in cache
  const old = fBot.handlers.VOICE_STATE_UPDATE;
  fBot.handlers.VOICE_STATE_UPDATE = (bot, data, shardId) => {
    const payload = data.d as DiscordVoiceState;
    if (!payload.guild_id) return;
    const vs = bot.transformers.voiceState(bot, {
      voiceState: payload,
      guildId: bot.transformers.snowflake(payload.guild_id),
    });
    fBot.guilds.get(vs.guildId)?.voiceStates.set(vs.userId, vs);
    old(bot, data, shardId);
  };
}
