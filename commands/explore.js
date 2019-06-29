const explore = require('../modules/explore.js');

module.exports.run = async(client, message, args) => {
	await explore.explore(message, message.author);
}

module.exports.help = {
    name: "explore",
    category: "User",
    description: "Begins exploration, where you can either find gold or encounter a battle!",
    usage: "explore"
};