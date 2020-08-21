const Commando = require("discord.js-commando");
const path = require('path');
const config = require('./config.json');
const fs = require('fs');

const client = new Commando.Client({
    owner: process.env.clientId
});

client.registry
    .registerGroups([
        ['codeforces', 'Codeforces Commands'],
        ['youtube', 'Youtube Commands'],
        ['register', 'Register Commands'],
        ['problem', 'Problem Commands'],
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(process.env.token);