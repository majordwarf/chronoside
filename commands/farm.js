const mysql = require('../modules/mysql.js');
const farm = require('../modules/farm.js');
const farms = require('../data/farms.json');

module.exports.run = async(client, message, args) => {
    let data;
	switch(args[0]) {
        case "collect":
            data = await mysql.getUserData(message.author.id, 'farm');
            if(data.farm == 0) {
                await message.channel.send('You do not have a farm! Use the farm buy command to buy a farm!');
            } else {
                let earnings = await farm.collect(message.author);
                await message.channel.send(`You have gained ${earnings} gold from collecting!`);
            }
            break;
        case "buy":
            data = await mysql.getUserData(message.author.id, 'farm, gold');
            if(data.farm == 0) {
                if(data.gold < farms[0].price) {
                    await message.channel.send('You do not have enough gold to buy a farm!');
                } else {
                    await farm.buy(message.author);
                    await message.channel.send(`You have bought a ${farms[0].name} for ${farms[0].price} gold!`);
                }
            } else {
                await message.channel.send(`You already have a farm!`);
            }
            break;
        case "upgrade":
            data = await mysql.getUserData(message.author.id, 'farm, gold');
            if(data.farm >= farms.length) {
                await message.channel.send('You already have the best farm!');
            } else if(data.gold < farms[data.farm].price) {
                await message.channel.send('You cannot afford to upgrade your farm!');
            } else {
                let newFarm = await farm.upgrade(message.author);
                await message.channel.send(`You have upgraded your farm! You now have a ${farms[newFarm - 1].name}!`);
            }
            break;
        case "list":
            let fields = [];
            for(farmData of farms) {
                fields.push({
                    "name": farmData.name,
                    "value": `Price: ${farmData.price}\nGold per Hour: ${farmData.earnings}\nGold Cap: ${farmData.cap}`
                });
            }
            await message.channel.send({
                "embed": {
                    "title": "Farms",
                    "description": "All the farms you can get!",
                    "color": 16711680,
                    "fields": fields
                }
            });
            break;
    }
}

module.exports.help = {
    name: "farm",
    category: "User",
    description: "Buy, collect, or upgrade your farm! You can also list all the farms!",
    usage: "farm (buy, collect, upgrade, list)"
};