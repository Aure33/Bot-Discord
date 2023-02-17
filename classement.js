const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,]
});
const axios = require('axios');
var KeyRequise = require('../key');
var HallOfFames = require('./HallOfFames');
const riotApiKey = (KeyRequise.riotApiKey);
const riotApiKeyTFT = (KeyRequise.riotApiKeyTFT);
const keyDiscord = (KeyRequise.keyDiscord);
const keyDiscordbotsecondaire = (KeyRequise.keyDiscordbotsecondaire);
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');


// const challenger = "<:challenger:1022113918107258891>";
// const grandmaster = "<:grandmaster:1022113905927004160>";
// const master = "<:master:1022113893297946634>";
// const diamond = "<:diamond:1022113868945821767>";
// const platine = "<:platinum:1022113842697863290>";
// const gold = "<:gold:1022113805683134545>";
// const silver = "<:silver:1022113818165383238>";
// const bronze = "<:bronze:1022113788067053568>";
// const iron = "<:iron:1022113772300677150>";
// const Unranked = "1023574302567714906";

const rankJEU = ["CHALLENGER", "GRANDMASTER", "MASTER", "DIAMOND", "PLATINUM", "GOLD", "SILVER", "BRONZE", "IRON", ""];
const tierJEU = ["I", "II", "III", "IV"];
const Emote = ["<:challenger:1022113918107258891>", "<:grandmaster:1022113905927004160>", "<:master:1022113893297946634>", "<:diamond:1022113868945821767>", "<:platinum:1022113842697863290>", "<:gold:1022113805683134545>", "<:silver:1022113818165383238>", "<:bronze:1022113788067053568>", "<:iron:1022113772300677150>", ""];

var membres = require('./profile.json');

module.exports.Bestplayer = Bestplayer;
var pos
var posTFT

async function Bestplayer()  {
  try {
    for (var i = 0; i < Object.keys(membres.nom).length; i++) {
      var nomcompte = membres.nom[Object.keys(membres.nom)[i]].nomcompte;
      var Profiles = await axios.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + nomcompte + '?api_key=' + riotApiKey);
      var Ranked = await axios.get('https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + Profiles.data.id + '?api_key=' + riotApiKey);
      var ProfileTFT = await axios.get('https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-name/' + nomcompte + '?api_key=' + riotApiKeyTFT);
      var RankedTFT = await axios.get('https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/' + ProfileTFT.data.id + '?api_key=' + riotApiKeyTFT);


      for (var y = 0; y < Ranked.data.length; y++) {
        if (Ranked.data[y].queueType === 'RANKED_SOLO_5x5') {
          membres.nom[Object.keys(membres.nom)[i]].rankLoL = Ranked.data[y].tier;
          membres.nom[Object.keys(membres.nom)[i]].tierLoL = Ranked.data[y].rank;
          membres.nom[Object.keys(membres.nom)[i]].LPLoL = Ranked.data[y].leaguePoints;
          break;
        }
        else {
          membres.nom[Object.keys(membres.nom)[i]].rankLoL = "Unranked";
          membres.nom[Object.keys(membres.nom)[i]].tierLoL = "Unranked";
          membres.nom[Object.keys(membres.nom)[i]].LPLoL = "Unranked";
        }
      }



      for (var y = 0; y < RankedTFT.data.length; y++) {
        if (RankedTFT.data[y].queueType === 'RANKED_TFT') {
          membres.nom[Object.keys(membres.nom)[i]].rankTFT = RankedTFT.data[y].tier;
          membres.nom[Object.keys(membres.nom)[i]].tierTFT = RankedTFT.data[y].rank;
          membres.nom[Object.keys(membres.nom)[i]].LPTFT = RankedTFT.data[y].leaguePoints;
          break;
        }
        else {
          membres.nom[Object.keys(membres.nom)[i]].rankTFT = "Unranked";
          membres.nom[Object.keys(membres.nom)[i]].tierTFT = "Unranked";
          membres.nom[Object.keys(membres.nom)[i]].LPTFT = "Unranked";

        }
      }
      console.log(i + "e personne");
    }

  } catch (err) {
    console.log(err);
  }


  //reset PosClassemment
  for (var i = 0; i < Object.keys(membres.nom).length; i++) {
    membres.nom[Object.keys(membres.nom)[i]].PosClassement = 0;
    membres.nom[Object.keys(membres.nom)[i]].PosClassementTFT = 0;

  }

  tour = 1;

  pos = 1;
  classementTAMERE();

  await new Promise(r => setTimeout(r, 2000));
  posTFT = 1;
  classementTAMERETFT();




}

