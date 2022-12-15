const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildIntegrations,
  ]
});
const axios = require('axios');

const { EmbedBuilder } = require('discord.js');
var classementJS = require('./classement')
var HallOfFames = require('./HallOfFames')
//var ratio = require('./HallOfFames')
const fs = require('fs');
var Lancement = false;
var LancementTFT = false;
var membres = require('./profile.json');
const challenger = "<:challenger:1022113918107258891>";

var KeyRequise = require('../key');
const riotApiKey = (KeyRequise.riotApiKey);
const riotApiKeyTFT = (KeyRequise.riotApiKeyTFT);
const keyDiscord = (KeyRequise.keyDiscord);
const keyDiscordbotsecondaire = (KeyRequise.keyDiscordbotsecondaire);


client.on("messageCreate", async (message) => {

  if (message.content.startsWith("!profile")) {
    try {
      words = message.content.split(" ");
      var names = words[1];

      //if words is < 2, then the user didn't specify a name
      if (words.length > 2) {
        for (var i = 2; i < words.length; i++) {
          names += words[i];
        }
      } else if (words.length === 1) {
        message.channel.send({ content: "Tu veux que je add qui avec ca enculé" });
        return;
      }
      names = names.toLowerCase();
      nomTMP = names;
      names = encodeURI(names)
      console.log(names)
      var a;
      var x = -1;
      try {

        var Profile = await axios.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + names + "?api_key=" + riotApiKey);
        var Ranked = await axios.get('https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + Profile.data.id + '?api_key=' + riotApiKey);
        var Mastery = await axios.get('https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/' + Profile.data.id + '?api_key=' + riotApiKey);
        var champList = require('./champ.json');
        var champname1 = champList.data[Object.keys(champList.data).find(name => champList.data[name].key == Mastery.data[0].championId)].name;
        console.log(Profile)
      } catch (e) {
        message.channel.send({ content: 'Change le pseudo fdp' });
        a = 1
      }
      finally {
        if (a != 1) {
          // console.log(Profile.data);
          // console.log(Ranked);
          for (var i = 0; i < Ranked.data.length; i++) {
            if (Ranked.data[i].queueType === 'RANKED_SOLO_5x5') {
              var rank = Ranked.data[i].tier;
              var division = Ranked.data[i].rank;
              var leaguePoints = (Ranked.data[i].leaguePoints).toString();
              var x = 1;
              break;
            } else {
              var x = 0;
            }

          }
          //  console.log(rank)
          //const tierRank = ranked.data.tier
          //var args = message.content.slice(prefix.length).split('/ +/');
          var exampleEmbed = {
            color: 0x0099ff,
            title: 'Stat lol',
            url: 'https://euw.op.gg/summoners/euw/' + names,
            author: {
              name: Profile.data.name,
              icon_url: 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon' + Profile.data.profileIconId + '.jpg?image=q_auto&image=q_auto,f_webp,w_auto&v=1655280878653',
              url: 'https://euw.op.gg/summoners/euw/' + names,
            },
            thumbnail: {
              url: 'https://opgg-static.akamaized.net/images/medals_new/' + rank + '.png?image=q_auto,f_webp,w_144&v=1655280878465',
            },
            fields: [
              {
                name: "Niveau d'invocateur",
                value: (Profile.data.summonerLevel).toString(),
              },
              {
                name: "ID du compte",
                value: (Profile.data.id).toString(),
              },

              {
                name: "RANK",
                value: rank + " " + division + " " + leaguePoints + "LP",

              },
              {
                name: "Champion préféré : " + champname1,
                value: (Mastery.data[0].championPoints).toString(),
              },
              {
                name: '\u200b',
                value: '\u200b',
                inline: false,
              },

            ],
            thumbnail: {
              url: 'https://opgg-static.akamaized.net/images/medals_new/' + rank + '.png?image=q_auto,f_webp,w_144&v=1655280878465',
            },
            image: {
              url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
            },
            timestamp: new Date(),
            footer: {
              text: 'Requested by ' + message.author.username,
              icon_url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
            },
          };
          //  console.log(profile);
          //console.log(Ranked);
          //console.log(x);
          if (x === -1 || x === 0) {
            var exampleEmbed = {
              color: 0x0099ff,
              title: 'Stat lol',
              url: 'https://euw.op.gg/summoners/euw/' + names,
              author: {
                name: Profile.data.name,
                icon_url: 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon' + Profile.data.profileIconId + '.jpg?image=q_auto&image=q_auto,f_webp,w_auto&v=1655280878653',
                url: 'https://euw.op.gg/summoners/euw/' + names,
              },
              thumbnail: {
                url: 'http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/' + champname1 + '.png',
              },
              fields: [
                {
                  name: "Niveau d'invocateur",
                  value: (Profile.data.summonerLevel).toString(),
                },
                {
                  name: "ID du compte",
                  value: (Profile.data.id).toString(),
                },

                {
                  name: "RANK",
                  value: " t pas classé fdp ",

                },
                {
                  name: "Champion préféré : " + champname1,
                  value: (Mastery.data[0].championPoints).toString(),
                },
                {
                  name: '\u200b',
                  value: '\u200b',
                  inline: false,
                },

              ],
              thumbnail: {
                url: 'http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/' + champname1 + '.png',
              },
              image: {
                url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
              },
              timestamp: new Date(),
              footer: {
                text: 'Requested by ' + message.author.username,
                icon_url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
              },
            };
            message.channel.send({ embeds: [exampleEmbed] });
          } else {
            message.channel.send({ embeds: [exampleEmbed] });
          }

        }
      }

    }
    catch (err) {
      console.log(err);
    }
  }

})







