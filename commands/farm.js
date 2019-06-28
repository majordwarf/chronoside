const mysql = require('../modules/mysql.js');
const farm = require('../modules/farm.js');
const farms = require('../data/farms.json');

module.exports.run = async(client, message, args) => {
	switch(args[1]) {
        case "collect":
            let data = mysql.getUserData(message.author.id, 'farm');
            if(data.farm == 0) {
                message.channel.send('You do not have a farm! Use the farm buy command to buy a farm!');
            } else {
                let earnings = farm.collect(message.author);
                message.channel.send(`You have gained ${earnings} gold from collecting!`);
            }
            break;
        case "buy":
            let data = mysql.getUserData(message.author.id, 'farm, balance');
            if(data.farm == 0) {
                if(data.balance < farms[0].price) {
                    message.channel.send('You do not have enough gold to buy a farm!');
                } else {
                    farm.buy(message.author);
                    message.channel.send(`You have bought a ${farms[0]} for ${farms[0].price}!`);
                }
            } else {
                message.channel.send(`You already have a farm!`);
            }
            break;
        case "upgrade":
            let data = mysql.getUserData(message.author.id, 'farm, balance');
            if(data.balance < farms[data.farm].price) {
                message.channel.send('You cannot afford to upgrade your farm!');
            } else {
                let newFarm = farm.upgrade(message.author);
                message.channel.send(`You have upgraded your farm! You now have a ${farms[farm].name}!`);
            }
            break;
    }
}

module.exports.help = {
    name: "farm",
    category: "User",
    description: "Buy, collect, or upgrade your farm!",
    usage: "farm (command)"
};