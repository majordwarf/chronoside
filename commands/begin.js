const mysql = require('../modules/mysql.js');

module.exports.run = async(client, message, args) => {
    const prefix = client.config.prefix;
    storyMsg = {
        "embed": {
            "title": "The New Dawn",
            "description": "A long long time ago the peaceful land of Wumpus was captured by an evil spirit.",
            "color": 16711680,
            "author": {
                "name": "Chronoside Bot",
                "url": ""
            },
            "fields": [{
                "name": "Enter your name to continue :",
                "value": '```' + prefix + 'name username```'
            }]
        }
    }

    classMsg = {
        "embed": {
            "title": "The Evil Spirit Attacks",
            "description": "On a peaceful day when you were in your army training the evil spirit attacked the camp. You saw 5 weapons, which one do you pickup?\nA Sword\nA Bow\nA Mace\nA Staff\nDaggers",
            "color": 16711680,
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
        let nameMess = await message.author.dmChannel.awaitMessages(m => m.content.startsWith(`${prefix}name`), {
            maxMatches: 1,
            time: 30000,
            errors: ['time']
        });

        args = nameMess.first().content.slice(1).trim().split(/ +/g);
        await message.author.send(`Your name is ${args[1]}.`);
        let classMess = await message.author.send(classMsg);
        await classMess.react("593699121852973078");
        await classMess.react("593699122289180686");
        await classMess.react("593699122305826816");
        await classMess.react("593699122440175616");
        await classMess.react("593699122238717962");

        let reactions = await classMess.createReactionCollector(r => r.emoji = ("593699121852973078" || "593699122289180686" || "593699122305826816" || "593699122440175616" || "593699122238717962") && r.users.size > 1, {
            max: 1,
            time: 12000,
            errors: ['time']
        });
        reactions.on('collect', async(reaction, reactions) => {
            let userClass = "";
            if (reaction.emoji.name === '593699121852973078' && reaction.count > 1) {
                await classMess.reply(`${args[1]} you are a warrior!`);
                userClass = "Warrior";
            } else if (reaction.emoji.name === '593699122289180686' && reaction.count > 1) {
                await classMess.reply(`${args[1]} you are a Archer!`);
                userClass = "Archer";
            } else if (reaction.emoji.name === '593699122305826816' && reaction.count > 1) {
                await classMess.reply(`${args[1]} you are a Mace!`);
                userClass = "Cleric";
            } else if (reaction.emoji.name === '593699122440175616' && reaction.count > 1) {
                await classMess.reply(`${args[1]} you are a Wizard!`);
                userClass = "Wizard";
            } else if (reaction.emoji.name === '593699122238717962' && reaction.count > 1) {
                await classMess.reply(`${args[1]} you are a Rouge!`);
                userClass = "Rouge";
            }

            let finishEmbed = {
                    "embed": {
                        "title": "You escape!",
                        "description": "You fight bravely but the dragon was too powerful! You decide to escape the scene and travel to the nearest safe city for help.",
                        "color": 16711680,
                        "author": {
                            "name": "Chronoside Bot",
                            "url": ""
                        }
                    }
                }

            let infoEmbed = {
                "embed": {
                    "title": `${userClass}`,
                    "color": 16711680,
                    "thumbnail": {
                        "url": "https://media.discordapp.net/attachments/592199620231299088/594063795572178964/Character.png"
                    },
                    "author": {
                        "name": `${args[1]}'s profile`,
                        "url": ""
                    },
                    "fields": [{
                        "name": "Progress",
                        "value": `Level: 1\nXP: 0\nArea: CityA`,
                        "inline": true
                    }, {
                        "name": "Money",
                        "value": "<:Coin:593699122473730063>: 0"
                    }]
                }
            }

            let finishEmbedMsg = await classMess.channel.send(finishEmbed);
            let infoEmbedMsg = await classMess.channel.send(infoEmbed);
            mysql.addUser(userID, args[1], userClass, infoEmbedMsg.id);
        });
    } else {
        message.author.send("You have already begun your journey!");
    }
};

module.exports.help = {
    name: "begin",
    category: "User",
    description: "Begins your wonderful journey in the world of Erendiel.",
    usage: "begin"
};