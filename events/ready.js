const mysql = require('../modules/mysql.js');

module.exports = async client => {
  // Log that the bot is online.
  mysql.setupDB();
  client.logger.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "ready");
};