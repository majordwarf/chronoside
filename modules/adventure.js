const mysql = require('./mysql.js');
const dungeons = require('../data/dungeons.json');

/*

  Travel system:
  !adventure


  WRAPPER: Check user's state
  1) Find the dungeon in current city
  2) Display dungeon details such as name, image, rate of success, time till finish
  2) Send the user adventuring (change state)
  WRAPPER: THINGS TO DO WHEN FINISHED
  1) Check if user is successful
  2) Give rewards if yes

*/

let time = () => {
    return Math.floor(new Date() / 1000);
}

// Returns the distance
let getDungeon = (city) => {
    return dungeons[city];
}

let calculateProbability = (userLevel, dungeonLevel) => {
    // Scale the prob. based on both levels, for now its either 100% if high lvl, or 50% if not
    if(userLevel > dungeonLevel) {
        return 1.0;
    } else {
        return 0.5;
    }
}

let getGoldReward = (userLevel, dungeonLevel) => {
    return (dungeonLevel);
}
let getXPReward = (userLevel, dungeonLevel) => {
    return (dungeonLevel);
}



// Function to call when the user gives !travel command
exports.beginAdventure = async (user) => {
    // 
    // 
    
    let data = await mysql.getUserData(user.id, 'location, level');
    let currentLocation = data.location;
    let userLevel = data.level;
    let dungeonToEnter = getDungeon(currentLocation);
    let destination = currentLocation;

    // Dungeon details
    console.log("Entering dungeon: " + dungeonToEnter.name + " \n Level: " + dungeonToEnter.dungeonLevel + "\n Probability to success: " + calculateProbability(userLevel, dungeonToEnter.level) );
    
    let timeToComplete = dungeonToEnter.level *2;

    let arrivalTime = time() + (timeToComplete * 60);
    await mysql.setUserData(user.id, `state = adventure, stateFinishTime = ${arrivalTime}, destination = ${destination}`);

}

exports.finish = async(user) => {
    // This is supposed to be ran when the "state-checker" finds that the "adventure" state has finished

    
    let data = await mysql.getUserData(user.id, 'location, level');
    let currentLocation = data.location;
    let userLevel = data.level;
    let dungeonToEnter = getDungeon(currentLocation);
    let destination = currentLocation;


    let requiredProb = calculateProbability(userLevel, dungeonToEnter.level);
    let goldEarned = getGoldReward(userLevel, dungeonLevel);
    let xpEarned = getXPReward(userLevel, dungeonLevel);

    if(Math.random()>requiredProb) {
        // Indicates success!
        
        // Add gold reward!
        await mysql.updateUserData(user.id, 'gold', goldEarned);
        // Add XP reward!
        await mysql.updateUserData(user.id, 'xp', xpEarned);
        console.log("Mission success! Gold and XP Earned!");
    } else {
        // Indicates failure :'(
        console.log("You failed! Try next time!");
    }

    // Change the state back to idle
    await mysql.setUserData(user.id, `state = idle, stateFinishTime = ${time}, destination = ${destination}`);

}