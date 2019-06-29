const mysql = require('./mysql.js');
const farms = require('../data/farms.json');

let time = () => {
    return Math.floor(new Date() / 1000);
}

exports.collect = async user => {
    return new Promise(async (resolve, reject) => {
        let data = await mysql.getUserData(user.id, 'farm, lastCollected');
        let farm = data.farm;
        let lastCollected = data.lastCollected;
        let hours = Math.floor((time() - lastCollected) / 3600);
        if (hours === 0) {
            resolve(0);
        }
        let earnings = hours * farms[farm - 1].earnings;
        if (earnings > farms[farm - 1].cap) {
            earnings = farms[farm - 1].cap;
        }
        await mysql.updateUserData(user.id, 'gold', earnings);
        await mysql.setUserData(user.id, `lastCollected = ${time()}`);
        resolve(earnings);
    });
}

exports.upgrade = async user => {
    return new Promise(async (resolve, reject) => {
        let data = await mysql.getUserData(user.id, 'farm');
        let farm = data.farm;
        console.log(farm + 1)
        if (farm >= farms.length) {
            resolve(0);
        }
        await mysql.updateUserData(user.id, 'farm', 1);
        await mysql.updateUserData(user.id, 'gold', farms[farm].price * -1);
        resolve(farm + 1);
    });
}

exports.buy = async user => {
    return new Promise(async (resolve, reject) => {
        let data = await mysql.getUserData(user.id, 'farm');
        let farm = data.farm;
        if (farm === 0) {
            await mysql.setUserData(user.id, `farm = 1, lastCollected = ${time()}`);
            await mysql.updateUserData(user.id, 'gold', farms[0].price * -1);
            resolve(farms[0].price);
        }
        resolve(0);
    });
}