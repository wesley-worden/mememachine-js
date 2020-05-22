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
//title is a optional argument
module.exports.replyWithEmbeddedGif = function(channel, url, title) {
    title = typeof title !== 'undefined' ? title : '';
    const embed = new MessageEmbed()
        .setImage(url)
        .setTitle(title);
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
    for (triggeredShitpost of config.triggeredShitposts) {
        for (trigger of triggeredShitpost.triggers) {
            if (message.content.includes(trigger)) {
                //send shitpost
                message.channel.send(triggeredShitpost.message);
                //check if we should shitpost a gif
                const embedUrl = triggeredShitpost.embedUrl;
                if (embedUrl != undefined) {
                    this.replyWithEmbeddedGif(message.channel, embedUrl);
                } //TODO: make shitpost part of embedded thing
            }
        }
    }
};