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
    if (userLevel > dungeonLevel) {
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

let result = (message, prob) => {
    return message.channel.send({
        "embed": {
            "title": "Character Status!",
            "description": prob,
            "color": 580271,
            "thumbnail": {
                "url": "https://media.discordapp.net/attachments/592199620231299088/594063795572178964/Character.png"
            },
            "author": {
                "name": "Chronoside Bot",
                "url": ""
            }
        }
    })

}



// Function to call when the user gives !travel command
exports.beginAdventure = async(user) => {
    // 
    // 

    let data = await mysql.getUserData(user.id, 'location, level');
    let currentLocation = data.location;
    let userLevel = data.level;
    let dungeonToEnter = getDungeon(currentLocation);
    let destination = currentLocation;

    // Dungeon details
    console.log("Entering dungeon: " + dungeonToEnter.name + " \n Level: " + dungeonToEnter.level + "\n Probability to success: " + calculateProbability(userLevel, dungeonToEnter.level));

    let timeToComplete = dungeonToEnter.level * 2;

    let arrivalTime = time() + (timeToComplete * 60);
    await mysql.setUserData(user.id, `state = "adventure", stateFinishTime = ${arrivalTime}, destination = "${destination}"`);

}

exports.finish = async(user, message) => {
    // This is supposed to be ran when the "state-checker" finds that the "adventure" state has finished


    let data = await mysql.getUserData(user.id, 'location, level');
    let currentLocation = data.location;
    let userLevel = data.level;
    let dungeonToEnter = getDungeon(currentLocation);
    let destination = currentLocation;


    let requiredProb = calculateProbability(userLevel, dungeonToEnter.level);
    let goldEarned = getGoldReward(userLevel, dungeonToEnter.level);
    let xpEarned = getXPReward(userLevel, dungeonToEnter.level);

    if (Math.random() <= requiredProb) {
        // Indicates success!

        // Add gold reward!
        await mysql.updateUserData(user.id, 'gold', goldEarned);
        // Add XP reward!
        await mysql.updateUserData(user.id, 'xp', xpEarned);
        let prob = `Mission success! ${goldEarned}Gold and ${xpEarned}XP Earned`;
        result(message, prob);
        console.log("Mission success! Gold and XP Earned!");
    } else {
        // Indicates failure :'(
        let prob = `Mission failed! Better luck next time!`;
        result(message, prob);
        console.log("You failed! Try next time!");
    }

    // Change the state back to idle - MOVED TO STATE FINISH SYSTEM!

}