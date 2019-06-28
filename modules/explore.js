const sql = require('./mysql.js');

exports.explore = user => {
	let exploreRand = Math.random();
	if (exploreRand < 0.5) {
		//battle stuff (probably calling a function in battle module)
		return 0;
	} else {
		let data = await mysql.getUserData(user.id, 'level');
		let gold = Math.ceil(Math.random() * 5 * data.level);
		await mysql.updateUserData(user.id, 'balance', gold);
		return gold;
	}
}