let classementTAMERE = async () => {
  try {
    for (var i = 0; i < 8; i++) {
      for (var y = 0; y < 4; y++) {
        var rankJEULOL = rankJEU[i];
        var tierJEULOL = tierJEU[y];
        classementLOL(rankJEULOL, tierJEULOL);
        await new Promise(r => setTimeout(r, 500));

      }
      console.log(tour + " tour LOL");
    }

    let classement = '';
    for (var y = 1; y < Object.keys(membres.nom).length + 1; y++) {
      for (var i = 0; i < Object.keys(membres.nom).length; i++) {
        if (membres.nom[Object.keys(membres.nom)[i]].PosClassement === y) {
          console.log(membres.nom[Object.keys(membres.nom)[i]].nom + " est en " + y + "e position");
          MajJoueurEmote(membres.nom[Object.keys(membres.nom)[i]], "LoL")
          classement += `\`${y}\` ${membres.nom[Object.keys(membres.nom)[i]].nom}` + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + membres.nom[Object.keys(membres.nom)[i]].EmoteLoL + " " + membres.nom[Object.keys(membres.nom)[i]].rankLoL + " " + membres.nom[Object.keys(membres.nom)[i]].tierLoL + '\xa0\xa0\xa0\xa0' + `${(membres.nom[Object.keys(membres.nom)[i]].LPLoL).toString()}` + ' LP\n';
        }
      }
    }

    var embedLOL = new EmbedBuilder()
      .setAuthor({ name: 'Classement LoL', iconURL: 'https://logo-marque.com/wp-content/uploads/2020/11/League-of-Legends-Embleme.png', url: 'https://discord.js.org' })
      .setColor(0x51267)
      .addFields({ name: 'Top LOL', value: classement },)

    client.channels.cache.find(channel => channel.id === "1052959001186406420").send({ embeds: [embedLOL] });

  } catch (err) {
    console.log(err);
  }
}


let classementLOL = async (rank, tier) => {
  try {
    var maxLP = 0;
    var currentLP = 0;
    var maxLPpos = -1;
    for (var i = 0; i < Object.keys(membres.nom).length; i++) {
      if ((membres.nom[Object.keys(membres.nom)[i]].PosClassement === 0 && membres.nom[Object.keys(membres.nom)[i]].rankLoL === rank)) {
        if (membres.nom[Object.keys(membres.nom)[i]].tierLoL === tier) {
          currentLP = membres.nom[Object.keys(membres.nom)[i]].LPLoL;
          if (currentLP >= maxLP) {
            maxLP = currentLP;
            maxLPpos = i;
          }
        }
      }
    }
    if (maxLPpos !== -1) {
      membres.nom[Object.keys(membres.nom)[maxLPpos]].PosClassement = pos;
      console.log("pos LOL : " + pos + " " + membres.nom[Object.keys(membres.nom)[maxLPpos]].nom + " " + membres.nom[Object.keys(membres.nom)[maxLPpos]].rankLoL + " " + membres.nom[Object.keys(membres.nom)[maxLPpos]].tierLoL + " " + membres.nom[Object.keys(membres.nom)[maxLPpos]].LPLoL);
      pos++;
    }

    for (var i = 0; i < Object.keys(membres.nom).length; i++) {
      if (membres.nom[Object.keys(membres.nom)[i]].rankLoL === rank) {
        if (membres.nom[Object.keys(membres.nom)[i]].tierLoL === tier) {
          if (membres.nom[Object.keys(membres.nom)[i]].PosClassement === 0) {
            classementLOL(rank, tier);
            console.log("RESET");
            break;
          }
        }
      }
    }

  } catch (err) {
    console.log(err);
  }
}

//TFT 

