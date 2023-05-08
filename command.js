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

const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
var classementJS = require('./classement')
var HallOfFames = require('./HallOfFames')
var Chess = require('./chess/Chessindex.js')
var tbm = require('./tbm')
const jsonFile = './ProfileTBM.json';

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

let getNbJoueur = () => {
  return Object.keys(membres.nom).length;
}


client.on("interactionCreate", async (message) => {

  if (!message.isCommand()) return;

  if (message.commandName === "help") {
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
          text: 'Requested by ' + message.user.username,
        },
      };

      message.reply({ embeds: [exampleEmbed] });
    }
    catch (err) {
      console.log(err);
    }
  }

  if (message.commandName === "ratio") {
    try {
      var nom = message.options.getString('nom');

      // get the id of the user when name is with his @
      console.log(nom)
      if (nom.startsWith("<@")) {
        console.log("0")
        nomTMP = nom;
        nom = nom.replace("<@", "");
        nom = nom.replace(">", "");
        nom = nom.replace("!", "");
      }
      else {
        nom = nom.toLowerCase();
        nomTMP = nom;
        nom = encodeURI(nom)
      }
      for (var i = 0; i < Object.keys(membres.nom).length; i++) {
        if (membres.nom[Object.keys(membres.nom)[i]].IdDiscord === nom || membres.nom[Object.keys(membres.nom)[i]].nomcompte === nom) {
          if (membres.nom[Object.keys(membres.nom)[i]].NombresGames === 0) {
            message.reply(nomTMP + " n'a pas de games cette semaine");
            return;
          } else if (membres.nom[Object.keys(membres.nom)[i]].NombresVictoires === 0) {
            message.reply("BAHAHA NUL 0 WIN");
            return;
          } else {
            var ratio = (membres.nom[Object.keys(membres.nom)[i]].NombresVictoires / membres.nom[Object.keys(membres.nom)[i]].NombresGames) * 100;
            membres.nom[Object.keys(membres.nom)[i]].RatioLol = ratio.toFixed(2);
            message.reply({ content: "Le ratio de " + nomTMP + " est de " + membres.nom[Object.keys(membres.nom)[i]].RatioLol + "%" });
            return;
          }
        }
      }
      message.reply({ content: "Joueur non trouvé" });
    } catch (e) {
      console.log(e);
    }
  }

  if (message.commandName === "profilechess") {
    const pseudo = message.options.getString('nom');
    trueNames = pseudo
    names = pseudo.toLowerCase();
    try {
      var user = await Chess.getProfileChess(names);
    } catch (err) {
      message.reply({ content: "t qui enculé" });
      return;
    }
    try {
      var exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(trueNames + " " + "[" + user.pays + "]")
        .setURL(user.url)
        .setAuthor({ name: 'Chess.com', iconURL: 'https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png', url: 'https://www.chess.com/' })
        .setThumbnail(user.avatar)
        .addFields(
          { name: 'Elo Rapid' + '\xa0\xa0' + 'Elo Blitz', value: ' ', inline: false },
          { name: ' ', value: rapidEmoji + (user.EloRapid).toString() + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + blitzEmoji + (user.EloBlitz).toString(), inline: false },
          { name: ' ', value: bestEmoji + (user.recordRapid).toString() + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + bestEmoji + (user.recordBlitz).toString(), inline: false },

          { name: 'Elo Bullet' + '\xa0\xa0' + 'Elo Puzzle', value: ' ', inline: false },
          { name: ' ', value: bulletEmoji + (user.EloBullet).toString() + '\xa0\xa0\xa0\xa0\xa0\xa0' + puzzleEmoji + (user.EloPuzzle).toString(), inline: false },
          { name: ' ', value: bestEmoji + (user.recordBullet).toString() + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + bestEmoji + (user.recordPuzzle).toString(), inline: false },

        )
        .addFields(
          { name: 'LastGame' + '\xa0\xa0\xa0\xa0\xa0' + user.urlgameLastGame, value: ' ' },
        )
        .setTimestamp()
        .setFooter({ text: 'Request by ' + message.user.username, iconURL: message.user.avatarURL() });
    } catch (err) {
      console.log("error dehors embed", err);
      return;
    }
    message.reply({ embeds: [exampleEmbed] });
  }

});

//1er bot
client.login(keyDiscord);
//client.login(keyDiscordbotsecondaire);
client.on('ready', async () => {
console.log("bot connecté");
  await client.application.commands.set([
    {
      name: "ratio",
      description: "Affiche le ratio d'un joueur",
      options: [
        {
          name: "nom",
          description: "Nom du joueur",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "help",
      description: "Affiche les commandes",
    },
    {
      name: "profilechess",
      description: "Affiche profile chess.com d'un joueur",
      options: [
        {
          name: "nom",
          description: "Nom du joueur",
          type: 3,
          required: true,
        },
      ],
    },
  ]);


});