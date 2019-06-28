const mysql = require('./mysql.js');
const farms = require('../data/farms.json');

let time = () => {
    return Math.floor(new Date() / 1000);
}

exports.collect = async user => {
    let data = await mysql.getUserData(user.id, 'farm, last_collected');
    let farm = data.farm;
    let last_collected = data.last_collected;
    let hours = Math.floor((time() - last_collected) / 3600);
    if (hours === 0) {
        return 0;
    }
    let earnings = hours * farms[farm - 1].earnings;
    if (earnings > farms[farm - 1].cap) {
        earnings = farms[farm - 1].cap;
    }
    await mysql.updateUserData(user.id, 'gold', earnings);
    await mysql.setUserData(user.id, `last_collected = ${time()}`);
    return earnings;
}

exports.upgrade = async user => {
    let data = await mysql.getUserData(user.id, 'farm');
    let farm = data.farm;
    if (farm >= farms.length) {
        return 0;
    }
    await mysql.updateUserData(user.id, 'farm', 1);
    await mysql.updateUserData(user.id, 'gold', farms[farm].price * -1);
    return farm;
}

exports.buy = async user => {
    let data = await mysql.getUserData(user.id, 'farm');
    let farm = data.farm;
    if (farm === 0) {
        await mysql.setUserData(user.id, `farm = 1, last_collected = ${time()}`);
        await mysql.updateUserData(user.id, 'gold', farms[0].price * -1);
        return farms[0].price;
    }
    return 0;
}