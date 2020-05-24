const { giphyKey } = require('../api-keys.json');
const { wednesdayChannelId, randomGifRating } = require('../config.json'); //wednesday cars channel id
const { replyWithEmbeddedGif } = require('../utils');
const fetch = require('node-fetch');

const showGifError = function(channel, error) {
   channel.send(`${phrases.bruh} i wanted to find a gif for you but something went bad`);
   console.error(error);
}

module.exports = {
	name: 'randomgif',
	description: 'posts a radom gif',
	execute(message, args) {
        const endpoint = `https://api.giphy.com/v1/gifs/random?api_key=${giphyKey}&tag=&rating=${randomGifRating}`;
        const fetchOptions = { cache: 'no-cache' };
        //get random gif
        fetch(endpoint, fetchOptions)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('giphy request failed');
        })
        .then(function(jsonResponse) {
            const gifEmbedUrl = jsonResponse['data']['images']['original']['url'];
            const title = jsonResponse['data']['title'];
            //now try to get channel
            message.client.channels.fetch(wednesdayChannelId)
            .then(function (wednesdayChannel) {
                replyWithEmbeddedGif(wednesdayChannel, gifEmbedUrl, `\`${title}\``);
            }).catch(function(error) {
                showGifError(message.channel, error);
            })
        })
        .catch(function(error) {
            showGifError(message.channel, error);
        });
	}
};