client.on("messageCreate", async (message) => {

  if (message.content.startsWith("!myprofile")) {
    try {
      for (var i = 0; i < Object.keys(membres.nom).length; i++) {
        if (membres.nom[Object.keys(membres.nom)[i]].IdDiscord === message.author.id) {
          var names = membres.nom[Object.keys(membres.nom)[i]].nomcompte;
        }
      }
      var a;
      var x = -1;
      try {

        var Profile = await axios.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + names + "?api_key=" + riotApiKey);
        var Ranked = await axios.get('https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + Profile.data.id + '?api_key=' + riotApiKey);
        var Mastery = await axios.get('https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/' + Profile.data.id + '?api_key=' + riotApiKey);
        var champList = require('./champ.json');
        var champname1 = champList.data[Object.keys(champList.data).find(name => champList.data[name].key == Mastery.data[0].championId)].name;
        console.log(Profile)
      } catch (e) {
        message.channel.send({ content: 'Change le pseudo fdp' });
        a = 1
      }
      finally {
        if (a != 1) {
          // console.log(Profile.data);
          // console.log(Ranked);
          for (var i = 0; i < Ranked.data.length; i++) {
            if (Ranked.data[i].queueType === 'RANKED_SOLO_5x5') {
              var rank = Ranked.data[i].tier;
              var division = Ranked.data[i].rank;
              var leaguePoints = (Ranked.data[i].leaguePoints).toString();
              var x = 1;
              break;
            } else {
              var x = 0;
            }

          }
          //  console.log(rank)
          //const tierRank = ranked.data.tier
          //var args = message.content.slice(prefix.length).split('/ +/');
          var exampleEmbed = {
            color: 0x0099ff,
            title: 'Stat lol',
            url: 'https://euw.op.gg/summoners/euw/' + names,
            author: {
              name: Profile.data.name,
              icon_url: 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon' + Profile.data.profileIconId + '.jpg?image=q_auto&image=q_auto,f_webp,w_auto&v=1655280878653',
              url: 'https://euw.op.gg/summoners/euw/' + names,
            },
            thumbnail: {
              url: 'https://opgg-static.akamaized.net/images/medals_new/' + rank + '.png?image=q_auto,f_webp,w_144&v=1655280878465',
            },
            fields: [
              {
                name: "Niveau d'invocateur",
                value: (Profile.data.summonerLevel).toString(),
              },
              {
                name: "ID du compte",
                value: (Profile.data.id).toString(),
              },

              {
                name: "RANK",
                value: rank + " " + division + " " + leaguePoints + "LP",

              },
              {
                name: "Champion préféré : " + champname1,
                value: (Mastery.data[0].championPoints).toString(),
              },
              {
                name: '\u200b',
                value: '\u200b',
                inline: false,
              },

            ],
            thumbnail: {
              url: 'https://opgg-static.akamaized.net/images/medals_new/' + rank + '.png?image=q_auto,f_webp,w_144&v=1655280878465',
            },
            image: {
              url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
            },
            timestamp: new Date(),
            footer: {
              text: 'Requested by ' + message.author.username,
              icon_url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
            },
          };
          //  console.log(profile);
          //console.log(Ranked);
          //console.log(x);
          if (x === -1 || x === 0) {
            var exampleEmbed = {
              color: 0x0099ff,
              title: 'Stat lol',
              url: 'https://euw.op.gg/summoners/euw/' + names,
              author: {
                name: Profile.data.name,
                icon_url: 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon' + Profile.data.profileIconId + '.jpg?image=q_auto&image=q_auto,f_webp,w_auto&v=1655280878653',
                url: 'https://euw.op.gg/summoners/euw/' + names,
              },
              thumbnail: {
                url: 'http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/' + champname1 + '.png',
              },
              fields: [
                {
                  name: "Niveau d'invocateur",
                  value: (Profile.data.summonerLevel).toString(),
                },
                {
                  name: "ID du compte",
                  value: (Profile.data.id).toString(),
                },

                {
                  name: "RANK",
                  value: " t pas classé fdp ",

                },
                {
                  name: "Champion préféré : " + champname1,
                  value: (Mastery.data[0].championPoints).toString(),
                },
                {
                  name: '\u200b',
                  value: '\u200b',
                  inline: false,
                },

              ],
              thumbnail: {
                url: 'http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/' + champname1 + '.png',
              },
              image: {
                url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
              },
              timestamp: new Date(),
              footer: {
                text: 'Requested by ' + message.author.username,
                icon_url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
              },
            };
            message.channel.send({ embeds: [exampleEmbed] });
          } else {
            message.channel.send({ embeds: [exampleEmbed] });
          }

        }
      }

    }
    catch (err) {
      console.log(err);
    }
  }

})











