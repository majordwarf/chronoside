const mysql = require('mysql');
const config = require('./config.json');

const db = mysql.createConnection({
	host: config.db_host,
	user: config.db_user,
	password: config.db_password,
	database: config.db_name
});

/*
	I DON"T KNOW IF THIS RUNS YET. UNTESTED! 
*/
exports.setupDB = () => {
    const tableCount = db.query(`SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE 'players'`, (error, results) => {
		if (error) throw error;
		console.log(results.length);
		return results.length;
	});
    if(tableCount == 0) {
        // Indicates there are no tables, let's make them!
        db.query(`CREATE TABLE players (
            id BIGINT NOT NULL,
            charname TEXT NOT NULL,
            class TINYTEXT NOT NULL,
            location VARCHAR(100) DEFAULT 'Spawn',
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
            if (error) throw error;
            return results;
        });
    }
}

/*

	Most of these commands are from Segal's code. I modified them to match the DB schema.
	TODO: Generalize them. Ask for table to get/set data from.

*/

exports.getUserData = (userID, data) => {
	db.query(`SELECT ${data} FROM players WHERE id = ${userID}`, (error, results) => {
		if (error) throw error;
		return results[0];
	});
}

exports.setUserData = (userID, data) => { //mysql.setUserData(userID, 'gold = 0, farm = 2')
	db.query(`UPDATE players SET ${data} WHERE id = ${userID}`, (error, results) => {
		if (error) throw error;
		return results[0];
	});
}

exports.updateUserData = (userID, data, num) => {
	db.query(`UPDATE players SET ${data} = ${data} + ${num} WHERE id = ${userID}`, (error, results) => {
		if (error) throw error;
		return results[0];
	});
}

exports.getGuildData = (serverID, data) => {
	db.query(`SELECT ${data} FROM servers WHERE id = ${serverID}`, (error, results) => {
		if (error) throw error;
		return results[0];
	});
}

exports.setGuildData = (serverID, data) => { //mysql.setServerData(guildID, 'gold = 0, farm = 2')
	db.query(`UPDATE servers SET ${data} WHERE id = ${serverID}`, (error, results) => {
		if (error) throw error;
		return results[0];
	});
}

exports.updateGuildData = (serverID, data, num) => {
	db.query(`UPDATE servers SET ${data} = ${data} + ${num} WHERE id = ${serverID}`, (error, results) => {
		if (error) throw error;
		return results[0];
	});
}