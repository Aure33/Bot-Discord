const fetch = require("node-fetch");
const TBM_URL = "https://ws.infotbm.com/ws/1.0/get-realtime-pass";

const fs = require('fs');
const jsonFile = './ProfileTBM.json';

const  rawData = fs.readFileSync('stopId.json', 'utf8');
// console.log(rawData);
const dataFile = JSON.parse(rawData);

const rawDataBus = fs.readFileSync('busStops.json', 'utf8');
const BusFile = JSON.parse(rawDataBus);

const fetchTBM = async (stopId, lineId) => {
  try {
    const result = await fetch(`${TBM_URL}/${stopId}/${lineId}`);
    console.log(`${TBM_URL}/${stopId}/${lineId}`);
    return await result.json();
  } catch (e) {
    throw `Erreur de récupération des données TBM (ligne: ${lineId}, arrêt: ${stopId}) : ${e}`;
  }
};



const getTBMLineWaitInterval = async (stopName, lineId) => {
  try {
    let stopId
    let stopList;
    // if stop name has a letter in it, it's a stop name, not a stop id
    if (stopName.match(/[a-z]/i)) {
      stopId = findStopIdByStopName(stopName);
    }
    else {
      stopId = stopName;
      stopId = parseInt(stopId);
      stopName = findByStopNamebyId(stopId);
    }
    if (stopId === -1) {
      stopList = findStopNameByStopName(stopName)
      return { stopList, stopId: -1, stopName }
    }
    const data = await fetchTBM(stopId, lineId);
    const dests = Object.values(data.destinations);
    let timeBus1 = dests[0][0].departure;
    //let timeBus2 = dests[0][1].arrival;
    const date1 = new Date(timeBus1);
    //const date2 = new Date(timeBus2);
    //const result = Math.abs(date1 - date2);

    destination_name = dests[0][0].destination_name;
    // console.log(dests[0][0].destination_name);
    // console.log(stopName);

    arrivalTime = new Date(timeBus1);
    now = new Date();

    VraiArriveeMinBus1 = Math.floor((arrivalTime - now) / 1000 / 60);
    VraiArriveeSecBus1 = Math.floor((arrivalTime - now) / 1000) % 60;
    HoraireBus1 = VraiArriveeMinBus1 + " min " + VraiArriveeSecBus1 + " sec";
    return { HoraireBus1, stopId, stopName, destination_name };
  } catch (e) {
    throw `Erreur de récupération des wait interval TBM (ligne: ${lineId}, arrêt: ${stopName}) : ${e}`;
  }
};


function findStopIdByStopName(stopName) {
  for (const stop of dataFile) {
    if (stop.stop_name === stopName) {
      return stop.stop_id;
    }
  }
  return -1;
}

function findByStopNamebyId(stopId) {
  for (const stop of dataFile) {
    if (stop.stop_id === stopId) {
      return stop.stop_name;
    }
  }
  return -1;
}


function findStopNameByStopName(stopName) {
  const lowerCaseStopName = stopName.toLowerCase();
  console.log("lowerCaseStopName: " + lowerCaseStopName);
  return dataFile.filter(stop => stop.stop_name && stop.stop_name.toLowerCase().includes(lowerCaseStopName) && stop.stop_id != null)
    .map(stop => stop.stop_name + "(" + stop.stop_id + ")");
}

const BusPourArret = async (stopId) => {
try {
  console.log("stopId: " + stopId);
  if (stopId.match(/[a-z]/i)) {
    stopName = stopId;
    stopId = findStopIdByStopName(stopId);
    console.log("stopId: " + stopId);
  }
  else {
    stopId = parseInt(stopId);
    stopName = findByStopNamebyId(stopId);
  }
  let listBus =  await findBusByStopId(stopId);
  return { listBus, stopName };
} catch (e) {
  throw `Erreur de récupération des bus pour l'arrêt ${stopId} : ${e}`;
}
};

const listeArrets = async (stopId) => {
  if (stopId.match(/[a-z]/i)) {
    stopName = stopId;
    stopId = findStopIdByStopName(stopId);
  }
  else {
    stopId = parseInt(stopId);
    stopName = findByStopNamebyId(stopId);
  }
  let listBus =  await findStopNameByStopName(stopName);
  return { listBus, stopName };
}

function findBusByStopId(stopId) {
  for (const stop of BusFile) {
    if (stop.stop_id === stopId) {
      return stop.bus;
    }
  }
  return -1;
}

const listTram = async (stopId) => {
  let lineId;
  let listTram = [];
  for(i = 0; i < 4; i++){
    if (i == 0){
      lineId = "A";
    }
    else if (i == 1){
      lineId = "B";
    }
    else if (i == 2){
      lineId = "C";
    }
    else if (i == 3){
      lineId = "D";
    }
    try {
      await fetchTBM(stopId, lineId)
        .then((data) => {
          if (data.destinations) {
            listTram.push(lineId);
          }
        });
    } catch (e) {
      console.log(lineId + " ");
    }
  }
  return listTram;
};



