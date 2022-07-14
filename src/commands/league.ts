import { ApplicationCommandOptionTypes, ApplicationCommandTypes, Embed, DiscordEmbedField, Emoji, Collection} from "../../deps.ts";
import { reply } from "../utils/reply.ts";
import { createCommand } from "./mod.ts";
import { configs } from "../../configs.ts";

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
    const sumData = await APIFetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${interaction.data!.options![0].value}`);

    if(sumData.status) return reply(Bot, interaction, { content: "I was unable to find a Summoner by that name!" });

    // deno-lint-ignore no-explicit-any
    const leagueData: any = await APIFetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${sumData.id}`);

    
    
    // deno-lint-ignore no-explicit-any
    const champData: any = await APIFetch(`https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${sumData.id}`);
    // deno-lint-ignore no-explicit-any
    const allChamps: any = await APIFetch(`http://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/championFull.json`);

    let fieldRank: DiscordEmbedField = {name: "Level", value: `${sumData.summonerLevel}`, inline: true};

    if(leagueData) {
      for(const key in leagueData) {
        if(leagueData[key].queueType == 'RANKED_SOLO_5x5') {
          const tierEmoji = rankedEmojis[leagueData[key].tier];

          fieldRank = {name: "Rank", value: `<:${(leagueData[key].tier).toLowerCase()}:${tierEmoji}> ${leagueData[key].tier} ${leagueData[key].rank}`, inline: true};
        }
      }
    }

    const topChamps: Array<number> = [];
    const champPoints: Array<string | number> = [];
    const champIcons: Array<Emoji> = [];

    for(let i = 0; i < 3; i++) {
      topChamps.push(allChamps.keys[champData[i].championId]);
      champPoints.push(nFormatter(champData[i].championPoints));

      const champEmoji = (await Bot.helpers.getEmojis(975295750126846013n)).find(emoji => emoji.name === topChamps[i].toString());
      if(!champEmoji) {
        const allEmojis: Collection<bigint, Emoji> = await Bot.helpers.getEmojis(975295750126846013n);

        if(allEmojis.size > 47) {
          allEmojis.forEach(emoji => Bot.helpers.deleteEmoji(975295750126846013n, emoji.id!))
        } else {
          champIcons.push(await Bot.helpers.createEmoji(975295750126846013n, { name: topChamps[i].toString(), image: `http://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/${topChamps[i]}.png`}))
        }
      } else {
        champIcons.push(champEmoji);
      }
    }

    const date = new Date();
    let message: Embed;

    if(((interaction.data!.options![0].value)!.toString()).toLowerCase() == "tomaterman") {
      message = Bot.transformers.embed(Bot, { 
        title: "League of Legends Stats", 
        timestamp: `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`,
        thumbnail: { url: `http://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${sumData.profileIconId}.png`},
        fields: [
          {name: "Player", value: `${sumData.name}`, inline: true},
          {name: "Rank", value: `<:iron:996645679873134593> Iron IV`, inline: true}, 
          {name: '\u200B', value: '\u200B'},
          {name: "Top Champions", value: `<:${champIcons[0].name}:${champIcons[0].id}> ${topChamps[0]} - **0** \n <:${champIcons[1].name}:${champIcons[1].id}> ${topChamps[1]} - **0** \n <:${champIcons[2].name}:${champIcons[2].id}> ${topChamps[2]} - **0**`}
        ]
      });
    } else {
      message = Bot.transformers.embed(Bot, { 
        title: "League of Legends Stats", 
        timestamp: `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`,
        thumbnail: { url: `http://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${sumData.profileIconId}.png`},
        fields: [
          {name: "Player", value: `${sumData.name}`, inline: true},
          fieldRank, 
          {name: '\u200B', value: '\u200B'},
          {name: "Top Champions", value: `<:${champIcons[0].name}:${champIcons[0].id}> ${topChamps[0]} - **${champPoints[0]}** \n <:${champIcons[1].name}:${champIcons[1].id}> ${topChamps[1]} - **${champPoints[1]}** \n <:${champIcons[2].name}:${champIcons[2].id}> ${topChamps[2]} - **${champPoints[2]}**`}
        ]
      });
    }

    await reply(Bot, interaction, { embeds: [message] });
  },
});

async function APIFetch(url: string): Promise<Record<string, unknown>> {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "X-Riot-Token": configs.rToken,
        }
    });

    //return JSON.parse(new TextDecoder().decode((await response.body?.getReader().read()!).value));
    return response.json();
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
  var item = lookup.slice().reverse().find(function(item) {
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