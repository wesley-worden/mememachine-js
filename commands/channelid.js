module.exports = {
	name: 'channelid',
	description: 'sends the channel id of the channel where you sent the command bruh',
	execute(message, args) {
        message.channel.send(message.channel.id);
	}
};