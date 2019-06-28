const mysql = require('../modules/mysql.js');
const cities = require('../data/cities.json');

module.exports.run = async(client, message, args) => {
	if(!cities[args[1]]) {
        message.channel.send(`City by the name of ${args[1]} does not exist!`);
    } else {
        let travelTime = traveljs.travelTo(player, args[1]);
        message.channel.send(`Now travelling to ${args[1]}. You will arrive in ${travelTime} hours.`);
    }
}

module.exports.help = {
    name: "travel",
    category: "User",
    description: "Initializes travel to another city",
    usage: "travel (cityname)"
};