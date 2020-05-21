const fs = require('fs');

//globals
module.exports.pingPongBruhToggle = { 
    _state: (Math.random() >= 0.5), // initialized to random boolean
    get state() {
        return this._state ^= true; //is this really better than foo != foo bruh
    }
};

//helper functions
module.exports.loadCommands = function(client) { 
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        console.log(`   found command ${command.name}`);
	    client.commands.set(command.name, command);
    }
}