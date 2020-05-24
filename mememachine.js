console.log('*begins screaching*');

const {Client, Collection} = require('discord.js');
const utils = require('./utils');
const fs = require('fs'); //for file system stuff
const path = require('path'); //paths for file system stuff

//make the client
const client = new Client();

console.log('loading config.json...');
const config = require('./config.json');
console.log('loading api-keys.json...');
const apiKeys = require('./api-keys.json');

console.log('time to rustle up some commands...');
client.commands = new Collection();
utils.loadCommands(client);

client.on('ready', function () {
    console.log(`logged in as ${client.user.tag} ${utils.phrases.bruh}`);
});

client.on('message', function (message) {
    //gtfo if message is from self or other bot
    if (message.author.tag === client.user.tag || message.author.bot) { return; }

    //reply with a cheeky message if appropriate
    utils.shitpostIfTriggered(message);
    //TODO: reply dont @ me bro when @
    
    //only continue if message was a command
    if (!message.content.startsWith(config.prefix)) { return; }
    //get command and args
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    
    //check for command
    if (!client.commands.has(command)) { 
        console.log(`no matching command for ${command}`);
        message.channel.send(`i don't recognize that command ${phrases.bruh}`);
        return; 
    }
    
    //try to execute command
    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send(`sorry ${utils.phrases.bruh}, there was an error trying to execute that command`);
    }
});

const play = function(channel, voiceChannel, memeFilePath) { //whats wrong with me
    const playOptions = { volume: 1.0 };
    if (utils.dispatcherWrangler.playing) {
        stopPlaying();
    }
    voiceChannel.join()
        .then(function(connection) {
            //console.log('connection', connection);
            // memeDebug(channel, connection);
            // if ( memeFilePath != '1-second-of-silence' + media_suffix) {
            //     // console.log(memeFilePath);
            //     channel.send(`playing \`${memeFilePath}\` bruh`);
            // }
            utils.dispatcherWrangler.dispatcher = connection.play(config.muh_sounds_bruh_path + memeFilePath, playOptions);
            // dispatcherWrangler.dispatcher = connection.play(memeFilePath, playOptions);
            // dispatcherWrangler.dispatcher.on('finish', () => {
            //     stop();
            // });
            //console.log('dispatcher', dispatcherWrangler.dispatcher);
            // memeDebug(channel, dispatcher);
        }).catch(function(error) {
            channel.send(`couldn't join channel ${utils.phrases.bruh}`);
            console.error(error);
        });
    
};

client.on('voiceStateUpdate', (oldVoiceState, newVoiceState) => {
    const newUserChannel = newVoiceState.channel;
    const oldUserChannel = oldVoiceState.channel;
    // console.log('new: ', newUserChannel);
    // console.log('old: ', oldUserChannel)
    if (oldUserChannel === null && newUserChannel !== undefined) {
        //user joined a voice channel
        // console.log('entered voice channel');
        const username = newVoiceState.member.user.tag
        // console.log(username);
        for (entranceMeme of config.entranceMemes) {
            if (entranceMeme.username === username) {
                // console.log('matched user name!');
                client.channels.fetch(config.mememachineChannelId)
                    .then(function(channel) {
                        // console.log(entranceMeme.meme + config.media_suffix);
                        play(channel, newUserChannel, entranceMeme.meme + config.media_suffix);
                    }).catch(function(error) {
                        console.log('error fetching mememachine channel')
                        console.error(error.message);
                    });
            }
        }
    } else if (newUserChannel === null) {
        //cant really do anything useful since oldUserChannel = null;
        //user left a voice channel
        // console.log('left a voice channel');
        // client.channels.fetch(config.mememachineChannelId)
        //     .then(function(channel) {
        //         // console.log(entranceMeme.meme + config.media_suffix);
        //         play(channel, newUserChannel, 'dva-see-ya' + config.media_suffix);
        //     }).catch(function(error) {
        //         console.log('error fetching mememachine channel')
        //         console.error(error.message);
        //     });
    }
});

console.log('logging in...');
client.login(apiKeys.discordToken);