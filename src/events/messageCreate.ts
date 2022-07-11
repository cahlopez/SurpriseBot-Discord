import { Bot } from "../../bot.ts";

Bot.events.messageCreate = (_, message) => {
  if(message.authorId != 994625978657673368n) return;

  addReaction(message.channelId, message.id, '👎');
};

async function addReaction(channelId: bigint, messageId: bigint, reaction: string) {
    await Bot.helpers.addReaction(channelId, messageId, reaction);
}