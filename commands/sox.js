const { muh_sounds_bruh_path, media_suffix, playThreshold } = require('../config.json');
const { play, phrases, memeDebug, getMemeFilePaths, stop } = require('../utils');
const { spawn } = require('child_process');

module.exports = {
	name: 'sox',
	description: `plays memes with sox options bruh`,
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
        let firstArgAsMemeFilePath = args.shift();
        if (firstArgAsMemeFilePath.includes(media_suffix)) {
            firstArgAsMemeFilePath = firstArgAsMemeFilePath.slice(0, -media_suffix.length);
        }
        firstArgAsMemeFilePath += media_suffix; //assume meme trying to play is correct

        if (!memeFilePaths.includes(firstArgAsMemeFilePath)) { //meme not in folder
            channel.send('first argument must be the exact meme name');
            return;
        }
        let soxArgs = args;
        console.log(JSON.stringify(soxArgs));
        soxArgs.unshift('/tmp/meme' + media_suffix);
        soxArgs.unshift(muh_sounds_bruh_path + firstArgAsMemeFilePath);
        //play meme with arguments
        // const soxSpawn = spawn('ls', []);
        const soxSpawn = spawn('sox', soxArgs);
        soxSpawn.stdout.on("data", data => {
            console.log(`stdout: ${data}`);
        });
        soxSpawn.stderr.on("data", data => {
            console.log(`stderr: ${data}`);
        });
	    soxSpawn.on("error", error => {
            console.log(`error: ${error.message}`);
        });
        soxSpawn.on('close', code => {
            console.log(`sox process exited with code ${code}`);
            if(code === 0) {
                channel.send(`playing your soxxxed \`${firstArgAsMemeFilePath.slice(0, -media_suffix.length)}\` ${phrases.bruh}`);
                play(channel, voiceChannel, '/tmp/meme' + media_suffix);
            }
        });
    }
};