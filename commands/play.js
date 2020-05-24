const { media_suffix, playThreshold } = require('../config.json');
const Fuse = require('fuse.js');
const { play, getMemeFilePaths, phrases } = require('../utils');

module.exports = {
	name: 'play',
	description: `plays memes bruh`,
	execute(message, args) {
        const channel = message.channel;
        if (args.length === 0) {
            channel.send(`you gotta specify a meme ${phrases.bruh}`);
            return;
        }
        let voiceChannel = null;
        if(!message.member.voice) {
            channel.send(`you gotta be in a voice channel first ${phrases.bruh}`);
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
                channel.send(`playing \`${args[0]}\` ${phrases.bruh}`); //why are you like this
                play(channel, voiceChannel, firstArgAsMemeFilePath);
                return;
            } 
        }
        const fuseOptions = { threshold: playThreshold };
        const query = args.join(' ');
        const fusedMemeFilePaths = new Fuse(memeFilePaths, fuseOptions);
        const memeResults = fusedMemeFilePaths.search(query);
        if (memeResults.length === 0) {
            channel.send(`no memes found ${phrases.bruh}`);
            return;
        }
        memeFilePath = memeResults[0].item;
        channel.send(`playing \`${memeFilePath.slice(0, -media_suffix.length)}\` ${phrases.bruh} `);
        play(channel, voiceChannel, memeFilePath);
	}
};