const { giphyKey } = require('../api-keys.json');
const { wednesdayChannelId } = require('../config.json'); //wednesday cars channel id
const { replyWithEmbeddedGif } = require('../utils');
const fetch = require('node-fetch');
module.exports = {
	name: 'gif',
	description: 'posts gifs from giphy bruh',
	execute: async function(message, args) {
        const lastArg = args[args.length - 1];
        let offset = 0;
        //check if last arg is numeric
        if ( !isNaN(lastArg) ) {
            //remove the last argument and set it to offset
            offset = args.pop();
        }
        const query = args.join(' ');
        const queryUrl = args.join('%20');
        const endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=${queryUrl}&limit=1&offset=${offset}&rating=PG-13&lang=en`;
        try {
            const response = await fetch(endpoint, {cache: 'no-cache'});
            if (!response.ok) {
                throw new Error('giphy request failed');
                return;
            }
            const jsonResponse = await response.json();
            //get gif url to embed
            const gifEmbedUrl = jsonResponse['data'][0]['images']['original']['url'];
            message.client.channels.fetch(wednesdayChannelId)
                .then(function(channel) {
                    replyWithEmbeddedGif(channel, gifEmbedUrl, `\`${query}\``);
                })
                .catch(function(error) {
                    throw error;
                });
        } catch (error) {
            message.channel.send('bruh i wanted to find a gif for you but something went bad');
            console.error(error);
        }
	}
};