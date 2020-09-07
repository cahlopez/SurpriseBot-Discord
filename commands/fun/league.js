const Discord = require('discord.js');
const TeemoJS = require('teemojs');
const request = require('request');

const api = TeemoJS(process.env.RIOT_TOKEN);

const champs = {};
const icons = {};

// Get champion ids and names
request({
    url: 'http://ddragon.leagueoflegends.com/cdn/10.16.1/data/en_US/championFull.json',
    json: true,
}, function(error, response, body) {
    for(const key in body.keys) {
        body.keys[key] = body.keys[key].replace(/([a-z])([A-Z])/g, '$1 $2');
        champs[key] = body.keys[key];
    }
});

// Get client summoner icons
request({
    url: 'http://ddragon.leagueoflegends.com/cdn/10.16.1/data/en_US/profileicon.json',
    json: true,
}, function(error, response, body) {
    for(const key in body.data) {
        icons[key] = body.data[key].image.full;
    }
});

function getSummonerData(summonerName) {
    return new Promise((resolve, reject) => {
        api.get('na1', 'summoner.getBySummonerName', summonerName)
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function getMasteryData(summonerId) {
    return new Promise((resolve, reject) => {
        api.get('na1', 'championMastery.getAllChampionMasteries', summonerId)
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function getRankedData(summonerId) {
    return new Promise((resolve, reject) => {
        api.get('na1', 'league.getLeagueEntriesForSummoner', summonerId)
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function getActiveGameData(summonerId) {
    return new Promise((resolve, reject) => {
        api.get('na1', 'spectator.getCurrentGameInfoBySummoner', summonerId)
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function getMatchListData(summonerId, champId) {
    return new Promise((resolve, reject) => {
        api.get('na1', 'match.getMatchlist', summonerId, { champion: champId, endIndex: 40 })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function getMatchData(matchId) {
    return new Promise((resolve, reject) => {
        api.get('na1', 'match.getMatch', matchId)
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = {
    name: 'league',
    cooldown: 3,
    description: 'Get league data',
    return: false,
    run: async (client, message, args) => {
        if(args[0] != undefined) {
            for(const ply in args) {
                const msg = await message.channel.send('Fetching LoL Data...');
                try {

                    const sumData = await getSummonerData(args[ply]);
                    const champData = await getMasteryData(sumData.id);
                    const rankData = await getRankedData(sumData.id);
                    const gameData = await getActiveGameData(sumData.id);

                    const gameIds = [];
                    let matchListData = null;
                    let champId = 0;
                    let wins = 0;

                    if(gameData != null) {
                        for(const player in gameData.participants) {
                            if(gameData.participants[player].summonerId == sumData.id) {
                                champId = gameData.participants[player].championId;
                                break;
                            }
                        }
                        matchListData = await getMatchListData(sumData.accountId, champId);

                        for(const gId in matchListData.matches) {
                            gameIds[gId] = matchListData.matches[gId].gameId;
                        }

                        for(const id in gameIds) {
                            const matchData = await getMatchData(gameIds[id]);

                            for(const player in matchData.participants) {
                                if(matchData.participants[player].championId == champId) {
                                    if(matchData.participants[player].stats.win == true) {
                                        wins += 1;
                                    }
                                }
                            }
                        }
                    }

                    const profileEmbed = new Discord.MessageEmbed()
                        .setTitle('League of Legends Stats')
                        .setThumbnail('http://ddragon.leagueoflegends.com/cdn/10.16.1/img/profileicon/' + icons[sumData.profileIconId])
                        .addField('Player:', `[${sumData.name}](https://na.op.gg/summoner/userName=${args[ply]})`, true)
                        .setTimestamp()
                        .setFooter('Called by ' + message.author.username, message.author.avatarURL());

                    if(rankData[0] != undefined) {
                        for(const key in rankData) {
                            if(rankData[key].queueType == 'RANKED_SOLO_5x5') {
                                profileEmbed.addField('Rank:', rankData[key].tier + ' ' + rankData[key].rank, true);
                                break;
                            }
                        }
                    } else {
                        profileEmbed.addField('Level:', sumData.summonerLevel, true);
                    }

                    profileEmbed.addFields(
                        { name: '\u200B', value: '\u200B' },
                        { name: champs[champData[0].championId] + ' - M' + champData[0].championLevel, value: 'Points: ' + champData[0].championPoints.toLocaleString(), inline: true },
                        { name: champs[champData[1].championId] + ' - M' + champData[1].championLevel, value: 'Points: ' + champData[1].championPoints.toLocaleString(), inline: true },
                        { name: champs[champData[2].championId] + ' - M' + champData[2].championLevel, value: 'Points: ' + champData[2].championPoints.toLocaleString(), inline: true },
                    );

                    if(gameData != null) {
                        profileEmbed.addFields(
                            { name: 'Current Champion Stats', value: '**Champion:** ' + champs[champId] + ' ' + '**Sample Size:** ' + gameIds.length + ' Games' + ' ' + '**Win Rate:** ' + (Math.round(100 * ((wins / gameIds.length) * 100)) / 100) + '%', inline: true },
                        );
                    }

                    message.delete({ timeout: 100 });
                    msg.delete({ timeout: 200 });
                    message.channel.send(profileEmbed);
                } catch(error) {
                    message.delete({ timeout: 100 });
                    msg.edit('Failed to get Lol Data...')
                        .then(messageEdit => {
                            messageEdit.delete({ timeout: 3000 });
                        });
                }
            }
        } else {
            message.channel.send('**Invaild usage!** Reason: You must give a vaild summoner name! \n**Vaild usage:** ?league {summoner name}');
        }
    },
};