const adventure = require('../modules/adventure.js');
const mysql = require('../modules/mysql.js');

module.exports.run = async(client, message, args) => {
	let data = await mysql.getUserData(message.author.id, 'location');
	if(data.location == 'Spawn') {
		message.channel.send('There are no dungeons in spawn! Try travelling somewhere else!');
	} else {
		adventure.beginAdventure(message, message.author);
		message.channel.send("You have begun your adventure!");
	}
}

module.exports.help = {
    name: "adventure",
    category: "User",
    description: "Begins an adventure!",
    usage: "adventure"
};