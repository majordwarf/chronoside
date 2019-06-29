const mysql = require('./mysql.js');
const cities = require('../data/cities.json');
const enemies = require('../data/enemies.json');

/*

   BATTLE SYSTEM:
   TRIGGERS when the user enters a battle, usually through exploration

   1) Get a random enemy from cities.json's list of enemies
   2) get details of enemy from enemies.json
   3) ACTUAL BATTLE SYSTEM
   3.1) display rich embed
   3.2) wait for reactions for specific time!
   3.3) perform actions depending on the reaction
   3.4) the opponent performs attack
   3.5) update the richembed
   
   Battle outcome (when the battle ends, when to give player rewards etc) is checked on reaction, and action is performed in that as well (Ideally it would be separate)

   attack = deal damage (level based for now) + (TODO: weapon damage)
   (TODO: defend = gain x% of life if successful(probability))
   run = x% chance to flee

   TODO:
   1) Factor in equipped weapon damage
   2) Adjust the formula of damage, gold gain, xp gain to scale based on levels of player and enemy
   3) The code looks super jumbled, would love to clean it out a bit. I know a bunch of things that can be improved!

*/

let time = () => {
    return Math.floor(new Date() / 1000);
}

// Returns the level based on total XP
let calculateDamage = (userLevel, enemyLevel) => {
    return Math.round(userLevel);
}

let getMaxHP = (str) => {
    return Math.floor(str*5);
}

let getRandomNumber = (min, max) => {
    return Math.floor(Math.random()*(max-min+1)+min);
}

