const fs = require('fs');
const config =  require('./config.json');
const { MessageEmbed } = require('discord.js');

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

//<--helper functions-->
//sends the asuh dude gif to a channel
module.exports.replyWithEmbeddedGif = function(channel, url) {
    const embed = new MessageEmbed().setImage(url);
    channel.send(embed);
};

//loads all the commands found in the command folder
//and adds them to the client
module.exports.loadCommands = function(client) { 
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        console.log(`   found command ${command.name}`);
	    client.commands.set(command.name, command);
    }
};

//checks if message contains a trigger word and if so
//reply with a cheeky message
module.exports.shitpostIfTriggered = function(message) {
    for (triggered_shitpost of config.triggered_shitposts) {
        for (trigger of triggered_shitpost.triggers) {
            if (message.content.includes(trigger)) {
                //send shitpost
                message.reply(triggered_shitpost.message);
                //check if we should shitpost a gif
                const embed_url = triggered_shitpost.embed_url;
                if (embed_url != undefined) {
                    this.replyWithEmbeddedGif(message.channel, embed_url);
                } //TODO: make shitpost part of embedded thing
            }
        }
    }
};