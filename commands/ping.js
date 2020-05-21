const utils = require('../utils');
module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
        message.reply(utils.pingPongBruhToggle.state ? 'pong bruh' : 'bruh, pong');
	},
};