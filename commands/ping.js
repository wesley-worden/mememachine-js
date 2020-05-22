const utils = require('../utils');
module.exports = {
	name: 'ping',
	description: 'you ping i pong bruh',
	execute(message, args) {
        message.reply(utils.pingPongBruhToggle.state ? 'pong bruh' : 'bruh, pong');
	},
};