const { getMemeFilePaths } = require('../utils');
const Fuse = require('fuse.js');
module.exports = {
	name: 'search',
	description: 'searches for memes bruh',
	execute(message, args) {
		const channel = message.channel;
        if (args.length === 0) {
            channel.send('you gotta specify a search query bruh');
            return;
		}
		const query = args.join(' ');
		const memeFilePaths = getMemeFilePaths();
		const fuseOptions ={ threshold: 0.4 };
		const fusedMemeFilePaths = new Fuse(memeFilePaths, fuseOptions);
        const memeResults = fusedMemeFilePaths.search(query);
        if (memeResults.length === 0) {
            channel.send('no memes found bruh');
            return;
		}
		const memes = memeResults.map(function(memeResult) {
			return memeResult.item;
		})
		//split into chunks
		const chunks = [];
		const chunkSize = 25;
		for (let index = 0; index < memes.length; index += chunkSize) {
			const chunk = memes.slice(index, index + chunkSize);
			chunks.push(chunk);
		}
		//display chunks
		channel.send('bruh were you lookin for:');
		for (const chunk of chunks) {
			const text = `\`\`\`\n${chunk.join('\n')}\n\`\`\``;
			channel.send(text);
		}
	}
};