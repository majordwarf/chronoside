const leveljs = require('../modules/level.js');
const adventurejs = require('../modules/adventure.js');
const traveljs = require('../modules/travel.js');

module.exports.run = async (client, message, args) => {
    const msg = await message.channel.send("Ping?");
    msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    let command = args[0];
    let player = message.author;
    switch(command) {
        case "gainxp":
            leveljs.gainXP(player, args[1]);
            break;
        case "adventure":
            adventurejs.beginAdventure(player);
            break;
        case "travel":
            traveljs.travelTo(player, args[1]);
            break;

    }
};

module.exports.help = {
  name: "cheat",
  category: "Cheat",
  description: "Allows you to cheat!",
  usage: "cheat (command-name) (arguments)"
};