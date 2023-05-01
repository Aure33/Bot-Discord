const axios = require('axios');
const { profile } = require('console');
const fs = require('fs');
var membres = require('../profileChess.json');

// Get player profile


async function getProfileChess(username) {
    try {
        var profil = await axios.get(`https://api.chess.com/pub/player/${username}`);
        var stats = await axios.get(`https://api.chess.com/pub/player/${username}/stats`);
        var gamesArchive = await axios.get(`https://api.chess.com/pub/player/${username}/games/archives`);
        var dernierMois = gamesArchive.data.archives.pop()
        var archives = await axios.get(dernierMois)
        var lastGame = archives.data.games.pop()
        var country = await axios.get(profil.data.country)
        var popup = await axios.get(`https://www.chess.com/callback/user/popup/${username}`)
        var trueStats = await axios.get(`https://www.chess.com/callback/member/stats/${username}`)

        EloPuzzle = "0";
        recordPuzzle = "0";
        for (i = 0; i < trueStats.data.stats.length; i++) {
            if (trueStats.data.stats[i].key === "tactics") {
                EloPuzzle = trueStats.data.stats[i].stats.rating$
                recordPuzzle = trueStats.data.stats[i].stats.highest_rating
                break;
            }
        }
        avatar = popup.data.avatarUrl ?? " ";
        url = profil.data.url ?? " ";
        pays = country.data.code ?? "Sans papier";
        console.log(pays);
        EloRapid = stats.data.chess_rapid?.last?.rating ?? "0";
        EloBlitz = stats.data.chess_blitz?.last?.rating ?? "0";
        EloBullet = stats.data.chess_bullet?.last?.rating ?? "0";
        recordRapid = stats.data.chess_rapid?.best?.rating ?? "0";
        recordBlitz = stats.data.chess_blitz?.best?.rating ?? "0";
        recordBullet = stats.data.chess_bullet?.best?.rating ?? "0";
        urlgameLastGame = lastGame.url ?? " ";

        const profile = {
            avatar: avatar,
            url: url,
            pays: pays,
            EloRapid: EloRapid,
            EloBlitz: EloBlitz,
            EloBullet: EloBullet,
            EloPuzzle: EloPuzzle,
            recordRapid: recordRapid,
            recordBlitz: recordBlitz,
            recordBullet: recordBullet,
            recordPuzzle: recordPuzzle,
            urlgameLastGame: urlgameLastGame,
        }
        console.log(profile)
        return profile;
    } catch (error) {
        console.log(error);
    }

    //console.log(stats.data.chess_rapid);
}


async function addPlayerChess(username, idDiscord) {
    try {
        var stats = await axios.get(`https://api.chess.com/pub/player/${username}/stats`);
        var trueStats = await axios.get(`https://www.chess.com/callback/member/stats/${username}`)
        for (var i = 0; i < Object.keys(membres.nom).length; i++) {
            if (membres.nom[Object.keys(membres.nom)[i]].nomChess === username) {
                return false;
            }
        }
        EloPuzzle = 0;
        recordPuzzle = 0;
        for (i = 0; i < trueStats.data.stats.length; i++) {
            if (trueStats.data.stats[i].key === "tactics") {
                EloPuzzle = trueStats.data.stats[i].stats.rating$
                recordPuzzle = trueStats.data.stats[i].stats.highest_rating
                break;
            }
        }
        EloRapid = stats.data.chess_rapid?.last?.rating ?? 0;
        EloBlitz = stats.data.chess_blitz?.last?.rating ?? 0;
        EloBullet = stats.data.chess_bullet?.last?.rating ?? 0;
        recordRapid = stats.data.chess_rapid?.best?.rating ?? 0;
        recordBlitz = stats.data.chess_blitz?.best?.rating ?? 0;
        recordBullet = stats.data.chess_bullet?.best?.rating ?? 0;
        membres.nom[username] = {
            nomChess: username,
            nomDiscord: idDiscord,
            EloRapid: EloRapid,
            EloBlitz: EloBlitz,
            EloBullet: EloBullet,
            EloPuzzle: EloPuzzle,
            recordRapid: recordRapid,
            recordBlitz: recordBlitz,
            recordBullet: recordBullet,
            recordPuzzle: recordPuzzle,
        }
        fs.writeFileSync("./profileChess.json", JSON.stringify(membres, null, 2));
        console.log("Le joueur a été ajouté");
        return true;
    } catch (error) {
        console.log(error);
    }
}

