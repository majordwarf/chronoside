module.exports = async (client, message) => {
  // Ignore if user of message is a bot.
  if (message.author.bot) return;
  const prefix = client.config.prefix;
  
  if(!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);
  if(!cmd) return;

  await cmd.run(client, message, args);
};
