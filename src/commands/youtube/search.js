// Imports
const Commando = require("discord.js-commando");
const { User } = require("discord.js");

class SearchCommand extends Commando.Command{
    constructor(client){
        super(client, {
            name: 'search',
            group: 'youtube',
            memberName: 'search',
            description: 'search on youtube'
        });
    }

    async run(message, args){
        message.reply("Here is your info...");
    }
}

module.exports = SearchCommand;