//MASTERY
client.on("messageCreate", async message => {
  if (message.content.startsWith("!mastery")) {
    try {
      var words = message.content.split(' ');
      var names = words[1];
      var nameChamp = words[2];

      var champList = require('./champ.json');
      var champId = champList.data[Object.keys(champList.data).find(key => champList.data[key].id == nameChamp)].key;
      //  console.log(champId);

      var profile = await axios.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + names + "?api_key=" + riotApiKey);
      var Mastery = await axios.get('https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/' + profile.data.id + '/by-champion/' + champId + '?api_key=' + riotApiKey);

      // console.log(Mastery.data.championPoints);
      // console.log(Mastery.data.championLevel);

      //get the champion with the max points
      var max = 0;
      var champMax = "";
      for (var key in Mastery.data) {
        if (Mastery.data[key].championPoints > max) {
          max = Mastery.data[key].championPoints;
          champMax = Mastery.data[key].championId;
        }
      }
      //console.log(champMax);


      var exampleEmbed = {
        color: 0x0099ff,
        title: 'Stat lol',
        url: 'https://euw.op.gg/summoners/euw/' + names,
        author: {
          name: nameChamp,
          icon_url: 'http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/' + nameChamp + '.png',
          url: 'https://euw.op.gg/summoners/euw/' + names,
        },
        thumbnail: {
          url: 'http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/' + nameChamp + '.png',
        },
        fields: [
          {
            name: "Niveau de Maitrise",
            value: (Mastery.data.championLevel).toString(),
          },
          {
            name: "Points de Maitrise",
            value: (Mastery.data.championPoints).toString(),
          },
          {
            name: '\u200b',
            value: '\u200b',
            inline: false,
          },
        ],
        image: {
          url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + profile.data.profIconId + '.png',
        },
        timestamp: new Date(),
        footer: {
          text: 'Requested by ' + message.author.username,
          icon_url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + profile.data.profIconId + '.png',
        },
      };
      message.channel.send({ embeds: [exampleEmbed] });
    }
    catch (err) {
      console.log(err);
    }
  }
})


///////TOPMASTERY///////
client.on("messageCreate", async message => {
  if (message.content.startsWith("!topmastery")) {
    try {
      const words = message.content.split(' ');
      var names = words[1];
      var champList = require('./champ.json');
      const profile = await axios.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + names + "?api_key=" + riotApiKey);
      const Mastery = await axios.get('https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/' + profile.data.id + '?api_key=' + riotApiKey);
      var champname1 = champList.data[Object.keys(champList.data).find(name => champList.data[name].key == Mastery.data[0].championId)].name;
      var champname2 = champList.data[Object.keys(champList.data).find(name => champList.data[name].key == Mastery.data[1].championId)].name;
      var champname3 = champList.data[Object.keys(champList.data).find(name => champList.data[name].key == Mastery.data[2].championId)].name;


      var exampleEmbed = {
        color: 0x0099ff,
        title: 'Premier ' + champname1,
        url: 'https://euw.op.gg/summoners/euw/' + names,
        author: {
          name: "Top 3 Maitrise",
          icon_url: 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon' + profile.data.profileIconId + '.jpg?image=q_auto&image=q_auto,f_webp,w_auto&v=1655280878653',
          url: 'https://euw.op.gg/summoners/euw/' + names,
        },
        thumbnail: {
          url: 'http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/' + champname1 + '.png',
        },
        fields: [
          {
            name: "Points de Maitrise",

            value: (Mastery.data[0].championPoints).toString(),
          },
          {
            name: "2ème " + champname2,
            value: (Mastery.data[1].championPoints).toString(),
          },
          {
            name: "3ème " + champname3,
            value: (Mastery.data[2].championPoints).toString(),
          },
          {
            name: '\u200b',
            value: '\u200b',
            inline: false,
          },
        ],

        timestamp: new Date(),
        footer: {
          text: 'Requested by ' + message.author.username,
          icon_url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + profile.data.profIconId + '.png',
        },
      };

      message.channel.send({ embeds: [exampleEmbed] });
    }
    catch (err) {
      console.log(err);
    }
  }
})


//HELP
client.on("messageCreate", async message => {
  if (message.content.startsWith("!help")) {
    try {
      const exampleEmbed = {
        color: 0x0099ff,
        title: 'Liste Commande',
        url: "https://www.youtube.com/watch?v=fahfM6HY7q4",

        author: {
          name: "test",
          icon_url: 'https://pbs.twimg.com/profile_images/1588007055/IMG_0956_3_400x400.jpg',
          url: 'https://www.youtube.com/watch?v=fahfM6HY7q4',
        },
        thumbnail: {
          url: 'https://pbs.twimg.com/profile_images/1588007055/IMG_0956_3_400x400.jpg',
        },
        fields: [
          {
            name: "!profile + nomJoueur",

            value: 'Affiche le profil du joueur',
          },
          {
            name: "!mastery + nomJoueur + nomChamp",

            value: 'Affiche les stats du champion du joueur',
          },
          {
            name: "!topmastery + nomJoueur",

            value: 'Affiche les meilleurs champs du joueur',
          },
        ],

        timestamp: new Date(),
        footer: {
          text: 'Requested by ' + message.author.username,
        },
      };

      message.channel.send({ embeds: [exampleEmbed] });
    }
    catch (err) {
      console.log(err);
    }
  }
})





//tft 


