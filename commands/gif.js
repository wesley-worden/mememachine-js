const { giphyKey } = require('../api-keys.json');
const { wednesdayChannelId, gifRating } = require('../config.json'); //wednesday cars channel id
const { replyWithEmbeddedGif, phrases } = require('../utils');
const fetch = require('node-fetch');

const showGifError = function(channel, error) {
   channel.send(`${phrases.bruh} i wanted to find a gif for you but something went bad`);
   console.error(error);
}

module.exports = {
	name: 'gif',
	description: `posts gifs from giphy ${phrases.bruh}`,
	execute: function(message, args) {
        if (args.length === 0) {
            //message.channel.send('bruh i dont gif empty strings');
            //try to execute randomgif command
            message.client.commands.get('randomgif').execute(message, args);
            return;
        }
        const lastArg = args[args.length - 1];
        let offset = 0;
        //check if last arg is numeric
        if (!isNaN(lastArg) ) {
            //remove the last argument and set it to offset
            offset = args.pop();
        }
        const query = args.join(' ');
        const queryUrl = args.join('%20');
        const endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=${queryUrl}&limit=1&offset=${offset}&rating=${gifRating}`; //&lang=en`;
        const fetchOptions = { cache: 'no-cache' };
        //get gif
        fetch(endpoint, fetchOptions)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('giphy request failed');
        })
        .then(function(jsonResponse) {
            const data = jsonResponse['data'];
            if (data.length === 0) {
                message.channel.send(`no matching gif results ${phrases.bruh}`);
                return
            }
            const gifEmbedUrl = data[0]['images']['original']['url'];
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