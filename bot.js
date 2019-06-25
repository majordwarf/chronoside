// Check for Node version with the required version.
if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

// Load up the discord.js library and initialize client.
const Discord = require("discord.js");
const client = new Discord.Client();

// Require our logger.
client.logger = require("./modules/Logger");

// Load configuration JSON file.
client.config = require("./config.json");

// Initialize collection for commands and events. 
client.commands = new Discord.Collection();

// Initialize the bot.
const init = async () => {
	// Load and log command files.
	const cmdFiles = await readdir("./commands/");
	cmdFiles.forEach(file => {
		try {
			const cmd = require(`./commands/${file}`);
			if(file.split(".").slice(-1)[0] !== "js") return;
			client.commands.set(cmd.help.name, cmd);
		} catch (e) {
			console.log(`Error in command ${e.stack}`);
		}
	})

	// Load and log event files.
	const evtFiles = await readdir("./events/");
	evtFiles.forEach(file => {
		try {
			const event = require(`./events/${file}`);
			if(file.split(".").slice(-1)[0] !== "js") return;
			const eventName = file.split(".")[0];
			client.on(eventName, event.bind(null, client));
			delete require.cache[require.resolve(`./events/${file}`)];
		} catch (e) {
			console.log(`Error in events ${e.stack}`);
		}
	})

	client.login(client.config.token);

// End top-level async/await function.
};

init();