const mysql = require('./mysql.js');
const cities = require('../data/cities.json');

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
exports.travelTo = async (user, desination) => {
    // Get distance between user's current location and destination
    // Set data (State, ArrivalTime, Desination)
    
    let data = await mysql.getUserData(user.id, 'location');
    let currentLocation = data.location;
    let hubDistance = getDistance(user, currentLocation);
    let destinationDistance = getDistance(user, destination);
    let totalDistance = hubDistance + destinationDistance;

    let arrivalTime = time() + (totalDistance * 60);
    await mysql.setUserData(user.id, `state = travel, stateFinishTime = ${arrivalTime}, destination = ${destination}`);

}