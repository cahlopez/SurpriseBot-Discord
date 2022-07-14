import { ApplicationCommandOptionTypes, ApplicationCommandTypes, Embed, DiscordEmbedField, Emoji, Collection} from "../../deps.ts";
import { log } from "../utils/logger.ts"
import { reply } from "../utils/reply.ts";
import { createCommand } from "./mod.ts";
import { configs } from "../../configs.ts";
import { Bot as fBot} from "../../bot.ts";

const rankedEmojis: Record<string, bigint> = {
  "IRON": 996645679873134593n,
  "BRONZE": 996645684218433546n,
  "SILVER": 996645686617591858n,
  "GOLD": 996645682666537081n,
  "PLATINUM": 996645689629102200n,
  "DIAMOND": 996645687938781234n,
  "MASTER": 996645678405144616n,
  "GRANDMASTER": 996645681567641732n,
  "CHALLENGER": 996645685401235597n
}

createCommand({
  name: "league",
  description: "Get league data for a player!",
  type: ApplicationCommandTypes.ChatInput,
  options: [
    {
      name: "summoner",
      description: "The summoner name of the wanted player.",
      required: true,
      type: ApplicationCommandOptionTypes.String,
    }
  ],
  execute: async (Bot, interaction) => {
    try {
      const sumData = await APIFetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${interaction.data!.options![0].value}`);

      if(sumData.status) return reply(Bot, interaction, { content: "I was unable to find a Summoner by that name!" });

      const leagueData = await APIFetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${sumData.id}`);
      const champData = await APIFetch(`https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${sumData.id}`);
      const allChamps = await APIFetch(`http://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/championFull.json`);
      const recMatch = await APIFetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${sumData.puuid}/ids?type=ranked&start=0&count=3`)

      let fieldRank: DiscordEmbedField = {name: "Rank", value: `*Unranked*`, inline: true};
      const recChampsField: DiscordEmbedField = {name: "Recent Ranked Games", value: `\u17b5 \u17b5 \u17b5 \u17b5 \u17b5 \u17b5 \u17b5 *No games found*`, inline: true};

      if(leagueData) {
        for(const key in leagueData) {
          if(leagueData[key].queueType == 'RANKED_SOLO_5x5') {
            const tierEmoji = rankedEmojis[leagueData[key].tier];

            fieldRank = {name: "Rank", value: `<:${(leagueData[key].tier).toLowerCase()}:${tierEmoji}> ${leagueData[key].tier} ${leagueData[key].rank}`, inline: true};
          }
        }
      }

      const topChamps: Array<string> = [];
      const recChamps: Array<string> = [];
      const champPoints: Array<string | number> = [];
      const topChampIcons: Array<Emoji> = [];
      const recChampIcons: Array<Emoji> = [];
      // deno-lint-ignore no-explicit-any
      const recMatchData: any[][] = []

      for(const id in recMatch) {
        const matchInfo = await APIFetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${recMatch[id]}`);

        for(const par in matchInfo.info.participants) {
          if(matchInfo.info.participants[par].puuid == sumData.puuid) {
            const tempArr = [];

            tempArr.push(matchInfo.info.participants[par].championName);

            if(matchInfo.info.participants[par].win) {
              tempArr.push("W");
            } else {
              tempArr.push("L");
            }

            tempArr.push(matchInfo.info.participants[par].kills);
            tempArr.push(matchInfo.info.participants[par].deaths);
            tempArr.push(matchInfo.info.participants[par].assists);

            recMatchData.push(tempArr);
          }
        }
      }

      for(let i = 0; i < 3; i++) {
        topChamps.push(allChamps.keys[champData[i].championId]);
        champPoints.push(nFormatter(champData[i].championPoints));

        await doesEmojiExist(Bot, topChamps[i], topChampIcons);
      }

      if(recMatchData.length > 0) {
        recChampsField.value = "";

        for(let i = 0; i < recMatchData.length; i++) {
          recChamps.push(recMatchData[i][0]);

          await doesEmojiExist(Bot, recChamps[i], recChampIcons);
          recChampsField.value += `<:${recChampIcons[i].name}:${recChampIcons[i].id}> ${recChamps[i]} - **${recMatchData[i][2]}/${recMatchData[i][3]}/${recMatchData[i][4]} (${recMatchData[i][1]})** \n`
        }
      }

      const date = new Date();
      let message: Embed;

      //((interaction.data!.options![0].value)!.toString()).toLowerCase() == "tomaterman"
      if(false) {
        message = Bot.transformers.embed(Bot, { 
          title: "League of Legends Stats", 
          timestamp: `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`,
          thumbnail: { url: `http://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${sumData.profileIconId}.png`},
          fields: [
            {name: "Player", value: `${sumData.name}`, inline: true},
            {name: "Level", value: `${sumData.summonerLevel}`, inline: true},
            {name: "Rank", value: `<:iron:996645679873134593> Iron IV`, inline: true}, 
            {name: '\u200B', value: '\u200B'},
            {
              name: "Top Champions", 
              value: `<:${topChampIcons[0].name}:${topChampIcons[0].id}> ${topChamps[0]} - **0**
              <:${topChampIcons[1].name}:${topChampIcons[1].id}> ${topChamps[1]} - **0**
              <:${topChampIcons[2].name}:${topChampIcons[2].id}> ${topChamps[2]} - **0**`, 
              inline: true
            },
            {
              name: "Recent Ranked Games", 
              value: `<:${topChampIcons[2].name}:${topChampIcons[2].id}> ${topChamps[0]} - **0/20/0 (L)** 
              <:${topChampIcons[0].name}:${topChampIcons[0].id}> ${topChamps[0]} - **0/20/0 (L)** 
              <:${topChampIcons[1].name}:${topChampIcons[1].id}> ${topChamps[0]} - **0/20/0 (L)**`, 
              inline: true
            },
          ]
        });
      } else {
        message = Bot.transformers.embed(Bot, { 
          title: "League of Legends Stats", 
          timestamp: `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`,
          thumbnail: { url: `http://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${sumData.profileIconId}.png`},
          fields: [
            {name: "Player", value: `${sumData.name}`, inline: true},
            {name: "Level", value: `${sumData.summonerLevel}`, inline: true},
            fieldRank,
            {
              name: "Top Champions", 
              value: `<:${topChampIcons[0].name}:${topChampIcons[0].id}> ${topChamps[0]} - **${champPoints[0]}**
              <:${topChampIcons[1].name}:${topChampIcons[1].id}> ${topChamps[1]} - **${champPoints[1]}**
              <:${topChampIcons[2].name}:${topChampIcons[2].id}> ${topChamps[2]} - **${champPoints[2]}**`,
              inline: true
            },
            recChampsField,
          ]
        });
      }

      await reply(Bot, interaction, { embeds: [message] });
    } catch (error) {
      log.error(error);

      await reply(Bot, interaction, { content: "An unknown error occured, please try again!" });
    }
  },
});