client.on("messageCreate", async message => {
  if (message.content.startsWith("!TFT")) {
    try {
      var words = message.content.split(' ');
      var names = words[1];
      var a;
      var x = -1;
      var y = -1;
      try {
        var ProfileTFT = await axios.get('https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-name/' + names + '?api_key=' + riotApiKeyTFT);
        var RankedTFT = await axios.get('https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/' + ProfileTFT.data.id + '?api_key=' + riotApiKeyTFT);
        var Profile = await axios.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + names + "?api_key=" + riotApiKey);
        var Ranked = await axios.get('https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + Profile.data.id + '?api_key=' + riotApiKey);
        var matchID = await axios.get('https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/' + ProfileTFT.data.puuid + '/ids?start=0&count=20&api_key=' + riotApiKeyTFT);
        var games = await axios.get('https://europe.api.riotgames.com/tft/match/v1/matches/' + matchID.data[0] + '?api_key=' + riotApiKeyTFT);
        var IconeRank;
        // console.log(matchID);
        //   console.log(games.data.info.participants[1].puuid);

      } catch (e) {
        message.channel.send({ content: 'Change le pseudo fdp' });
        a = 1
      }
      finally {
        if (a != 1) {
          // console.log(RankedTFT);
          //console.log(ProfileTFT);
          for (var i = 0; i < Ranked.data.length; i++) {
            if (Ranked.data[i].queueType === 'RANKED_TFT_DOUBLE_UP') {
              var rankDUO = Ranked.data[i].tier;
              var divisionDUO = Ranked.data[i].rank;
              var leaguePointsDUO = (Ranked.data[i].leaguePoints).toString();
              var x = 1;
              IconeRank = rankDUO;
              break;
            }
          }
          for (var i = 0; i < RankedTFT.data.length; i++) {
            if (RankedTFT.data[i].queueType === 'RANKED_TFT') {
              var rank = RankedTFT.data[i].tier;
              var division = RankedTFT.data[i].rank;
              var leaguePoints = (RankedTFT.data[i].leaguePoints).toString();
              var y = 1;
              IconeRank = rank;
              break;
            }
          }
          // console.log(rank)
          //const tierRank = ranked.data.tier
          //var args = message.content.slice(prefix.length).split('/ +/');
          var exampleEmbed = {
            color: 0x0099ff,
            title: 'Stat TFT',
            url: 'https://euw.op.gg/summoners/euw/' + names,
            author: {
              name: Profile.data.name,
              icon_url: 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon' + Profile.data.profileIconId + '.jpg?image=q_auto&image=q_auto,f_webp,w_auto&v=1655280878653',
              url: 'https://euw.op.gg/summoners/euw/' + names,
            },
            thumbnail: {
              url: 'https://opgg-static.akamaized.net/images/medals_new/' + IconeRank + '.png?image=q_auto,f_webp,w_144&v=1655280878465',
            },
            fields: [
              {
                name: "Niveau d'invocateur",
                value: (Profile.data.summonerLevel).toString(),
              },
              {
                name: "ID du compte",
                value: (Profile.data.id).toString(),
              },
              {
                name: "RANK TFT SOLOQ",
                value: rank + " " + division + " " + leaguePoints + "LP",

              },
              {
                name: "RANK Double Up",
                value: rankDUO + " " + divisionDUO + " " + leaguePointsDUO + "LP",

              },

              {
                name: '\u200b',
                value: '\u200b',
                inline: false,
              },

            ],
            thumbnail: {
              url: 'https://opgg-static.akamaized.net/images/medals_new/' + IconeRank + '.png?image=q_auto,f_webp,w_144&v=1655280878465',
            },
            image: {
              url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
            },
            timestamp: new Date(),
            footer: {
              text: 'Requested by ' + message.author.username,
              icon_url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
            },
          };
          //  console.log(profile);
          //console.log(Ranked);
          //console.log(x);

          //classé ni solo ni duo
          if (x === -1 && y === -1) {
            var exampleEmbed = {
              color: 0x0099ff,
              title: 'Stat TFT',
              url: 'https://euw.op.gg/summoners/euw/' + names,
              author: {
                name: Profile.data.name,
                icon_url: 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon' + Profile.data.profileIconId + '.jpg?image=q_auto&image=q_auto,f_webp,w_auto&v=1655280878653',
                url: 'https://euw.op.gg/summoners/euw/' + names,
              },
              thumbnail: {
                url: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fopgg-static.akamaized.net%2Fimages%2Fmedals%2Fdefault.png%3Fimage%3Dq_auto%26image%3Dq_auto%2Cf_webp%2Cw_auto%26v%3D1645687238693&imgrefurl=https%3A%2F%2Feuw.op.gg%2Fsummoner%2FuserName%3Ddeichkind&tbnid=yJwlSStXyl4N3M&vet=12ahUKEwjZi_uf0qP6AhUJpBoKHTxxC_0QMygAegQIARAj..i&docid=s4gA7jSuNduzEM&w=280&h=280&itg=1&q=image%20unranked%20op.gg&ved=2ahUKEwjZi_uf0qP6AhUJpBoKHTxxC_0QMygAegQIARAj',
              },
              fields: [
                {
                  name: "Niveau d'invocateur",
                  value: (Profile.data.summonerLevel).toString(),
                },
                {
                  name: "ID du compte",
                  value: (Profile.data.id).toString(),
                },
                {
                  name: "RANK TFT SOLOQ",
                  value: "t pas classé fdp",

                },
                {
                  name: "RANK Double Up",
                  value: "t pas classé fdp",

                },
                {
                  name: '\u200b',
                  value: '\u200b',
                  inline: false,
                },

              ],
              thumbnail: {
                url: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fopgg-static.akamaized.net%2Fimages%2Fmedals%2Fdefault.png%3Fimage%3Dq_auto%26image%3Dq_auto%2Cf_webp%2Cw_auto%26v%3D1645687238693&imgrefurl=https%3A%2F%2Feuw.op.gg%2Fsummoner%2FuserName%3Ddeichkind&tbnid=yJwlSStXyl4N3M&vet=12ahUKEwjZi_uf0qP6AhUJpBoKHTxxC_0QMygAegQIARAj..i&docid=s4gA7jSuNduzEM&w=280&h=280&itg=1&q=image%20unranked%20op.gg&ved=2ahUKEwjZi_uf0qP6AhUJpBoKHTxxC_0QMygAegQIARAj',
              },
              image: {
                url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
              },
              timestamp: new Date(),
              footer: {
                text: 'Requested by ' + message.author.username,
                icon_url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
              },
            };

            // classé solo pas duo
          } else if (x === -1 && y === 1) {
            var exampleEmbed = {
              color: 0x0099ff,
              title: 'Stat TFT',
              url: 'https://euw.op.gg/summoners/euw/' + names,
              author: {
                name: Profile.data.name,
                icon_url: 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon' + Profile.data.profileIconId + '.jpg?image=q_auto&image=q_auto,f_webp,w_auto&v=1655280878653',
                url: 'https://euw.op.gg/summoners/euw/' + names,
              },
              thumbnail: {
                url: 'https://opgg-static.akamaized.net/images/medals_new/' + IconeRank + '.png?image=q_auto,f_webp,w_144&v=1655280878465',
              },
              fields: [
                {
                  name: "Niveau d'invocateur",
                  value: (Profile.data.summonerLevel).toString(),
                },
                {
                  name: "ID du compte",
                  value: (Profile.data.id).toString(),
                },
                {
                  name: "RANK TFT SOLOQ",
                  value: rank + " " + division + " " + leaguePoints + "LP",

                },
                {
                  name: "RANK Double Up",
                  value: "t pas classé fdp",

                },
                {
                  name: '\u200b',
                  value: '\u200b',
                  inline: false,
                },

              ],
              thumbnail: {
                url: 'https://opgg-static.akamaized.net/images/medals_new/' + IconeRank + '.png?image=q_auto,f_webp,w_144&v=1655280878465',
              },
              image: {
                url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
              },
              timestamp: new Date(),
              footer: {
                text: 'Requested by ' + message.author.username,
                icon_url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
              },
            };

            // classé duo pas solo
          } else if (x === 1 && y === -1) {
            var exampleEmbed = {
              color: 0x0099ff,
              title: 'Stat TFT',
              url: 'https://euw.op.gg/summoners/euw/' + names,
              author: {
                name: Profile.data.name,
                icon_url: 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon' + Profile.data.profileIconId + '.jpg?image=q_auto&image=q_auto,f_webp,w_auto&v=1655280878653',
                url: 'https://euw.op.gg/summoners/euw/' + names,
              },
              thumbnail: {
                url: 'https://opgg-static.akamaized.net/images/medals_new/' + IconeRank + '.png?image=q_auto,f_webp,w_144&v=1655280878465',
              },
              fields: [
                {
                  name: "Niveau d'invocateur",
                  value: (Profile.data.summonerLevel).toString(),
                },
                {
                  name: "ID du compte",
                  value: (Profile.data.id).toString(),
                },
                {
                  name: "RANK TFT SOLOQ",
                  value: "t pas classé fdp",

                },
                {
                  name: "RANK Double Up",
                  value: rankDUO + " " + divisionDUO + " " + leaguePointsDUO + "LP",

                },
                {
                  name: '\u200b',
                  value: '\u200b',
                  inline: false,
                },

              ],
              thumbnail: {
                url: 'https://opgg-static.akamaized.net/images/medals_new/' + IconeRank + '.png?image=q_auto,f_webp,w_144&v=1655280878465',
              },
              image: {
                url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
              },
              timestamp: new Date(),
              footer: {
                text: 'Requested by ' + message.author.username,
                icon_url: 'https://ddragon.leagueoflegends.com/cdn/11.4.1/img/profileicon/' + Profile.data.profIconId + '.png',
              },
            };



          }
          message.channel.send({ embeds: [exampleEmbed] });

        }
      }

    }
    catch (err) {
      console.log(err);
    }
  }

})



