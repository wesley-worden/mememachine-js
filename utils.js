const fs = require('fs');
const config =  require('./config.json');

//<--globals-->
//toggle that toggles when state is accessed
//TODO: use static variable with function to replace this
module.exports.pingPongBruhToggle = { 
    _state: (Math.random() >= 0.5), // initialized to random boolean
    get state() {
        return this._state ^= true; //is this really better than foo != foo bruh
    }
};

//TODO: bruh string phrase replacement object thingy

//<--helper functions-->, 
//loads all the commands found in the command folder
//and adds them to the client
module.exports.loadCommands = function(client) { 
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        console.log(`   found command ${command.name}`);
	    client.commands.set(command.name, command);
    }
}

//checks if message contains a trigger word and if so
//reply with a cheeky message
module.exports.shitpostIfTriggered = function(message) {
    for (triggered_shitpost of config.triggered_shitposts) {
        for (trigger of triggered_shitpost.triggers) {
            if (message.content.includes(trigger)) {
                message.reply(triggered_shitpost.shitpost);
            }
        }
    }
};