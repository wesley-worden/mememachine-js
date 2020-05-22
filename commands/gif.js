const { giphyKey } = require('../api-keys.json');
const { wednesdayChannelId } = require('../config.json'); //wednesday cars channel id
const { replyWithEmbeddedGif } = require('../utils');
const fetch = require('node-fetch');

const showGifError = function(channel, error) {
   channel.send('bruh i wanted to find a gif for you but something went bad, i am still bad at this');
   console.error(error);
}
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
        fetchOptions = { cache: 'no-cache' };
        fetch(endpoint, fetchOptions)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('giphy request failed');
        })
        .then(function (jsonResponse) {
            const gifEmbedUrl = jsonResponse['data'][0]['images']['original']['url'];
            //now try to get channel
            message.client.channels.fetch(wednesdayChannelId)
            .then(function (wednesdayChannel) {
                replyWithEmbeddedGif(wednesdayChannel, gifEmbedUrl, `\`${query}\``);
            }).catch(function(error) {
                showGifError(message.channel, error);
            });
        })
        .catch(function(error) {
            showGifError(message.channel, error);
        });
	}
};