//create a function 
let messageLoose = async () => {
  console.log("refresh");
  try {
    HallOfFames.deleteLesMecsQuiExistentPlus();
    var SalonResultat = 'testjason';
    for (var i = 0; i < Object.keys(membres.nom).length; i++) {
      var nomcompte = membres.nom[Object.keys(membres.nom)[i]].nomcompte;
      var VNom = membres.nom[Object.keys(membres.nom)[i]].nom;
      var Profiles = await axios.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + nomcompte + '?api_key=' + riotApiKey);
      var matchID = await axios.get('https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/' + Profiles.data.puuid + '/ids?start=0&count=20&api_key=' + riotApiKey);
      var games = await axios.get('https://europe.api.riotgames.com/lol/match/v5/matches/' + matchID.data[0] + '?api_key=' + riotApiKey);
      var Ranked = await axios.get('https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + Profiles.data.id + '?api_key=' + riotApiKey);
      //console.log("OK");
      var ProfileTFT = await axios.get('https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-name/' + nomcompte + '?api_key=' + riotApiKeyTFT);
      var matchIDTFT = await axios.get('https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/' + ProfileTFT.data.puuid + '/ids?start=0&count=20&api_key=' + riotApiKeyTFT);
      var gamesTFT = await axios.get('https://europe.api.riotgames.com/tft/match/v1/matches/' + matchIDTFT.data[0] + '?api_key=' + riotApiKeyTFT);


      if (membres.nom[Object.keys(membres.nom)[i]].dernierMatch !== matchID.data[0]) {
        membres.nom[Object.keys(membres.nom)[i]].dernierMatch = matchID.data[0];
        //console.log(Lancement)
        if (membres.nom[Object.keys(membres.nom)[i]].dernierMatch !== undefined && Lancement === true) {
          for (var b = 0; b < games.data.info.participants.length; b++) {

            if (games.data.info.participants[b].puuid === Profiles.data.puuid) {
              var resultLOL = games.data.info.participants[b].win;
              break;
            }

          }
          client.channels.cache.find(channel => channel.name === SalonResultat).send("Test sur : " + VNom);
          membres.nom[Object.keys(membres.nom)[i]].NombreGames++;
          if (resultLOL === false) {
            membres.nom[Object.keys(membres.nom)[i]].NombresDefaites++;


            // pour dm le mec
            //var users = await client.users.fetch(membres.nom[Object.keys(membres.nom)[i]].IdDiscord);
            //users.send('LOOSER');

            if (games.data.info.participants[b].kills <= games.data.info.participants[b].deaths) {
              client.channels.cache.find(channel => channel.name === SalonResultat).send(`finito et KDA DESASTREUX :  ` + games.data.info.participants[b].kills + ' Kills ' + games.data.info.participants[b].deaths + ' Morts ' + games.data.info.participants[b].assists + ' Assists');
            } else {
              client.channels.cache.find(channel => channel.name === SalonResultat).send(`finito mais kda correct : ` + games.data.info.participants[b].kills + ' Kills ' + games.data.info.participants[b].deaths + ' Morts ' + games.data.info.participants[b].assists + ' Assists');
            }
          }
          else if (games.data.info.participants[b].kills <= games.data.info.participants[b].deaths) {
            membres.nom[Object.keys(membres.nom)[i]].NombresVictoires++;
            client.channels.cache.find(channel => channel.name === SalonResultat).send(`gg mais calme ton chibre tu t fais carry tema se KDA : ` + games.data.info.participants[b].kills + ' Kills ' + games.data.info.participants[b].deaths + ' Morts ' + games.data.info.participants[b].assists + ' Assists');
          } else {
            membres.nom[Object.keys(membres.nom)[i]].NombresVictoires++;
            client.channels.cache.find(channel => channel.name === SalonResultat).send(`gg`);
          }
          HallOfFames.MajJoueurRatio(membres.nom[Object.keys(membres.nom)[i]]);
          for (var a = 0; a < Ranked.data.length; a++) {
            if (Ranked.data[a].queueType === 'RANKED_SOLO_5x5') {
              membres.nom[Object.keys(membres.nom)[i]].rankLoL = Ranked.data[a].tier;
              membres.nom[Object.keys(membres.nom)[i]].tierLoL = Ranked.data[a].rank;
              membres.nom[Object.keys(membres.nom)[i]].LPLoL = Ranked.data[a].leaguePoints;
              break;
            }
          }

        }
      }
      /*
      EMBED MESSAGELOOSE
      
      let classement = '';
      classement += `\`${y}\` ${membres.nom[Object.keys(membres.nom)[i]].nom}` + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + membres.nom[Object.keys(membres.nom)[i]].EmoteTFT + " " + membres.nom[Object.keys(membres.nom)[i]].rankTFT + " " + membres.nom[Object.keys(membres.nom)[i]].tierTFT + '\xa0\xa0\xa0\xa0' + `${(membres.nom[Object.keys(membres.nom)[i]].LPTFT).toString()}` + ' LP\n';
      var embedTFT = new EmbedBuilder()
            .setAuthor({ name: 'Classement TFT', iconURL: 'https://play-lh.googleusercontent.com/QcFYcOUpV0OdTKzGlmKcGVPlH1eMOW97cXXkqZtPCuC-0WwCTInMVOan_Fywan89_l8', url: 'https://discord.js.org' })
            .setColor(0x51267)
            .addFields({ name: 'Top TFT', value: classement},
            )
          client.channels.cache.find(channel => channel.name === "classement").send({ embeds: [embedTFT] });
        } catch (err) {
          console.log(err);
        }*/

      //TFT 

      if (membres.nom[Object.keys(membres.nom)[i]].dernierMatchTFT !== matchIDTFT.data[0]) {
        membres.nom[Object.keys(membres.nom)[i]].dernierMatchTFT = matchIDTFT.data[0];
        //  console.log(LancementTFT)
        if (membres.nom[Object.keys(membres.nom)[i]].dernierMatchTFT !== undefined && LancementTFT === true) {

          for (var TFT = 0; TFT < gamesTFT.data.info.participants.length; TFT++) {

            if (gamesTFT.data.info.participants[TFT].puuid === ProfileTFT.data.puuid) {
              var resultTFT = gamesTFT.data.info.participants[TFT].placement;
              break;
            }

          }

          client.channels.cache.find(channel => channel.name === SalonResultat).send("Game TFT de : " + VNom);

          if (resultTFT === 1) {
            client.channels.cache.find(channel => channel.name === SalonResultat).send('SIUUUUU');
          }



          else if (resultTFT <= 4 && resultTFT > 1) {


            client.channels.cache.find(channel => channel.name === SalonResultat).send('crack');
          } else if (resultTFT > 4 && resultTFT < 8) {

            client.channels.cache.find(channel => channel.name === SalonResultat).send('fraude');
          } else if (resultTFT == 8) {

            client.channels.cache.find(channel => channel.name === SalonResultat).send('BAHAHAHHA LOOSER');
          }



        }
      }

    }
    console.log("OK CA MARCHE" + "TFT EST " + LancementTFT + "LOL EST " + Lancement)
    Lancement = true;
    LancementTFT = true;

  } catch (err) {
    console.log(err);
    console.log("  " + membres.nom[Object.keys(membres.nom)[i]].nom);
  }
}


