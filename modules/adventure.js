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


exports.beginAdventure = async(message, user) => {
    let data = await mysql.getUserData(user.id, 'location, level');
    let currentLocation = data.location;
    let userLevel = data.level;
    let dungeonToEnter = getDungeon(currentLocation);
    let destination = currentLocation;
    let timeToComplete = dungeonToEnter.level * 2;

    let arrivalTime = time() + (timeToComplete * 60);
    let successChance = Math.round(calculateProbability(userLevel, dungeont.level)*100);
    let msg = {
        "embed": {
          "title": "Adventure",
          "description": "Adventuring to " + dungeonToEnter.name,
          "color": 580271,
          "thumbnail": {
            "url": dungeonToEnter.sprite
          },
          "author": {
            "name": "Chronoside Bot",
            "url": ""
          },
          "fields": [
            {
            "name": "Success rate",
            "value": "You have a " + successChance + "% chance to succeed!",
            "inline": true
            },
            {
            "name": "Completion time",
            "value": "You will complete the adventure in " + Math.round(arrivaTime - time()/60) + " minutes!",
            "inline": true
            }
          ]
        }
      }
      message.channel.send(msg);
    await mysql.setUserData(user.id, `state = "adventure", stateFinishTime = ${arrivalTime}, destination = "${destination}"`);
}

exports.finish = async(user, message) => {
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
    } else {
        // Indicates failure :'(
        let prob = `Mission failed! Better luck next time!`;
        result(message, prob);
    }

    // Change the state back to idle - MOVED TO STATE FINISH SYSTEM!

}