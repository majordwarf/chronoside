const mysql = require('./mysql.js');
const cities = require('../data/cities.json');
const EmbedManager = require('./EmbedManager.js');

/*

  Travel system:
  !travel cityName


  WRAPPER: Check user's state
  1) Fetch the distance between user's current city and destination
  2) Send the user travelling (change state, arrival time, destination)
  3) 

*/

let time = () => {
    return Math.floor(new Date() / 1000);
}

// Returns the distance
let getDistance = (user, destination) => {
    return cities[destination].dist;
}

// Function to call when the user gives !travel command
exports.travelTo = async(user, destination) => {
    // Get distance between user's current location and destination
    // Set data (State, ArrivalTime, Desination)
    return new Promise(async(resolve, reject) => {
        let data = await mysql.getUserData(user.id, 'location, state');
        let currentState = data.state;
        if (currentState != "idle") {
            return;
        }
        let currentLocation = data.location;
        let hubDistance = getDistance(user, currentLocation);
        let destinationDistance = getDistance(user, destination);
        let totalDistance = hubDistance + destinationDistance;

        let arrivalTime = time() + (totalDistance * 60);
        let newState = "travel";
        await mysql.setUserData(user.id, `state = "${newState}", stateFinishTime = ${arrivalTime}, destination = "${destination}"`);
        resolve(totalDistance);
    });
}

exports.finish = async(user, message) => {
    // Code to execute once user finishes travel
    let data = await mysql.getUserData(user.id, 'location, destination');
    let currentLocation = data.location;
    let arrivalDestination = data.destination;
    // REQUIRED! Syncs up the location after travel is finished!
    await mysql.setUserData(user.id, `location = "${arrivalDestination}", destination = "${arrivalDestination}"`);
    let dest = `Reached ${arrivalDestination}! Hope you have a good time here!`;
    message.channel.send({
        "embed": {
            "title": "Destination Reached!",
            "description": dest,
            "color": 580271,
            "thumbnail": {
                "url": "https://media.discordapp.net/attachments/592199620231299088/594063795572178964/Character.png"
            },
            "author": {
                "name": "Chronoside Bot",
                "url": ""
            }
        }
    });
    /*
    let embedMsg = await EmbedManager.get(user);
    let embed = embedMsg.embeds[0];
    let values = embed.fields[0].value.split('\n');
    values[2] = `Area: ${arrivalDestination}`;
    await EmbedManager.edit(user, embed);
    */
}

exports.cheat = async(user, destination) => {
    await mysql.setUserData(user.id, `location = "${destination}", destination = "${destination}"`);
    /*
    let embedMsg = await EmbedManager.get(user);
    let embed = embedMsg.embeds[0];
    let values = embed.fields[0].value.split('\n');
    values[2] = `Area: ${destination}`;
    await EmbedManager.edit(user, embed);
    */
}