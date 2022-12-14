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

async function HallOfFames() {
    try{
        await MeilleurWinRate();
    } catch (error) {
        console.error(error);
    }
}


let PireWinRate = async () => {
    try{

    } catch (error) {
        console.error(error);
    }
}


let MeilleurWinRate = async () => {
    try{

    } catch (error) {
        console.error(error);
    }
}


let PireRatio = async () => {
    try{

    } catch (error) {
        console.error(error);
    }
}

let MeilleurRatio = async () => {
    try{

    } catch (error) {
        console.error(error);
    }
}


client.login(keyDiscord);
