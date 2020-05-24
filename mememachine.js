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

client.on('voiceStateUpdate', (oldVoiceState, newVoiceState) => {
    const newUserChannel = newVoiceState.channel;
    const oldUserChannel = oldVoiceState.channel;
    if (oldUserChannel === null && newUserChannel !== undefined) {
        //user joined a voice channel
        const username = newVoiceState.member.user.tag
        // for (entranceMeme of config.entranceMemes) {
        for (let index = config.entranceMemes.length - 1; index >= 0; index--) { //why the fuck does this work
            const entranceMeme = config.entranceMemes[index];
            const meme = entranceMeme.memes[utils.randomIndex(entranceMeme.memes.length - 1)];
            if (entranceMeme.username === username) {
                client.channels.fetch(config.mememachineChannelId)
                    .then(function(channel) {
                        utils.play(channel, newUserChannel, meme + config.media_suffix);
                    }).catch(function(error) {
                        console.log('error fetching mememachine channel')
                        console.error(error.message);
                    });
            }
        }
    } else if (newUserChannel === null) {
        // user left a voice channel
        client.channels.fetch(config.mememachineChannelId)
            .then(function(channel) {
                if(utils.voiceWrangler.currentVoiceChannel !== null) {
                    const members = utils.voiceWrangler.currentVoiceChannel.members.map(member => (member));
                    //i have no idea why <= 1 works instaed of 0 and/or 1
                    if (members.length <= 1 && utils.voiceWrangler.currentVoiceChannel !== null) {
                        utils.voiceWrangler.currentVoiceChannel.leave();
                        utils.voiceWrangler.currentVoiceChannel = null;
                    } else {
                        utils.play(channel, utils.voiceWrangler.currentVoiceChannel, 'dva-see-ya' + config.media_suffix); 
                    }
                }
            }).catch(function(error) {
                console.log('error fetching mememachine channel')
                console.error(error.message);
            });
    }
});

console.log('logging in...');
client.login(apiKeys.discordToken);