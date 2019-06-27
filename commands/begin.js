const mysql = require('../modules/mysql.js');

module.exports.run = async(client, message, args) => {
    storyMsg = {
        "embed": {
            "title": "The New Dawn",
            "description": "Blah Blah Blah...",
            "color": 16711680,
            "image": {
                "url": "https://cdn.discordapp.com/embed/avatars/0.png"
            },
            "author": {
                "name": "Chronoside Bot",
                "url": ""
            },
            "fields": [{
                "name": "Enter your name to continue :",
                "value": "```!name username```"
            }]
        }
    }

    classMsg = {
        "embed": {
            "title": "The Dragon Attacks",
            "description": "Blah Blah Blah...",
            "color": 16711680,
            "image": {
                "url": "https://cdn.discordapp.com/embed/avatars/0.png"
            },
            "author": {
                "name": "Chronoside Bot",
                "url": ""
            },
            "fields": [{
                "name": "Situation!",
                "value": "React to choose class\n😛 Warrior\n🤔 Rouge"
            }]
        }
    }

    userID = message.author.id
    exist = await mysql.getUserData(userID, "id")

    if (exist === undefined) {
        await message.author.send(storyMsg)
        let nameMess = await message.author.dmChannel.awaitMessages(m => m.content.startsWith('!name'), {
            maxMatches: 1,
            time: 30000,
            errors: ['time']
        });

        args = nameMess.first().content.slice(1).trim().split(/ +/g);
        await message.author.send(`Your name is ${args[1]}.`);
        let classMess = await message.author.send(classMsg);
        await classMess.react("😛");
        await classMess.react("🤔");

        let reactions = await classMess.createReactionCollector(r => r.emoji = "😛" || "🤔", {
            max: 1,
            time: 12000,
            errors: ['time']
        });
        reactions.on('collect', async(reaction, reactions) => {
            console.log('got a reaction');
            console.log(reaction.count);
            if (reaction.emoji.name === '😛' && reaction.count > 1) {
                await classMess.reply(`${args[1]} you are a warrior with id ${userID}`);
                mysql.addUser(userID, args[1], "Warrior");
            } else if (reaction.emoji.name === '🤔' && reaction.count > 1) {
                await classMess.reply('you are a rouge.');
                mysql.addUser(userID, args[1], "Rouge");
            }
        });

        reactions.on('end', collected => {
            console.log(`collected ${collected.size} reactions`);
        });

    } else {
        message.author.send("User Already Exist!");
    }
};

module.exports.help = {
    name: "begin",
    category: "User",
    description: "Begins your wonderful journey in the world of Erendiel.",
    usage: "begin"
};