//SAVE DERNIERE GAME




client.on("messageCreate", async message => {
  if (message.content.startsWith("!add")) {
    try {
      words = message.content.split(" ");
      var nom = words[1];

      //if words is < 2, then the user didn't specify a name
      if (words.length > 2) {
        for (var i = 2; i < words.length; i++) {
          nom += words[i];
        }
      } else if (words.length === 1) {
        message.channel.send({ content: "Tu veux que je add qui avec ca enculé" });
        return;
      }
      nom = nom.toLowerCase();
      nomTMP = nom;
      nom = encodeURI(nom)
      console.log(nom)
      console.log(nomTMP)
      console.log(message.author.id)
      for (var i = 0; i < Object.keys(membres.nom).length; i++) {
        if (membres.nom[Object.keys(membres.nom)[i]].IdDiscord === message.author.id && message.author.id !== "274236782189608974") {
          message.channel.send({ content: "1 compte max bg" });
          return;
        }
      }
      try {
        var Profiles = await axios.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + nom + '?api_key=' + riotApiKey);
      } catch (err) {
        console.log(err);
        message.channel.send({ content: "T'existe pas encule" });
        return;
      }
      var matchID = await axios.get('https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/' + Profiles.data.puuid + '/ids?start=0&count=20&api_key=' + riotApiKey);
      //console.log("OK");
      var ProfileTFT = await axios.get('https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-name/' + nom + '?api_key=' + riotApiKeyTFT);
      var matchIDTFT = await axios.get('https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/' + ProfileTFT.data.puuid + '/ids?start=0&count=20&api_key=' + riotApiKeyTFT);
      if (membres.nom[nom] === undefined) {
        membres.nom[nomTMP] = {
          nomDiscord: message.author.username,
          nom: nomTMP,
          nomcompte: nom,
          dernierMatch: matchID.data[0],
          dernierMatchTFT: matchIDTFT.data[0],
          rankLoL: "",
          tierLoL: "",
          LPLoL: "",
          rankTFT: "",
          tierTFT: "",
          LPTFT: "",
          PosClassement: 0,
          PosClassementTFT: 0,
          EmoteLoL: "",
          EmoteTFT: "",
          IdDiscord: message.author.id,
          NombresVictoires: 0,
          NombresDefaites: 0,
          NombreGames: 0,
          RatioLol: 0
        }

        fs.writeFile("./profile.json", JSON.stringify(membres), (err) => {
          if (err) console.error(err)
        });
        message.channel.send({ content: "Joueur ajouté" });

      } else {
        message.channel.send("Joueur déjà ajouté on ta volé ton compte mskn");
      }


    }
    catch (err) {
      console.log(err);
    }
  }





  if (message.content.startsWith("!remove")) {
    try {
      words = message.content.split(" ");

      var nom = words[1];

      //if words is < 2, then the user didn't specify a name
      if (words.length > 2) {
        for (var i = 2; i < words.length; i++) {
          nom += words[i];
        }
      } else if (words.length === 1) {
        message.channel.send({ content: "Tu veux que je remove qui avec ca enculé" });
        return;
      }
      nom = nom.toLowerCase();
      nomTMP = nom;
      nom = encodeURI(nom)
      console.log(nom)
      console.log(nomTMP)
      console.log(message.author.id)
      // remove the user from the json file

      if (membres.nom[nomTMP] !== undefined) {
        // check if the user is the one who added the player
        if (membres.nom[nomTMP].IdDiscord === message.author.id || message.author.id === "274236782189608974") {
          delete membres.nom[nomTMP];
          fs.writeFile("./profile.json", JSON.stringify(membres), (err) => {
            if (err) console.error(err)
          });
          message.channel.send({ content: "Joueur supprimé" });
        } else {
          message.channel.send({ content: "C pas toi" });
        }
      } else {
        message.channel.send({ content: "Joueur non trouvé" });
      }


    }
    catch (err) {
      console.log(err);
    }
  }







  if (message.content.startsWith("!tki")) {
    try {
      words = message.content.split(" ");
      var nom = words[1];
      var nomTrouvé = "";
      //if words is < 2, then the user didn't specify a name
      if (words.length > 2) {
        for (var i = 2; i < words.length; i++) {
          nom += words[i];
        }
      } else if (words.length === 1) {
        message.channel.send({ content: "Tu veux que je trouve qui avec ca enculé" });
        return;
      }
      if (nom.startsWith("<@")) {
        nom = nom.replace("<@", "");
        nom = nom.replace(">", "");
        nom = nom.replace("!", "");
        for (var i = 0; i < Object.keys(membres.nom).length; i++) {
          if (membres.nom[Object.keys(membres.nom)[i]].IdDiscord === nom) {
            nomTrouvé = Object.keys(membres.nom)[i];
            message.channel.send({ content: "C'est " + nomTrouvé });
            break;
         
        }
      }
      if  (nomTrouvé === ""){
        message.channel.send({ content: "Joueur non trouvé" });
      }
      }else{
      nom = nom.toLowerCase();
      nomTMP = nom;
      nom = encodeURI(nom)
      console.log(nom)
      console.log(nomTMP)
      console.log(message.author.id)
      // remove the user from the json file

      if (membres.nom[nomTMP] !== undefined) {

        message.channel.send({ content: "C'est " + "<@" + membres.nom[nomTMP].IdDiscord + ">" });
      } else {
        message.channel.send({ content: "Joueur non trouvé" });
      }

    }
    }
    catch (err) {
      console.log(err);
    }
  }





});






