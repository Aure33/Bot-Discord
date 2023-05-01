const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
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
var Chess = require('./chess/index.js')
var tbm = require('./tbm')
const jsonFile = './ProfileTBM.json';

//var ratio = require('./HallOfFames')
const fs = require('fs');
var Lancement = false;
var LancementTFT = false;
var membres = require('./profile.json');
var membresChess = require('./profileChess.json');
// var membresChess = require('./profileChess.json');
const challenger = "<:challenger:1022113918107258891>";
const bestEmoji = "<:best:1102666837856100493>";
const rapidEmoji = "<:rapid:1102662974134554666>";
const blitzEmoji = "<:blitz:1102663008443965460>";
const bulletEmoji = "<:bullet:1102663024411688980>";
const puzzleEmoji = "<:puzzle:1102662991331213364>";


var KeyRequise = require('../key');
const riotApiKey = (KeyRequise.riotApiKey);
const riotApiKeyTFT = (KeyRequise.riotApiKeyTFT);
const keyDiscord = (KeyRequise.keyDiscord);
const keyDiscordbotsecondaire = (KeyRequise.keyDiscordbotsecondaire);
var nbPersonnesFile = 0;

client.on("messageCreate", async (message) => {
  try {
    if (message.content.startsWith("!tbm")) {
      const args = message.content.split(" ");
      if (args.length < 3 && args[1] !== "help" && args[1] !== "show" && args[1] !== "stop" && args[1] !== "add" && args[1] !== "remove" && args[1] !== "list") {
        message.channel.send("ta mal ecris cousin: !tbm help pour plus d'info");
        return;
      } else if (args[1] === "help") {
        const exampleEmbed = {
          color: 0x0099ff,
          title: 'Liste Commande',
          url: "https://www.youtube.com/watch?v=fahfM6HY7q4",

          author: {
            name: "Commande TBM",
            icon_url: 'https://pbs.twimg.com/profile_images/1588007055/IMG_0956_3_400x400.jpg',
            url: 'https://www.youtube.com/watch?v=fahfM6HY7q4',
          },
          thumbnail: {
            url: 'https://pbs.twimg.com/profile_images/1588007055/IMG_0956_3_400x400.jpg',
          },
          fields: [
            {
              name: "!tbm + nomArret/numArret + numeroLigne",

              value: 'Affiche le prochain Bus',
            },
            {
              name: "!tbm stop + nomArret/numArret",

              value: 'Affiche la liste des bus qui passent à l\'arrêt',
            },
            {
              name: "!tbm show + nomArret/numArret",

              value: 'Affiche la liste des arrets ressemblant à la recherche',
            },
            {
              name: "!tbm add + numArret + numeroLigne",

              value: 'Ajoute un arret,numéro de ligne à la liste de favoris',
            },
            {
              name: "!mytbm",

              value: 'Affiche ta liste de favoris',
            }
          ],

          timestamp: new Date(),
          footer: {
            text: 'Requested by ' + message.author.username,
          },
        };

        message.channel.send({ embeds: [exampleEmbed] });
        return;
      } else if (args[1] === "show") {
        let arret = args.slice(2).join(" ");
        if (arret.length < 3) {
          message.channel.send("tu veux bz le serv toi");
          return;
        }
        arret = arret.toLowerCase();
        const listeStop = await tbm.listeArrets(arret);
        const { listBus, stopName } = listeStop;
        if (listBus.length === 0) {
          message.channel.send("Aucun arrêt ressemblant à " + arret);
          return;
        }
        message.channel.send("Liste des arrêts ressemblant à " + stopName + " : " + listBus);
        return;



      } else if (args[1] === "stop") {
        let id = args.slice(2).join(" ");
        const AllBus = await tbm.BusPourArret(id);
        const { listBus, stopName } = AllBus;
        if (listBus.length === 0) {
          message.channel.send("Aucun bus passe à cet arrêt");
          return;
        } else {
          message.channel.send("Liste des bus de l'arrêt " + stopName + " : " + listBus);
        }
      }
      else if (args[1] === "add") {
        try {
          Arret = args.slice(2, -1).join(" ");
          ligne = args[args.length - 1];
          ligne = ligne.toString().padStart(2, '0');
          let existe = await tbm.tbmExiste(Arret, ligne);
          if (!existe) {
            console.log(await tbm.tbmExiste(Arret, ligne));
            message.channel.send("arret ou ligne inconnu");
            return;
          }
          tbm.addFavorite(message.author.username, Arret, ligne, message.author.id);
          message.channel.send("Favoris ajouté");
        } catch (e) {
          message.channel.send("Erreur");
        }
      }
      else if (args[1] === "remove") {
        try {
          Arret = args.slice(2, -1).join(" ");
          ligne = args[args.length - 1];
          ligne = ligne.toString().padStart(2, '0');
          let existe = await tbm.tbmExiste(Arret, ligne);
          if (!existe) {
            console.log(tbm.tbmExiste(Arret, ligne));
            message.channel.send("arret ou ligne inconnu");
            return;
          }
          tbm.removeFavorite(message.author.username, Arret, ligne, message.author.id);
          message.channel.send("Favoris supprimé");
        } catch (e) {
          message.channel.send("Erreur");
        }
      }
      else if (args[1] === "list") {
        tbm.listFavorites(message.author.id)
          .then((favorites) => {
            if (favorites.length === 0) {
              message.channel.send("Aucun favoris");
              console.log('Sent Aucun favoris');
              return;
            }
            message.channel.send("Liste de vos favoris : " + JSON.stringify(favorites));
            console.log('Sent Liste de vos favoris: ' + JSON.stringify(favorites));
          })
          .catch((error) => {
            console.error(error);
            message.channel.send("Erreur");
          });
      }
      else {
        const Name = args.slice(1, -1).join(" ");
        if (Name.length < 3) {
          message.channel.send("tu veux bz le serveur toi");
          return;
        }
        let lineId = args[args.length - 1];
        lineId = lineId.toString().padStart(2, '0');
        const waitTime = await tbm.getTBMLineWaitInterval(Name, lineId);
        const { HoraireBus1, stopId, stopList, stopName, destination_name } = waitTime;
        console.log(stopName);


        if (!waitTime) {
          if (stopList.length === 0) {
            message.channel.send(`L'arrêt ${stopName} n'existe pas.`);
            return;
          }
          message.channel.send(`L'arrêt ${stopName} n'existe pas. Voici la liste des arrêts possibles: ${stopList}`);
          return;
        }

        if (stopId === -1) {
          if (stopList.length === 0) {
            message.channel.send(`L'arrêt ${stopName} n'existee pas.`);
            return;
          }
          message.channel.send(`L'arrêt ${stopName} n'existee pas. Voici la liste des arrêts possibles: ${stopList}`);
          return;
        }
        if (waitTime === -1) {
          message.channel.send(`Aucun résultat à l'heure actuelle pour l'arrêt ${stopName} et la ligne ${lineId}`);
          return;
        }
        console.log(waitTime);

        message.channel.send(`${HoraireBus1} minutes d'attente pour le bus de la ligne ${lineId} à l'arrêt ${stopName} en direction de ${destination_name}`);
        console.log(stopId);
      }
    }
  } catch (e) {
    console.log(e);
  }


  if (message.content.startsWith("!mytbm")) {
    try {
      idDiscord = message.author.id;
      fs.readFile(jsonFile, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const jsonData = JSON.parse(data);
        const user = jsonData.users.find(user => user.discordId === idDiscord);
        if (!user) {
          message.channel.send(`Tu n'as pas encore de favoris. Utilise la commande !tbm add pour en ajouter un`);
          return;
        }
        for (const favorite of user.favorites) {
          const arret = favorite.arret;
          const ligne = favorite.ligne;
          const arretName = favorite.arretName;
          tbm.getTBMLineWaitInterval(arret, ligne).then(result => {
            message.channel.send(`${result.stopName}, Ligne: ${ligne}, Destination: ${result.destination_name}, dans : ${result.HoraireBus1}`);
          }).catch(error => {
            message.channel.send(`Jcrois ya plus de bus pour ${arretName} ligne ${ligne}`);
          });
        }
      });

    }
    catch (e) {
      console.log(e);
    }
  }



  if (message.content.startsWith("!profilelol")) {
    try {
      words = message.content.split(" ");
      var names = words[1];

      //if words is < 2, then the user didn't specify a name
      if (words.length > 2) {
        for (var i = 2; i < words.length; i++) {
          names += words[i];
        }
      } else if (words.length === 1) {
        message.channel.send({ content: "Tu veux que je regarde le profile de qui avec ca enculé" });
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
      words = message.content.split(" ");
      var names = words[1];

      //if words is < 2, then the user didn't specify a name
      if (words.length > 2) {
        for (var i = 2; i < words.length; i++) {
          names += words[i];
        }
      } else if (words.length === 1) {
        message.channel.send({ content: "Tu veux que je regarde le profile de qui avec ca enculé" });
        return;
      }
      names = names.toLowerCase();
      nomTMP = names;
      names = encodeURI(names)
      console.log(names)
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



client.on("messageCreate", async message => {
  if (message.content.startsWith("!mytopmastery")) {
    try {
      for (var i = 0; i < Object.keys(membres.nom).length; i++) {
        if (membres.nom[Object.keys(membres.nom)[i]].IdDiscord === message.author.id) {
          var names = membres.nom[Object.keys(membres.nom)[i]].nomcompte;
        }
      }
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
            name: "!profilelol + nomJoueur",

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
          {
            name: "!tbm help",

            value: 'Affiche les commandes pour tbm',
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
      words = message.content.split(" ");
      var names = words[1];

      //if words is < 2, then the user didn't specify a name
      if (words.length > 2) {
        for (var i = 2; i < words.length; i++) {
          names += words[i];
        }
      } else if (words.length === 1) {
        message.channel.send({ content: "Tu veux que je regarde le profile de qui avec ca enculé" });
        return;
      }
      names = names.toLowerCase();
      nomTMP = names;
      names = encodeURI(names)
      console.log(names)
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

let TristanLodeur = async () => {
  try {
    var SalonResultat = 'general'; 7
    var idsalon = '1031954505635479653';
    var nomcompte = 'zenoobhia';
    var VNom = 'zenoobhia';
    var ProfileTFT = await axios.get('https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-name/' + nomcompte + '?api_key=' + riotApiKeyTFT);
    var matchIDTFT = await axios.get('https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/' + ProfileTFT.data.puuid + '/ids?start=0&count=20&api_key=' + riotApiKeyTFT);
    var numDripStand;
    for (var i = 0; i < Object.keys(membres.nom).length; i++) {
      if (Object.keys(membres.nom)[i] === nomcompte) {
        numDripStand = i;
        break;
      }
    }
    if (membres.nom[Object.keys(membres.nom)[numDripStand]].dernierMatchTFT !== matchIDTFT.data[0]) {
      membres.nom[Object.keys(membres.nom)[numDripStand]].dernierMatchTFT = matchIDTFT.data[0];
      if (membres.nom[Object.keys(membres.nom)[numDripStand]].dernierMatchTFT !== undefined && LancementTFT) {
        client.channels.cache.find(channel => channel.id === idsalon).send("@everyone BAHAHAH <@224250814581964800> le gros puant a lancé une game alors qu'il est a Copenhague ");
      }
    }
    LancementTFT = true;
  }
  catch (err) {
    console.log(err);
  }
}

//create a function 
let messageLoose = async () => {
  try {
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
          membres.nom[Object.keys(membres.nom)[i]].NombresGames++;
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
    Lancement = true;
    LancementTFT = true;

  } catch (err) {
    console.log(" erreur sur " + membres.nom[Object.keys(membres.nom)[i]].nom);
  }
}



async function newRecordChess() {
  var idsalon = "1083056648052027523"
  try {
    //console.log("--------------MEMBRECHESS ----------------- ",membresChess);
    for (var i = 0; i < Object.keys(membresChess.nom).length; i++) {
      user = membresChess.nom[Object.keys(membresChess.nom)[i]];
      msg = await Chess.BestGame(user);
      if (msg[0] !== undefined) {
        client.channels.cache.find(channel => channel.id === idsalon).send(msg[0]);
        console.log("envoie");
      } if (msg[1] !== undefined) {
        client.channels.cache.find(channel => channel.id === idsalon).send(msg[1]);
        console.log("envoie");
      } if (msg[2] !== undefined) {
        client.channels.cache.find(channel => channel.id === idsalon).send(msg[2]);
        console.log("envoie");
      }
    }

  } catch (err) {
  }

}



client.on("messageCreate", async message => {

  // CHESS 

  if (message.content.startsWith("!profilechess")) {
    try {
      words = message.content.split(" ");
      var names = words[1];

      //if words is < 2, then the user didn't specify a name
      if (words.length > 2) {
        for (var i = 2; i < words.length; i++) {
          names += words[i];
        }
      } else if (words.length === 1) {
        message.channel.send({ content: "Tu veux que je regarde le profile de qui avec ca enculé" });
        return;
      }
      trueNames = names
      names = names.toLowerCase();
      try {
        var user = await Chess.getProfileChess(names);
      } catch (err) {
        message.channel.send({ content: "t qui enculé" });
        return;
      }
      try{
        var exampleEmbed = new EmbedBuilder()
          .setColor(0x0099FF)
          .setTitle(trueNames + " " + "[" + user.pays + "]")
          .setURL(user.url)
          .setAuthor({ name: 'Chess.com', iconURL: 'https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png', url: 'https://www.chess.com/' })
          .setThumbnail(user.avatar)
          .addFields(
            { name: 'Elo Rapid' + '\xa0\xa0\xa0\xa0\xa0' + 'Elo Blitz', value: ' ' ,inline: false},
            { name: ' ', value: rapidEmoji + (user.EloRapid).toString() + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + blitzEmoji + (user.EloBlitz).toString() ,inline: false},
            { name: ' ', value: bestEmoji + (user.recordRapid).toString() + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + bestEmoji + (user.recordBlitz).toString(), inline: false },

            { name: 'Elo Bullet' + '\xa0\xa0\xa0\xa0\xa0' + 'Elo Puzzle', value: ' ',inline: false },
            { name: ' ', value: bulletEmoji + (user.EloBullet).toString() + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + puzzleEmoji + (user.EloPuzzle).toString(),inline: false },
            { name: ' ', value: bestEmoji + (user.recordBullet).toString() + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + bestEmoji + (user.recordPuzzle).toString(), inline: false },

          )
          .addFields(
            { name: 'LastGame' + '\xa0\xa0\xa0\xa0\xa0' + user.urlgameLastGame, value: ' ' },
          )
          .setTimestamp()
          .setFooter({ text: 'Request by ' + message.author.username, iconURL: message.author.avatarURL() });
      } catch (err) {
        message.channel.send({ content: "t qui enculé" });
        return;
      }
      message.channel.send({ embeds: [exampleEmbed] });
    } catch (err) {
      console.log("error dehors embed",err);
      return;
    }
  }



  if (message.content.startsWith("!addchess")) {
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
      if (await Chess.addPlayerChess(nom, message.author.id)) {
        message.channel.send({ content: "C bon chef" });
      } else {
        message.channel.send({ content: "T'es déjà dedans'" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (message.content.startsWith("!removechess")) {
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
      if (await Chess.removePlayerChess(nom, message.author.id)) {
        message.channel.send({ content: "Tu as bien été enlevé" });
      } else {
        message.channel.send({ content: "Ce compte n'existe pas / tu n'es pas le proprio du compte" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (message.content.startsWith("!addlol")) {
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
          NombresGames: 0,
          RatioLol: 0,
          RatioTFT: 0,
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





  if (message.content.startsWith("!removelol")) {
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
        if (nomTrouvé === "") {
          message.channel.send({ content: "Joueur non trouvé" });
        }
      } else {
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
      words = message.content.split(" ");
      var nom = words[1];
      //if words is < 2, then the user didn't specify a name
      if (words.length > 2) {
        for (var i = 2; i < words.length; i++) {
          nom += words[i];
        }
      } else if (words.length === 1) {
        message.channel.send({ content: "Tu veux que je trouve qui avec ca enculé" });
        return;
      }
      console.log(membres.nom[nom]);
      message.channel.send((membres.nom[nom].NombresGames).toString() + " Games");
      message.channel.send((membres.nom[nom].NombresVictoires).toString() + " Victoires");
      message.channel.send((membres.nom[nom].NombresDefaites).toString() + " Defaites");

    }
  } catch (err) {
    console.log(err);
  }
});










client.on("messageCreate", async message => {
  try {
    if (message.content.startsWith("!reset")) {
      if (message.author.id === "274236782189608974") {
        //HallOfFames.deleteLesMecsQuiExistentPlus();
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
            NombresGames: membres.nom[Object.keys(membres.nom)[i]].NombresGames,
            RatioLol: membres.nom[Object.keys(membres.nom)[i]].RatioLol,
            RatioTFT: membres.nom[Object.keys(membres.nom)[i]].RatioTFT,
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


client.on("messageCreate", async message => {
  try {
    if (message.content.startsWith("!classementLOL")) {
      classementJS.Bestplayer();
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
      else {
        nom = nom.toLowerCase();
        nomTMP = nom;
        nom = encodeURI(nom)
        console.log(nom)
        console.log(nomTMP)
        console.log(message.author.id)
      }


      console.log(nom)
      for (var i = 0; i < Object.keys(membres.nom).length; i++) {
        if (membres.nom[Object.keys(membres.nom)[i]].IdDiscord === nom || membres.nom[Object.keys(membres.nom)[i]].nomcompte === nom) {
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

client.on("messageCreate", async (message) => {
  words = message.content.split(" ");
  var nom = words[1];
  var nomTMP = nom;
  if (message.content.startsWith("t mort") && message.author.id === "985329956060012554") {
    message.channel.send("t mort" + nomTMP);
  }
  if (message.content.startsWith("!harcelement")) {
    try {
      words = message.content.split(" ");
      var nom = words[1];
      var nomTMP = nom;
      if (nom.startsWith("<@")) {
        nom = nom.replace("<@", "");
        nom = nom.replace(">", "");
        nom = nom.replace("!", "");
      }
      message.channel.send({ content: "Tu veux que je le harcèle ?" });
      const filter = m => m.author.id === message.author.id;
      const collector = message.channel.createMessageCollector({ filter, time: 10000 });
      collector.on('collect', m => {
        if (m.content === 'oui') {
          message.channel.send("t mort" + nomTMP);
        } else if (m.content === 'non') {
          message.channel.send({ content: "Ok je te laisse tranquille" });
          collector.stop();
        } else {
          message.channel.send({ content: "Réponds par oui ou par non" });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
});

let getNbJoueur = () => {
  return Object.keys(membres.nom).length;
}

let MajActivite = () => {
  client.user.setPresence({
    activities: [{ name: `${getNbJoueur()} joueurs !`, type: ActivityType.Watching }],
    status: 'online',
  });
}

//1er bot
client.login(keyDiscord);
//client.login(keyDiscordbotsecondaire);
client.on('ready', () => {
  console.log(`It's welcome time`);
  setInterval(() => {
    MajActivite();
    newRecordChess();
    TristanLodeur();
  }, 20000);

  /* setTimeout(() => {
     messageLoose();
   }
     , 2000);
 
   setInterval(() => {
     messageLoose();
   }, 30000);
   setInterval(() => {
     classementJS.Bestplayer();
   }, 216000000);
 
   //43200000
 
 
 
 
 
 
 
 
 */

});