const { muh_sounds_bruh_path, media_suffix, playThreshold } = require('../config.json');
const fs = require('fs');
const Fuse = require('fuse.js');
const { memeDebug, getMemeFilePaths, dispatcherWrangler, stop } = require('../utils');

//let playing = false;
//let dispatcher = null;
//const stop = function() {
//    dispatcher.destroy();
//    playing = false;
//}
const tempMemeFilePath = '/home/pepesilvia/mememachine/muh_sounds_bruh/letmeinmp3.mp3';
const play = function(channel, voiceChannel, memeFilePath) {
    const playOptions = { volume: 1.0 };
    if (dispatcherWrangler.playing) {
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
            dispatcherWrangler.dispatcher = connection.play(muh_sounds_bruh_path + memeFilePath, playOptions);
            // dispatcherWrangler.dispatcher = connection.play(memeFilePath, playOptions);
            // dispatcherWrangler.dispatcher.on('finish', () => {
            //     stop();
            // });
            //console.log('dispatcher', dispatcherWrangler.dispatcher);
            // memeDebug(channel, dispatcher);
        }).catch(function(error) {
            channel.send("couldn't join channel bruh");
            console.error(error);
        });
    
};

module.exports = {
	name: 'play',
	description: 'plays memes bruh',
	execute(message, args) {
        const channel = message.channel;
        if (args.length === 0) {
            channel.send('you gotta specify a meme bruh');
            return;
        }
        let voiceChannel = null;
        if(!message.member.voice) {
            channel.send('you gotta be in a voice channel first bruh');
            return;
        }
        voiceChannel = message.member.voice.channel;
        //console.log('voiceChannel', voiceChannel);
        const memeFilePaths = getMemeFilePaths();
        if (args.length === 1) {
            if (args[0] === '1-second-of-silence') {
                play(channel, voiceChannel, args[0] + media_suffix);
                return;
            }
            const firstArgAsMemeFilePath = args[0] + media_suffix; //assume meme trying to play is correct
            if (memeFilePaths.includes(firstArgAsMemeFilePath)) { //meme not in folder
                channel.send(`playing \`${args[0]}\` bruh`); //why are you like this
                play(channel, voiceChannel, firstArgAsMemeFilePath);
                return;
            } 
        }
        const fuseOptions = { threshold: playThreshold };
        const query = args.join(' ');
        const fusedMemeFilePaths = new Fuse(memeFilePaths, fuseOptions);
        const memeResults = fusedMemeFilePaths.search(query);
        if (memeResults.length === 0) {
            channel.send('no memes found bruh');
            return;
        }
        memeFilePath = memeResults[0].item;
        channel.send(`playing \`${memeFilePath.slice(0, -media_suffix.length)}\` bruh`);
        play(channel, voiceChannel, memeFilePath);
	}
};