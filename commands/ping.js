const { pingPongBruhToggle } = require('../utils');
module.exports = {
	name: 'ping',
	description: 'you ping i pong bruh',
	execute(message, args) {
        message.channel.send(pingPongBruhToggle.state ? 'pong bruh' : 'bruh, pong');
	}
};