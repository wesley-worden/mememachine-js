const { playing, dispatcher } = require('../utils');
module.exports = {
	name: 'stop',
	description: 'stops the memes from playing bruh',
	execute(message, args) {
		stop();
	}
};