client.on("messageCreate", async message => {
  try {
    if (message.content.startsWith("!test") && message.author.id === "274236782189608974") {
      membres.nom[Object.keys(membres.nom)[1]];
    }
  } catch (err) {
    console.log(err);
  }
});










client.on("messageCreate", async message => {
  try {
    if (message.content.startsWith("!reset")) {
      if (message.author.id === "274236782189608974") {
        HallOfFames.deleteLesMecsQuiExistentPlus();
        for (var i = 0; i < Object.keys(membres.nom).length; i++) {
          membres.nom[Object.keys(membres.nom)[i]] = {
            nomDiscord: membres.nom[Object.keys(membres.nom)[i]].nomDiscord,
            nom: membres.nom[Object.keys(membres.nom)[i]].nom,
            nomcompte: membres.nom[Object.keys(membres.nom)[i]].nomcompte,
            dernierMatch: membres.nom[Object.keys(membres.nom)[i]].dernierMatch,
            dernierMatchTFT: membres.nom[Object.keys(membres.nom)[i]].dernierMatchTFT,
            rankLoL: membres.nom[Object.keys(membres.nom)[i]].rankLoL,
            tierLoL: membres.nom[Object.keys(membres.nom)[i]].tierLoL,
            LPLoL: membres.nom[Object.keys(membres.nom)[i]].LPLoL,
            rankTFT: membres.nom[Object.keys(membres.nom)[i]].rankTFT,
            tierTFT: membres.nom[Object.keys(membres.nom)[i]].tierTFT,
            LPTFT: membres.nom[Object.keys(membres.nom)[i]].LPTFT,
            rankLoLChiffre: membres.nom[Object.keys(membres.nom)[i]].rankLoLChiffre,
            PosClassement: membres.nom[Object.keys(membres.nom)[i]].PosClassement,
            PosClassementTFT: membres.nom[Object.keys(membres.nom)[i]].PosClassementTFT,
            EmoteLoL: membres.nom[Object.keys(membres.nom)[i]].EmoteLoL,
            EmoteTFT: membres.nom[Object.keys(membres.nom)[i]].EmoteTFT,
            IdDiscord: membres.nom[Object.keys(membres.nom)[i]].IdDiscord,
            NombresVictoires: membres.nom[Object.keys(membres.nom)[i]].NombresVictoires,
            NombresDefaites: membres.nom[Object.keys(membres.nom)[i]].NombresDefaites,
            NombreGames: membres.nom[Object.keys(membres.nom)[i]].NombreGames,
            RatioLol: membres.nom[Object.keys(membres.nom)[i]].RatioLol
          }
          fs.writeFile("./profile.json", JSON.stringify(membres), (err) => {
            if (err) console.error(err)
          });
        }
      
      message.channel.send({ content: "c carré" });
      }
    else {
      message.channel.send({ content: "T pas le goat lache ca gamin" });
    }
  }
  } catch (err) {
    console.log(err);
  }

});


