const leveljs = require('../modules/level.js');
const adventurejs = require('../modules/adventure.js');
const traveljs = require('../modules/travel.js');
const cities = require('../data/cities.json');

module.exports.run = async (client, message, args) => {
    let command = args[0];
    let player = message.author;
    switch(command) {
        case "gainxp":
            if(!isNaN(args[1])) {
                leveljs.gainXP(message, player, args[1]);
            } else {
                message.channel.send('XP must be a valid number!');
            }
            break;
        case "adventure":
            adventurejs.beginAdventure(player);
            break;
        case "travel":
            if(!cities[args[1]]) {
                message.channel.send(`City by the name of ${args[1]} does not exist!`);
            } else {
                traveljs.cheat(player, args[1]);
                message.channel.send(`You are now in ${args[1]}!`);
            }
            break;
    }
};

module.exports.help = {
    name: "cheat",
    category: "Cheat",
    description: "Allows you to cheat (for the purposes of testing and judging)!",
    usage: "cheat (command-name) (arguments)"
};