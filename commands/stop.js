const { stopPlaying } = require('../utils');
module.exports = {
	name: 'stop',
	description: 'stops the memes from playing bruh',
	execute(message, args) {
		stopPlaying();
	}
};