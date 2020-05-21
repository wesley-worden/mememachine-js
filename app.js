console.log('*begins screaching*');

const Discord = require('discord.js');
const fs = require('fs'); //for file system stuff
const path = require('path'); //paths for file sytstem stuff

console.log('loading config.json...');
const config = require('./config.json');

console.log('loading api-keys.json...');
const apiKeys = require('./api-keys.json');

//<--globals-->
const pingPongBruhToggle = { //toggle that toggles when state is accesed
    _state: (Math.random() >= 0.5), // initialized to random boolean
    get state() {
        return this._state ^= true; //is this really better than foo != foo bruh
    }
}
//<--end globals-->


//make the client
const client = new Discord.Client();

client.on('ready', function () {
    console.log(`logged in as ${client.user.tag} bruh`);
});

client.on('message', function (message) {
    if (message.content === 'ping') {
        message.reply(pingPongBruhToggle.state ? 'pong bruh' : 'bruh, pong');
    }
});

console.log('logging in...');
client.login(apiKeys.discord);