async function APIFetch(url: string) {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "X-Riot-Token": configs.rToken,
        }
    });

    //return JSON.parse(new TextDecoder().decode((await response.body?.getReader().read()!).value));
    return response.json();
}

async function doesEmojiExist(bot: typeof fBot, wantedEmoji: string, arr: Array<Emoji>) {
  // console.log(wantedEmoji);
  const champEmoji = (await bot.helpers.getEmojis(975295750126846013n)).find(emoji => emoji.name === wantedEmoji);

  if(!champEmoji) {
    const allEmojis: Collection<bigint, Emoji> = await bot.helpers.getEmojis(975295750126846013n);

    if(allEmojis.size > 47) {
      allEmojis.forEach(emoji => bot.helpers.deleteEmoji(975295750126846013n, emoji.id!))
    } else {
      arr.push(await bot.helpers.createEmoji(975295750126846013n, { name: wantedEmoji, image: `http://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/${wantedEmoji}.png`}))
    }
  } else {
    arr.push(champEmoji);
  }

  return arr;
}

function nFormatter(num: number) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find(function(item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(0).replace(rx, "$1") + item.symbol : "0";
}

// async function DDFetch(url: string): Promise<Record<string, unknown>> {
//   const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "X-Riot-Token": "RGAPI-a125c418-4c89-4fee-a7ab-428a8a6d80f5",
//       }
//   });

//   return response.json();
// }