let classementTAMERETFT = async () => {
  try {
    for (var i = 0; i < 8; i++) {
      for (var y = 0; y < 4; y++) {
        var rankJEUTFT = rankJEU[i];
        var tierJEUTFT = tierJEU[y];
        classementTFT(rankJEUTFT, tierJEUTFT);
        await new Promise(r => setTimeout(r, 500));
      }
      console.log(tour + " tour TFT");

    }

    let classementtft = "";
    for (var y = 1; y < Object.keys(membres.nom).length + 1; y++) {
      for (var i = 0; i < Object.keys(membres.nom).length; i++) {
        if (membres.nom[Object.keys(membres.nom)[i]].PosClassementTFT === y) {
          console.log(membres.nom[Object.keys(membres.nom)[i]].nom + " est en " + y + "e position");
          MajJoueurEmote(membres.nom[Object.keys(membres.nom)[i]], "TFT")
          classementtft += `\`${y}\` ${membres.nom[Object.keys(membres.nom)[i]].nom}` + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + membres.nom[Object.keys(membres.nom)[i]].EmoteTFT + " " + membres.nom[Object.keys(membres.nom)[i]].rankTFT + " " + membres.nom[Object.keys(membres.nom)[i]].tierTFT + '\xa0\xa0\xa0\xa0' + `${(membres.nom[Object.keys(membres.nom)[i]].LPTFT).toString()}` + ' LP\n';
        }
      }
    }
    var embedTFT = new EmbedBuilder()
      .setAuthor({ name: 'Classement TFT', iconURL: 'https://play-lh.googleusercontent.com/QcFYcOUpV0OdTKzGlmKcGVPlH1eMOW97cXXkqZtPCuC-0WwCTInMVOan_Fywan89_l8', url: 'https://discord.js.org' })
      .setColor(0x51267)
      .addFields({ name: 'Top TFT', value: classementtft },)
    client.channels.cache.find(channel => channel.id === "1052959001186406420").send({ embeds: [embedTFT] });
  } catch (err) {
    console.log(err);
  }
}

let classementTFT = async (rank, tier) => {
  try {
    var maxLP = 0;
    var currentLP = 0;
    var maxLPpos = -1;
    for (var i = 0; i < Object.keys(membres.nom).length; i++) {
      if ((membres.nom[Object.keys(membres.nom)[i]].PosClassementTFT === 0 && membres.nom[Object.keys(membres.nom)[i]].rankTFT === rank)) {
        if (membres.nom[Object.keys(membres.nom)[i]].tierTFT === tier) {
          currentLP = membres.nom[Object.keys(membres.nom)[i]].LPTFT;
          if (currentLP >= maxLP) {
            maxLP = currentLP;
            maxLPpos = i;
          }
        }
      }
    }
    if (maxLPpos !== -1) {
      membres.nom[Object.keys(membres.nom)[maxLPpos]].PosClassementTFT = posTFT;
      console.log("pos TFT : " + posTFT + " " + membres.nom[Object.keys(membres.nom)[maxLPpos]].nom + " " + membres.nom[Object.keys(membres.nom)[maxLPpos]].rankTFT + " " + membres.nom[Object.keys(membres.nom)[maxLPpos]].tierTFT + " " + membres.nom[Object.keys(membres.nom)[maxLPpos]].LPTFT);
      posTFT++;
    }

    for (var i = 0; i < Object.keys(membres.nom).length; i++) {
      if (membres.nom[Object.keys(membres.nom)[i]].rankTFT === rank) {
        if (membres.nom[Object.keys(membres.nom)[i]].tierTFT === tier) {
          if (membres.nom[Object.keys(membres.nom)[i]].PosClassementTFT === 0) {
            classementTFT(rank, tier);
            console.log("RESET");
            break;
          }
        }
      }
    }

  } catch (err) {
    console.log(err);
  }
}

let MajJoueurEmote = async (Joueur, Jeu) => {
  try {
    for (var i = 0; i < 8; i++) {
      var rankJEUEmote = rankJEU[i];
      var EmoteJEU = Emote[i];
      if (Joueur.rankLoL === rankJEUEmote && Jeu === "LoL") {
        Joueur.EmoteLoL = EmoteJEU;
      } else if (Joueur.rankTFT === rankJEUEmote && Jeu === "TFT") {
        Joueur.EmoteTFT = EmoteJEU;
      }
    }
  } catch (error) {
    console.error(error);
  }
}






client.login(keyDiscord);
