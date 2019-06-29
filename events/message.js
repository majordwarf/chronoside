
const stateChecker = require('../modules/state.js');
const mysql = require('../modules/mysql.js');

module.exports = async (client, message) => {
  // Ignore if user of message is a bot.
  if (message.author.bot) return;
  const prefix = client.config.prefix;
  
  if(!message.content.startsWith(prefix)) return;

  const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);
  if(!cmd) return;

  // TODO: Check if the command given by user can be executed in user's current state, if yes, execute

  // WIP: Check if the state of the user has finished (if not idle)!
  let exists = await mysql.checkUserExists(message.author.id);
  if(exists) {
    stateChecker.stateCheck(message, Math.floor(new Date()/1000));
  }
  await cmd.run(client, message, args);
};
