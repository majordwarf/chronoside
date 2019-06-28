const mysql = require('./mysql.js');

/*

   --- XP formula: 
   xp = Math.round((4 * (level ^ 3)) / 5)
   xp = 4 * (level^3) / 5
   xp*5 = 4*(level^3)
   xp*5 /4 = level^3
   cbrt(xp*5/4) = level

*/

let time = () => {
    return Math.floor(new Date() / 1000);
}

// Returns the level based on total XP
let calculateLevel = xp => {
    return Math.round(Math.cbrt(xp * 5 / 4));
}

// Function that returns the XP required to reach a certain level. For future use!
let xpRequired = level => {
    return Math.round((4 * (level ^ 3)) / 5);
}

let levelUp = async(message, user, newLevel) => {
    let data = await mysql.getUserData(user.id, 'class');
    let playerClass = data.class;

    await mysql.setUserData(user.id, `level = ${newLevel}`);

    let strMultiplier = 1;
    let agiMultiplier = 1;
    let intMultiplier = 1;

    switch (playerClass) {
        case 'Warrior':
            strMultiplier = 3;
            break;
        case 'Mage':
            intMultiplier = 3;
            break;
        case 'Archer':
            agiMultiplier = 3;
            break;
        case 'Rogue':
            strMultiplier = 2;
            agiMultiplier = 2;
            intMultiplier = 1;
            break;
        case 'Cleric':
            strMultiplier = 2;
            agiMultiplier = 1;
            intMultiplier = 2;
            break;
    }
    console.log("newLevel = " + newLevel);
    console.log("Multipliers (str, agi, int)" + strMultiplier + " " + agiMultiplier + " " + intMultiplier);
    await mysql.setUserData(user.id, `str = ${strMultiplier*newLevel}, agi = ${agiMultiplier*newLevel}, intel = ${intMultiplier*newLevel}`);
    desc = `${user} gained new level! Level ${newLevel}!`
    levelUpMsg = {
        "embed": {
            "title": "Level Up!",
            "description": desc,
            "color": 580271,
            "thumbnail": {
                "url": "https://media.discordapp.net/attachments/592199620231299088/594063795572178964/Character.png"
            },
            "author": {
                "name": "Chronoside Bot",
                "url": ""
            }
        }
    }
    await message.channel.send(levelUpMsg);
}

// Function to call when the user gains any amount of XP through any source
exports.gainXP = async(message, user, xpAmount) => {
    // Add XP amount to user's current XP
    // Check if user has leveled up
    // ++ Increase user's level
    // ++ Update XP
    let data = await mysql.getUserData(user.id, 'xp, level');
    let currentXP = data.xp;
    let currentLevel = data.level;

    let newXP = parseInt(currentXP) + parseInt(xpAmount);
    let newLevel = calculateLevel(newXP);

    desc = `${user} gained ${xpAmount}XP!`
    levelUpMsg = {
        "embed": {
            "title": "XP Gain!",
            "description": desc,
            "color": 580271,
            "thumbnail": {
                "url": "https://media.discordapp.net/attachments/592199620231299088/594063795572178964/Character.png"
            },
            "author": {
                "name": "Chronoside Bot",
                "url": ""
            }
        }
    }
    await message.channel.send(levelUpMsg);

    await mysql.setUserData(user.id, `xp = ${newXP}`);
    if (currentLevel != newLevel) {
        levelUp(message, user, newLevel);
    }
}

/*

    STAT SYSTEM:
    Basically, it will be level*multiplier based on the class. each class has 1 primary attribute and may have 1 secondary.
    The sum of multiplier will always be 5. Hence, at level 10, player will have 50 total stats distributed based on their class.
    Feel free to suggest if we want to use a different system!

*/

exports.levelUP = async(message, user, newLevel) => {
    levelUp(message, user, newLevel);
}