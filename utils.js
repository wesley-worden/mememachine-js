const fs = require('fs');
const config =  require('./config.json');
const { MessageEmbed } = require('discord.js');

//<--globals-->
const phrases = {
    _phrases: config.bruhs,
    _index: 0,
    get bruh() {
        this._index = (this._index + 1) % this._phrases.length;
        return this._phrases[this._index];
    }
}

//TODO: you fucking idiot you should be using classes by now this 
//is dumb
const voiceWrangler = {
    playing: false,
    dispatcher: null,
    currentVoiceChannel: null
};

//<--helper functions-->
const play = function(channel, voiceChannel, memeFilePath) { //whats wrong with me
    const playOptions = { volume: 1.0 };
    if (voiceWrangler.playing) {
        stopPlaying();
    }
    voiceChannel.join()
        .then(function(connection) {
            voiceWrangler.dispatcher = connection.play(config.muh_sounds_bruh_path + memeFilePath, playOptions);
            voiceWrangler.currentVoiceChannel = voiceChannel;
        }).catch(function(error) {
            channel.send(`couldn't join channel ${phrases.bruh}`);
            console.error(error);
        });
    
};
const randomIndex = function(max) {
    return Math.floor(Math.random() * (max + 1));
}

const getMemeFilePaths = function() {
    return fs.readdirSync(config.muh_sounds_bruh_path).filter(file => file.endsWith(config.media_suffix));
}
const stopPlaying = function() {
    console.log('voiceWrangler', voiceWrangler);
    voiceWrangler.dispatcher.destroy();
    voiceWrangler.playing = false;
}
//sends the asuh dude gif to a channel
//title is a optional argument
const replyWithEmbeddedGif = function(channel, url, title) {
    title = typeof title !== 'undefined' ? title : '';
    const embed = new MessageEmbed()
        .setImage(url)
        .setTitle(title);
    channel.send(embed);
};

const memeDebug = function(channel, object) {
    channel.send(`\`\`\`\n${JSON.stringify(object)}\n\`\`\``);
}

//loads all the commands found in the command folder
//and adds them to the client
const loadCommands = function(client) { 
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        console.log(`   found command ${command.name}`);
	    client.commands.set(command.name, command);
    }
};

//checks if message contains a trigger word and if so
//reply with a cheeky message
const shitpostIfTriggered = function(message) {
    for (const triggeredShitpost of config.triggeredShitposts) {
        for (const trigger of triggeredShitpost.triggers) {
            if (message.content.includes(trigger.toLowerCase())) {
                //send shitpost
                message.channel.send(triggeredShitpost.message);
                //check if we should shitpost a gif
                const embedUrl = triggeredShitpost.embedUrl;
                if (embedUrl != undefined) {
                    replyWithEmbeddedGif(message.channel, embedUrl);
                } //TODO: make shitpost part of embedded thing
            }
        }
    }
};

module.exports = {
    //globals
    voiceWrangler, phrases,
    //helper functions
    shitpostIfTriggered, loadCommands, memeDebug, replyWithEmbeddedGif, getMemeFilePaths, randomIndex, play
}