const { pingPongBruhToggle } = require('../utils');
module.exports = {
	name: 'bye',
	description: 'plays dva-bye at half speed',
	execute(message, args) {
		message.client.commands.get('sox').execute(message, [ "dva-bye", "tempo", "0.5" ]);
	}
};