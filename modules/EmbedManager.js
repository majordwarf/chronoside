const mysql = require('./mysql.js');

exports.edit = async (user, content) => {
    let data = await mysql.getUserData(user.id, 'embed_id');
    let embedId = data.embed_id;
    let embed = await user.dmChannel.fetchMessage(embedId);
    await embed.edit(content);
}

exports.get = async user => {
    let data = await mysql.getUserData(user.id, 'embed_id');
    let embedId = data.embed_id;
    let embed = await user.dmChannel.fetchMessage(embedId);
    return embed;
}