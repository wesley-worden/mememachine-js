const { pingPongBruhToggle } = require('../utils');
module.exports = {
	name: 'okay',
	description: 'plays dva-okay at half speed',
	execute(message, args) {
		message.client.commands.get('sox').execute(message, [ "dva-okay", "tempo", "0.5" ]);
	}
};