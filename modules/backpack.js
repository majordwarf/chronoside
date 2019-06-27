const mysql = require('./mysql.js');

exports.addItem = (user, item) => {
	let data = await mysql.getUserData(user.id, 'backpack');
	let backpack = data.backpack.split(',');
	backpack.push(item);
	await mysql.setUserData(user.id, `backpack = ${backpack.join(',')}`);
	return 1;
}

exports.removeItem = (user, item) => {
	let data = await mysql.getUserData(user.id, 'backpack');
	let backpack = data.backpack.split(',');
	if (backpack.includes(item)) {
		backpack = backpack.filter(value => value != item);
		await mysql.setUserData(user.id, `backpack = ${backpack.join(',')}`);
		return 1;
	}
	return 0;
}

exports.getBackpack = user => {
	let data = await mysql.getUserData(user.id, 'backpack');
	return data.backpack.split(',');
}

exports.getInventory = user => {
	let data = await mysql.getUserData(user.id, 'inventory');
	return data.inventory.split(',');
}

exports.equip = (user, item) => {
	let data = await mysql.getUserData(user.id, 'backpack, inventory');
	let backpack = data.backpack.split(',');
	let inventory = data.inventory.split(',');
	if (backpack.includes(item)) {
		inventory.push(item);
		await mysql.setUserData(user.id, `inventory = ${inventory.join(',')}`);
		return 1;
	}
	return 0;
}

exports.unequip = (user, item) => {
	let data = await mysql.getUserData(user.id, 'inventory');
	let inventory = data.inventory.split(',');
	if (inventory.includes(item)) {
		inventory = inventory.filter(value => value != item);
		await mysql.setUserData(user.id, `inventory = ${inventory.join(',')}`);
		return 1;
	}
	return 0;
}