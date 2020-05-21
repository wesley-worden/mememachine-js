console.log('*begins screaching*');

const Discord = require('discord.js');
const utils = require('./utils');
const fs = require('fs'); //for file system stuff
const path = require('path'); //paths for file system stuff

//make the client
const client = new Discord.Client();

console.log('loading config.json...');
const config = require('./config.json');
console.log('loading api-keys.json...');
const apiKeys = require('./api-keys.json');

console.log('time to rustle up some commands...');
client.commands = new Discord.Collection();
utils.loadCommands(client);

client.on('ready', function () {
    console.log(`logged in as ${client.user.tag} bruh`);
});

client.on('message', function (message) {
    //ignore most messages
    if (message.author.tag === client.user.tag || //messages from self
        message.author.bot || //other bots
        !message.content.startsWith(config.prefix) //not a command
        ) { return; } //ignore message
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    //check for command
    if (!client.commands.has(command)) { 
        console.log(`no matching command for ${command}`);
        message.reply("i don't recognize that command bruh");
        return; 
    }
    //try to execute command
    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('sorry bruh, there was an error trying to execute that command');
    }
});

console.log('logging in...');
client.login(apiKeys.discord);