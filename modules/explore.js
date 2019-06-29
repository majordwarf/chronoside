const mysql = require('./mysql.js');
const battle = require('./battle.js');

exports.explore = async (message, user) => {
	let exploreRand = Math.random();
	if (exploreRand < 0.5) {
		let data = await mysql.getUserData(user.id, 'location');
		if(data.location == 'Spawn') {
			message.channel.send('There is nothing to fight with in spawn! Try travelling somewhere else!');
		} else {
			battle.triggerBattle(message, user);
		}
		return 0;
	} else {
		let data = await mysql.getUserData(user.id, 'level');
		let gold = Math.ceil(Math.random() * 5 * data.level);
		await mysql.updateUserData(user.id, 'gold', gold);
		message.channel.send(`Wow! You found ${gold} gold!`);
		return gold;
	}
}