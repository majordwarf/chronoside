const mysql = require('../modules/mysql.js');
const cities = require('../data/cities.json');
const traveljs = require('../modules/travel.js');

module.exports.run = async(client, message, args) => {
	if(!cities[args[0]]) {
        await message.channel.send(`City by the name of ${args[0]} does not exist!`);
    } else {
        let travelTime = await traveljs.travelTo(message.author, args[0]);
        await message.channel.send(`Now travelling to ${args[0]}. You will arrive in ${travelTime} minutes.`);
    }
}

module.exports.help = {
    name: "travel",
    category: "User",
    description: "Initializes travel to another city",
    usage: "travel (cityname)"
};