const list10 = async () => {
  // check all stop if the the bus 10 is there write it in newBusStop.json
  let lineId = "B";
  arret = [];
  for(i = 5242; i < 5536; i++){
    try {
      if (i % 100 == 0){
        console.log(i);
      }
      await fetchTBM(i, lineId)
        .then((data) => {
          const dests = Object.values(data.destinations);
          if (dests) {
            arret.push({
              stop_id: i,
              destination_name: dests[0][0].destination_name,
            });
            console.log(i +" ajouté");
            fs.writeFileSync('newBusStop.json', JSON.stringify(arret));
          }
        });
    } catch (e) {
    }
  } 
};






function addFavorite(nom, arret, ligne, discordId) {
  callback = (data) => console.log(data);
  fs.readFile(jsonFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonData = JSON.parse(data);
    if (!jsonData.users.find(user => user.name === nom)) {
      jsonData.users.push({name: nom, discordId: discordId, favorites: []});
    }
    arretTmp = parseInt(arret);
    arretName = findByStopNamebyId(arretTmp);
    console.log("arretName: " + arretName);
    const user = jsonData.users.find(user => user.name === nom);
    const favorite = user.favorites.find(fav => fav.arret === arret && fav.ligne === ligne && fav.arretName === arretName);
    if (!favorite) {
      user.favorites.push({arret: arret, ligne: ligne, arretName: arretName});
    }
    fs.writeFile(jsonFile, JSON.stringify(jsonData), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return;
      }
      callback(jsonData);
    });
  });
}

function removeFavorite(nom, arret, ligne, discordId) {
  callback = (data) => console.log(data);
  fs.readFile(jsonFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonData = JSON.parse(data);
    const user = jsonData.users.find(user => user.name === nom && user.discordId === discordId);
    if (!user) {
      console.error("User not found");
      return;
    }
    const index = user.favorites.findIndex(fav => fav.arret === arret && fav.ligne === ligne);
    if (index === -1) {
      console.error("Favorite not found");
      return;
    }
    user.favorites.splice(index, 1);
    fs.writeFile(jsonFile, JSON.stringify(jsonData), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return;
      }
      callback(jsonData);
    });
  });
}

function listFavorites(discordId) {
  return new Promise((resolve, reject) => {
    fs.readFile(jsonFile, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      const jsonData = JSON.parse(data);
      const user = jsonData.users.find(user => user.discordId === discordId);
      if (!user) {
        reject(new Error('User not found'));
        return;
      }
      resolve(user.favorites);
    });
  });
}






// addFavorite("user1", "arret1", "ligne1", (data) => {
//   console.log(data);
// });

const tbmExiste = async (arret, ligne) => {
  try {
    const data = await fetchTBM(arret, ligne);
    if (data.destinations) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}




function getFavorites(idDiscord) {
  fs.readFile(jsonFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonData = JSON.parse(data);
    const user = jsonData.users.find(user => user.discordId === idDiscord);
    if (!user) {
      console.log(`No user found with id ${idDiscord}`);
      return;
    }
    for (const favorite of user.favorites) {
      const arret = favorite.arret;
      const ligne = favorite.ligne;
      getTBMLineWaitInterval(arret, ligne).then(result => {
        console.log(`Arrêt: ${result.stopName}, Ligne: ${ligne}, Destination: ${result.destination_name}, Horaire du bus: ${result.HoraireBus1}`);
      }).catch(error => {
        console.log(error);
      });
    }
  });
}


// Read in the stops JSON file
const stops = JSON.parse(fs.readFileSync('stopId.json'));
const busses = JSON.parse(fs.readFileSync('busStops.json'));

// Define an async function to get the list of buses for each stop
const getBusStops = async () => {
  const startIndex = 1; // 0-based index of the 5th element
  const stopsSubset = stops.slice(startIndex)
  const busStops = busses || []; // Use existing data or create empty array
  for (const stop of stopsSubset) {
    if (stop.stop_id) { 
      const tram = await listTram(stop.stop_id);
      console.log(stop.stop_id + ' ' + stop.stop_name + ' ' + tram, "(" + (busStops.length + 1) + "/" + stopsSubset.length + ")" );
      const index = busStops.findIndex(obj => obj.stop_id === stop.stop_id);
      if (index !== -1) {
        if (!busStops[index].bus) {
          busStops[index].bus = [];
        }
        busStops[index].bus.push(...tram.filter(t => !busStops[index].bus.includes(t)));
      } else {
        busStops.push({
          stop_id: stop.stop_id,
          stop_name: stop.stop_name,
          bus: tram
        });
      }
      fs.writeFileSync('busStops.json', JSON.stringify(busStops));
    }
  }
  return busStops;
};


//list10();


// // Call the async function to get the bus stops and write to a file
  //getBusStops()
  // .then(busStops => {
  //   fs.writeFileSync('busStops.json', JSON.stringify(busStops));
  // })
  // .catch(err => {
  //   console.error(err);
  // });




module.exports.getTBMLineWaitInterval = getTBMLineWaitInterval;
module.exports.BusPourArret = BusPourArret;
module.exports.listeArrets = listeArrets;
module.exports.addFavorite = addFavorite;
module.exports.getFavorites = getFavorites;
module.exports.tbmExiste = tbmExiste;
module.exports.removeFavorite = removeFavorite;
module.exports.listFavorites = listFavorites;