exports.triggerBattle = async(message, user) => {
    await mysql.setUserData(user.id, `state = "battle"`);
    let data = await mysql.getUserData(user.id, 'str, agi, intel, level, inventory, location, state');
    let playerStr = data.str;
    let playerAgi = data.agi;
    let playerIntel = data.intel;
    let playerLevel = data.level;
    let playerInventory = data.inventory;
    let playerLocation = data.location;
    let playerState = data.state;

    let allEnemies = cities[playerLocation].enemies;
    let enemyNumber = getRandomNumber(0,allEnemies.length);

    let currentEnemy = enemies[allEnemies[enemyNumber]];

    let playerMaxHP = getMaxHP(playerStr);
    let enemyMaxHP = getMaxHP(currentEnemy.level*2);
    let playerCurrentHP = playerMaxHP;
    let enemyCurrentHP = enemyMaxHP;
    let enemyDamage = currentEnemy.level;
    var turns = 0;
    let msg = {
        "embed": {
        "title": "Battle",
        "description": currentEnemy.name,
        "color": 580271,
        "thumbnail": {
            "url": "https://media.discordapp.net/attachments/592199620231299088/594251742213046285/SwampMonster.png"
        },
        "author": {
            "name": "Chronoside Bot",
            "url": ""
        },
        "fields": [
            {
            "name": "Player",
            "value": "HP: "+playerCurrentHP+"/"+playerMaxHP,
            "inline": true
            },
            {
            "name": "Enemy",
            "value": "HP: "+enemyCurrentHP+"/"+enemyMaxHP,
            "inline": true
            }
        ]
        }
    }
    sentMsg = await message.channel.send(msg);
    await sentMsg.react("😛");
    await sentMsg.react("🤔");
  

        //await sentMsg.react("F");
        let reactions = await sentMsg.createReactionCollector(r => r.emoji = ("😛" || "🤔") && r.users.size > 1, {
            max: 15,
            time: 120000,
            errors: ['time']
        });
        reactions.on('collect', async(reaction, reactions) => {
            let enemyDamage = calculateDamage(playerLevel, currentEnemy.level);
            playerCurrentHP -= enemyDamage;
            let enemyCombatMsg = "\nEnemy dealt " + enemyDamage + " to the player!";
            if (reaction.emoji.name === '😛' && reaction.count > 1) {
                // ATTACK MODE
                let damage = calculateDamage(playerLevel, currentEnemy.level);
                enemyCurrentHP -= damage;
                let combatLog = "Player dealt " + damage + " to the enemy!"+enemyCombatMsg;
                if(enemyCurrentHP <= 0) {
                    enemyCurrentHP = 0;
                    // BATTLE OVER!
                    let goldEarned = currentEnemy.level * 2;
                    let xpEarned = (currentEnemy.xp*currentEnemy.level);
                    combatLog = "Player defeated enemy! BATTLE WON!\nGold Earned: " + goldEarned + "\nXP Earned: " + xpEarned;
                    await mysql.setUserData(user.id, `state = "idle"`);
                    await mysql.updateUserData(user.id, 'gold', goldEarned);
                    await mysql.updateUserData(user.id, 'xp', xpEarned);
                    sentMsg.clearReactions();
                } else if(playerCurrentHP <= 0) {
                    playerCurrentHP = 0;
                    let penaltyGold = Math.round(currentEnemy.xp/currentEnemy.level)*-1;
                    combatLog = "Player was defeated by the enemy! BATTLE LOST!\n Penalty of " + penaltyGold + " gold were deducted from your balance!";
                    await mysql.updateUserData(user.id, 'gold', penaltyGold);
                    await mysql.setUserData(user.id, 'state = "idle"');
                    sentMsg.clearReactions();
                }
                msg = {
                    "embed": {
                    "title": "Battle",
                    "description": currentEnemy.name,
                    "color": 580271,
                    "thumbnail": {
                        "url": "https://media.discordapp.net/attachments/592199620231299088/594251742213046285/SwampMonster.png"
                    },
                    "author": {
                        "name": "Chronoside Bot",
                        "url": ""
                    },
                    "fields": [
                        {
                        "name": "Player",
                        "value": "HP: "+playerCurrentHP+"/"+playerMaxHP,
                        "inline": true
                        },
                        {
                        "name": "Enemy",
                        "value": "HP: "+enemyCurrentHP+"/"+enemyMaxHP,
                        "inline": true
                        },
                        {
                        "name": "Combat log",
                        "value": combatLog,
                        "inline": true
                        }
                    ]
                    }
                }
                sentMsg.edit(msg);
            } else if (reaction.emoji.name === '🤔' && reaction.count > 1) {
                // FLEE? lets do flee for now
                let fleeSuccess = false;
                let playerCombatLog = "Player tried to flee!!!\n";
                if(playerLevel>currentEnemy.level) {  
                    fleeSuccess = true;
                } else {
                    // If enemy is higher level, there is only a 20% chance to flee (dummy number)
                    if(Math.random()<=0.2) {
                        fleeSuccess = true;
                    }
                }
                if(fleeSuccess) {
                    await mysql.setUserData(user.id, 'state = "idle"');
                    enemyCombatMsg = "Player managed to escape!";
                    playerCurrentHP+=enemyDamage;
                    sentMsg.clearReactions();
                } else {
                    playerCombatLog += "Flee attempt unsuccessful!\n"
                }
                msg = {
                    "embed": {
                    "title": "Battle",
                    "description": currentEnemy.name,
                    "color": 580271,
                    "thumbnail": {
                        "url": currentEnemy.sprite
                    },
                    "author": {
                        "name": "Chronoside Bot",
                        "url": ""
                    },
                    "fields": [
                        {
                        "name": "Player",
                        "value": "HP: "+playerCurrentHP+"/"+playerMaxHP,
                        "inline": true
                        },
                        {
                        "name": "Enemy",
                        "value": "HP: "+enemyCurrentHP+"/"+enemyMaxHP,
                        "inline": true
                        },
                        {
                        "name": "Combat log",
                        "value": playerCombatLog+enemyCombatMsg,
                        "inline": true
                        }
                    ]
                    }
                }
                sentMsg.edit(msg);
            }
            reaction.remove(user);
        });
}