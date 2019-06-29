const mysql = require('./mysql.js');

exports.edit = async (user, content) => {
    return new Promise(async(resolve, reject) => {
		let data = await mysql.getUserData(user.id, 'embed_id');
	    let embedId = data.embed_id;
	    let embed = await user.dmChannel.fetchMessage(embedId);
	    await embed.edit(content);
	    resolve(1);
	});
}

exports.get = async user => {
	return new Promise(async(resolve, reject) => {
		let data = await mysql.getUserData(user.id, 'embed_id');
	    let embedId = data.embed_id;
	    let embed = await user.dmChannel.fetchMessage(embedId);
	    resolve(embed);
	});
}