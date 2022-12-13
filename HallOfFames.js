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
const riotApiKey = ('RGAPI-d7d2ccdd-3ac1-48c9-9a2b-d1bea7cc3bb1');
const riotApiKeyTFT = ('RGAPI-9be7583c-f892-48c2-9401-15eb37720010');
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









client.login('OTg1MzI5OTU2MDYwMDEyNTU0.GfQPCs.uMMnBVIQ3L9pPS9V07370jc5uge7map5OBunIo');
