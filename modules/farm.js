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
    let earnings = hours * farms[farm].earnings;
    if (earnings > farms[farm].cap) {
        earnings = farms[farm].cap;
    }
    await mysql.addBalance(user.id, earnings);
    return earnings;
}

exports.upgrade = async user => {
    let data = await mysql.getUserData(user.id, 'farm');
    let farm = data.farm;
    if (farm >= farms.length - 1) {
        return 0;
    }
    await mysql.upgradeFarm(user.id);
    await mysql.addBalance(user.id, farms[farm + 1].price * -1);
    return farm + 1;
}

exports.buy = async user => {
    let data = await mysql.getUserData(user.id, 'farm');
    let farm = data.farm;
    if (farm === null || farm === undefined) {
        await mysql.buyFarm(user.id);
        await mysql.setLastCollected(user.id, time());
        await mysql.addBalance(user.id, farms[0].price * -1);
        return farms[0].price;
    }
    return 0;
}