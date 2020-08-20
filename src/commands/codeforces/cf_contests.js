const Commando = require("discord.js-commando");
const { RichEmbed } = require('discord.js');
const got = require('got');
const {formatContests} = require('../../util/messageFormatter');

class CfContestsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'cf_contests',
            group: 'codeforces',
            memberName: 'cf_contests',
            description: "Shows the upcoming/finished contests of codeforces.```!cf_contests``````!cf_contests \"upcoming\"/\"finished\"``````!cf_contests \"upcoming\"/\"finished\" \"gym\"```"
        });
    }

    async run(message, args) {
        if (!message.content.startsWith("!") || message.author.bot) return;
        
        args = args.split(" ");
        var ifGym = false;
        var ifUpcoming = true;
        if(args.length>0 &&  (args[0] == "gym" || args[1] == "gym")){
            ifGym = true;
        } 
        if(args.length>0 && (args[0] == "finished" || args[1] == "finished")){
            ifUpcoming = false;
        }
        
        try {
            const response = await got('https://codeforces.com/api/contest.list?gym='+ifGym);
            var contests = JSON.parse(response.body).result;
            if(contests.length>0){
                contests = formatContests(contests, ifUpcoming, ifGym);
                message.embed(contests);                                        
            } else{
                message.reply("sorry, can't find any contest.");
            }
        } catch (error) {
            console.log("Error: " + error.message);
            message.reply("sorry, something went wrong.\n```" + `Error :\n${error.message}` + "```");
        }
    }
}

module.exports = CfContestsCommand;