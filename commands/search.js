const { getMemeFilePaths, phrases } = require('../utils');
const Fuse = require('fuse.js');
const { searchThreshold } = require('../config.json');
module.exports = {
	name: 'search',
	description: `searches for memes ${phrases.bruh}`,
	execute(message, args) {
		const channel = message.channel;
        if (args.length === 0) {
            channel.send(`you gotta specify a search query ${phrases.bruh}`);
            return;
		}
		const query = args.join(' ');
		const memeFilePaths = getMemeFilePaths();
		const fuseOptions ={ threshold: searchThreshold };
		const fusedMemeFilePaths = new Fuse(memeFilePaths, fuseOptions);
        const memeResults = fusedMemeFilePaths.search(query);
        if (memeResults.length === 0) {
            channel.send(`no memes found ${phrases.bruh}`);
            return;
		}
		const memes = memeResults.map(function(memeResult) {
			return `\`${memeResult.item}\``;
		})
		//split into chunks
		const chunks = [];
		const chunkSize = 25;
		for (let index = 0; index < memes.length; index += chunkSize) {
			const chunk = memes.slice(index, index + chunkSize);
			chunks.push(chunk);
		}
		//display chunks
		channel.send(`${phrases.bruh} were you lookin for:`);
		for (let chunk of chunks) {
			const text = chunk.join('\n');
			channel.send(text);
		}

		//fuck chunks, go line by line
		// for (let meme of memes) {
		// 	const text = `\`${meme}\``;
		// 	channel.send(text);
		// }
	}
};