client.on("messageCreate", async (message) => {

  if (message.content.startsWith("!ratio")) {
    try {
      words = message.content.split(" ");
      var nom = words[1];

      //if words is < 2, then the user didn't specify a name
      if (words.length > 2) {
        for (var i = 2; i < words.length; i++) {
          nom += words[i];
        }
      } else if (words.length === 1) {
        message.channel.send({ content: "Tu veux que je ratio qui avec ca enculé" });
        return;
      }

      // get the id of the user when name is with his @
      console.log(nom)
      if (nom.startsWith("<@")) {
        nom = nom.replace("<@", "");
        nom = nom.replace(">", "");
        nom = nom.replace("!", "");
      }
      console.log(nom)
      for (var i = 0; i < Object.keys(membres.nom).length; i++) {
        if (membres.nom[Object.keys(membres.nom)[i]].IdDiscord === nom) {
          if (membres.nom[Object.keys(membres.nom)[i]].NombresGames === 0) {
            message.channel.send("Ta pas de games cette semaine");
            return;
          } else if (membres.nom[Object.keys(membres.nom)[i]].NombresVictoires === 0) {
            message.channel.send("BAHAHA NUL 0 WIN");
            return;
          } else {
            var ratio = (membres.nom[Object.keys(membres.nom)[i]].NombresVictoires / membres.nom[Object.keys(membres.nom)[i]].NombresGames) * 100;
            membres.nom[Object.keys(membres.nom)[i]].RatioLol = ratio.toFixed(2);
            message.channel.send({ content: "Le ratio de " + membres.nom[Object.keys(membres.nom)[i]].nom + " est de " + membres.nom[Object.keys(membres.nom)[i]].RatioLol + "%" });
            return;
          }
        }
      }
      message.channel.send({ content: "Joueur non trouvé" });




    } catch (e) {
      console.log(e);
    }
  }
});

// put a custom emoji on the nicknames of people on the server

client.on("messageCreate", async (message) => {
  if (message.content == "*verify check") {
    message.member.setNickname(message.content.replace('changeNick ', ''));
    message.react(`✅`);
  }
});

//1er bot
client.login(keyDiscord);
//client.login(keyDiscordbotsecondaire);
client.on('ready', () => {
  console.log(`It's welcome time`);
  classementJS.Bestplayer();
  client.user.setActivity("League of Legends", { type: "PLAYING" });
  //HallOfFames.deleteLesMecsQuiExistentPlus();
  setTimeout(() => {
    messageLoose();
  }
    , 2000);



  setInterval(() => {
    messageLoose();
  }, 3600000);
  setTimeout(() => {
    classementJS.Bestplayer();
  }
    , 3600000);
  setInterval(() => {
    classementJS.Bestplayer();
  }, 216000000);

  //43200000










});