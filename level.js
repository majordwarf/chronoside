const mysql = require('./mysql.js');

/*
    1: 5
    2: 10
    3: 15
    4: 20
    5: 25
    x: x*5

*/

let time = () => {
	return Math.floor(new Date() / 1000);
}


// Function to call when the user gains any amount of XP through any source
exports.gainXP = (user, xpAmount) => {
    // Add XP amount to user's current XP
    // Check if user has leveled up
    // ++ Increase user's level
    // ++ Update XP
    
    let currentXP = mysql.getUserData('xp')
    let currentLevel = mysql.getUserData('level')

    let totalXP = currentXP+xpAmount;

    while(totalXP > currentLevel*5) {
        totalXP = totalXP - currentLevel*5
        currentLevel++        
    }

    mysql.increaseLevel(user, currentLevel);
    mysql.setXP(user, totalXP);
    
}

exports.levelUP = (user) => {
    let playerClass = mysql.getUserData('class');
}