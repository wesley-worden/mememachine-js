const { stopPlaying } = require('../utils');
module.exports = {
	name: 'stop',
	description: 'stops the memes from playing bruh',
	execute(message, args) {
		message.client.commands.get('play').execute(message, [ '1-second-of-silence' ]);
	}
};