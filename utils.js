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

module.exports.fuckThis = {
    currentVoiceChannel: null
}

module.exports.phrases = {
    _phrases: config.bruhs,
    _index: 0,
    get bruh() {
        this._index = (this._index + 1) % this._phrases.length;
        return this._phrases[this._index];
    }
}

//TODO: you fucking idiot you should be using classes by now this 
//is dumb
module.exports.dispatcherWrangler = {
    playing: false,
    dispatcher: null
};

//TODO: bruh string phrase replacement object thingy

//<--helper functions-->
module.exports.randomIndex = function(max) {
    return Math.floor(Math.random() * (max + 1));
}
// module.exports.play = function(channel, voiceChannel, memeFilePath) {
//     const playOptions = { volume: 1.0 };
//     if (this.dispatcherWrangler.playing) {
//         this.stopPlaying();
//     }
//     voiceChannel.join()
//         .then(function(connection) {
//             //console.log('connection', connection);
//             // memeDebug(channel, connection);
//             // if ( memeFilePath != '1-second-of-silence' + media_suffix) {
//             //     // console.log(memeFilePath);
//             //     channel.send(`playing \`${memeFilePath}\` bruh`);
//             // }
//             console.log(this);
//             this.dispatcherWrangler.dispatcher = connection.play(config.muh_sounds_bruh_path + memeFilePath, playOptions);
//             // dispatcherWrangler.dispatcher = connection.play(memeFilePath, playOptions);
//             // dispatcherWrangler.dispatcher.on('finish', () => {
//             //     stop();
//             // });
//             //console.log('dispatcher', dispatcherWrangler.dispatcher);
//             // memeDebug(channel, dispatcher);
//         }).catch(function(error) {
//             channel.send(`couldn't join channel bruh`);
//             console.error(error);
//         });
    
// };

module.exports.getMemeFilePaths = function() {
    return fs.readdirSync(config.muh_sounds_bruh_path).filter(file => file.endsWith(config.media_suffix));
}
module.exports.stopPlaying = function() {
    console.log('dispatcherWrangler', this.dispatcherWrangler);
    this.dispatcherWrangler.dispatcher.destroy();
    this.dispatcherWrangler.playing = false;
}
//sends the asuh dude gif to a channel
//title is a optional argument
module.exports.replyWithEmbeddedGif = function(channel, url, title) {
    title = typeof title !== 'undefined' ? title : '';
    const embed = new MessageEmbed()
        .setImage(url)
        .setTitle(title);
    channel.send(embed);
};

module.exports.memeDebug = function(channel, object) {
    channel.send(`\`\`\`\n${JSON.stringify(object)}\n\`\`\``);
}

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
    for (const triggeredShitpost of config.triggeredShitposts) {
        for (const trigger of triggeredShitpost.triggers) {
            if (message.content.includes(trigger.toLowerCase())) {
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