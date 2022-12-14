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
const riotApiKey = (KeyRequise.riotApiKey);
const riotApiKeyTFT = (KeyRequise.riotApiKeyTFT);
const keyDiscord = (KeyRequise.keyDiscord);
const keyDiscordbotsecondaire = (KeyRequise.keyDiscordbotsecondaire);
const { EmbedBuilder } = require('discord.js');
var membres = require('./profile.json');

module.exports.HallOfFames = HallOfFames;
module.exports.MajJoueurRatio = MajJoueurRatio;
module.exports.MajJoueurEmote = MajJoueurEmote;
//module.exports.MajJoueurElo = MajJoueurElo;
module.exports.PireWinRate = PireWinRate;
module.exports.MeilleurWinRate = MeilleurWinRate;
module.exports.PireRatio = PireRatio;
module.exports.MeilleurRatio = MeilleurRatio;






async function HallOfFames() {
    try {
        await MeilleurWinRate();
    } catch (error) {
        console.error(error);
    }
}


async function MajJoueurRatio(Joueur){
    try {

        var ratio = (Joueur.NombresVictoires / Joueur.NombreGames) * 100;
        Joueur.RatioLol = ratio.toFixed(2);

    } catch (error) {
        console.error(error);
    }
}

async function MajJoueurEmote(Joueur){
    try {

        

    } catch (error) {
        console.error(error);
    }
}

// let MajJoueurElo = async (joueur,typegame) => {
//     try{
//         joueur.rankLoL = Ranked.data[y].tier;
//         membres.nom[Object.keys(membres.nom)[i]].tierLoL = Ranked.data[typegame].rank;
//         membres.nom[Object.keys(membres.nom)[i]].LPLoL = Ranked.data[typegame].leaguePoints;
//     } catch (error) {
//         console.error(error);
//     }
// }


async function PireWinRate() {
    try {

    } catch (error) {
        console.error(error);
    }
}


async function MeilleurWinRate() {
    try {

    } catch (error) {
        console.error(error);
    }
}


async function PireRatio() {
    try {

    } catch (error) {
        console.error(error);
    }
}

async function MeilleurRatio() {
    try {

    } catch (error) {
        console.error(error);
    }
}


client.login(keyDiscord);