async function removePlayerChess(username, idDiscord) {
    try {
        for (var i = 0; i < Object.keys(membres.nom).length; i++) {
            console.log(membres.nom[Object.keys(membres.nom)[i]].nomChess);
            console.log(membres.nom[Object.keys(membres.nom)[i]].nomDiscord);
            if (membres.nom[Object.keys(membres.nom)[i]].nomChess === username && membres.nom[Object.keys(membres.nom)[i]].nomDiscord === idDiscord) {
                delete membres.nom[Object.keys(membres.nom)[i]];
                fs.writeFileSync("./profileChess.json", JSON.stringify(membres, null, 2));
                console.log("Bisous");
                return true;
            }
        }
        console.log("Pas trouvé");
        return false;
    } catch (error) {
        console.log(error);
    }
}

async function BestGame(user) {
    var msg1;
    var msg2;
    var msg3;
    try {
        username = user.nomChess;
        var stats = await axios.get(`https://api.chess.com/pub/player/${username}/stats`);
        try {
            user.EloRapid = stats.data.chess_rapid.last.rating;
            if (stats.data.chess_rapid.best.rating > user.recordRapid) {
                console.log("rapid");
                msg1 = "Nouvelle Pasterclass en Rapid pour <@" + user.nomDiscord +
                    "> qui bats son record de " + user.recordRapid + " à " + stats.data.chess_rapid.best.rating + " " + stats.data.chess_rapid.best.game;
                user.recordRapid = stats.data.chess_rapid.best.rating;
            }
        } catch (error) {
        }
        try {
            user.EloBlitz = stats.data.chess_blitz.last.rating;
            if (stats.data.chess_blitz.best.rating > user.recordBlitz) {
                console.log("blitz");
                msg2 = "Nouvelle Pasterclass en Blitz pour <@" + user.nomDiscord +
                    "> qui bats son record de " + user.recordBlitz + " à " + stats.data.chess_blitz.best.rating + " " + stats.data.chess_blitz.best.game;
                user.recordBlitz = stats.data.chess_blitz.best.rating;
            }
        } catch (error) {
        }
        try {
            user.EloBullet = stats.data.chess_bullet.last.rating;
            if (stats.data.chess_bullet.best.rating > user.recordBullet) {
                console.log("bullet");
                msg3 = "Nouvelle Pasterclass en Bullet pour <@" + user.nomDiscord +
                    "> qui bats son record de " + user.recordBullet + " à " + stats.data.chess_bullet.best.rating + " " + stats.data.chess_bullet.best.game;
                user.recordBullet = stats.data.chess_bullet.best.rating;
            }
        } catch (error) {
        }
        // ----------------------------    SOLUTION POUR LE HALL OF FAMES   ---------------------------------
        // membres.nom[username] = user;
        // ----------------------------    SOLUTION POUR LE HALL OF FAMES   ---------------------------------
        fs.writeFileSync("./profileChess.json", JSON.stringify(membres), (err) => {
            if (err) console.error(err)
        });
        return [msg1, msg2, msg3];

    } catch (error) {
        console.log(error);
    }
}

module.exports.getProfileChess = getProfileChess;
module.exports.addPlayerChess = addPlayerChess;
module.exports.removePlayerChess = removePlayerChess;
module.exports.BestGame = BestGame;
/*
module.exports.removeFavorite = removeFavorite;
module.exports.listFavorites = listFavorites;
*/