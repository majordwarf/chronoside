const mysql = require('mysql');
const config = require('../config.json');

const db = mysql.createConnection({
    host: config.db_host,
    user: config.db_user,
    password: config.db_password,
    database: config.db_name
});

exports.setupDB = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE 'players'`, (error, results) => {
            if (error) {
                reject(error);
            } else if(results.length == 0) {
                db.query(`CREATE TABLE players (
                    id BIGINT NOT NULL,
                    charname TEXT NOT NULL,
                    class TINYTEXT NOT NULL,
                    location VARCHAR(100) DEFAULT 'Spawn',
                    destination VARCHAR(100) DEFAULT 'Spawn',
                    str SMALLINT DEFAULT '5',
                    agi SMALLINT DEFAULT '5',
                    intel SMALLINT DEFAULT '5',
                    level INT unsigned DEFAULT '1',
                    xp INT unsigned DEFAULT '0',
                    gold INT DEFAULT '0',
                    state VARCHAR(100) DEFAULT 'idle',
                    stateFinishTime DATETIME,
                    farm INT,
                    lastCollected DATETIME,
                    inventory VARCHAR(100),
                    backpack VARCHAR(100),
                    PRIMARY KEY (id)
                    );`, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    });
}

exports.addUser = (userID, charName, charClass) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO players (id, charname, class) VALUES (${userID}, "${charName}", "${charClass}")`, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
}

exports.getUserData = (userID, data) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT ${data} FROM players WHERE id = ${userID}`, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
}

exports.setUserData = (userID, data) => { //mysql.setUserData(userID, 'gold = 0, farm = 2')
    return new Promise((resolve, reject) => {
        db.query(`UPDATE players SET ${data} WHERE id = ${userID}`, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
}

exports.updateUserData = (userID, data, num) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE players SET ${data} = ${data} + ${num} WHERE id = ${userID}`, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
}

exports.getGuildData = (serverID, data) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT ${data} FROM servers WHERE id = ${serverID}`, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
}

exports.setGuildData = (serverID, data) => { //mysql.setServerData(guildID, 'gold = 0, farm = 2')
    return new Promise((resolve, reject) => {
        db.query(`UPDATE servers SET ${data} WHERE id = ${serverID}`, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
}

exports.updateGuildData = (serverID, data, num) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE servers SET ${data} = ${data} + ${num} WHERE id = ${serverID}`, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
}