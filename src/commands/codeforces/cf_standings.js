const Commando = require("discord.js-commando");
const got = require('got');
const storage = require('../../util/storage');
const {formatStandings} = require('../../util/messageFormatter');

class CfStandingsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'cf_standings',
            group: 'codeforces',
            memberName: 'cf_standings',
            description: "Shows the standings of the registered users of the server on a specific contest.```!cf_standings contestId```"
        });
    }

    async run(message, args) {
        if (!message.content.startsWith("!") || message.author.bot) return;

        var contestId = parseInt(args);
        if (contestId > 0 && contestId <= 10000) {
            var handleList = storage.getHandleList(message.guild.id);
            if (handleList.length > 0) {
                try {
                    const response = await got('https://codeforces.com/api/contest.standings?contestId=' + contestId + '&from=1&count=' + handleList.length + '&handles=' + handleList.join(";") + '&showUnofficial=true');
                    var data = {
                        standings : JSON.parse(response.body).result.rows,
                        contest : JSON.parse(response.body).result.contest
                    }

                    if(data.standings && data.contest){
                        data = formatStandings(data);
                        message.embed(data);
                    } else{
                        message.reply("sorry, can't find the specified info.");
                    }
                } catch (error) {
                    console.log("Error: " + error.message);
                    message.reply("sorry, something went wrong.\n```" + `Error :\n${error.message}` + "```");
                }
            }
            else {
                message.reply("none from this server, is currently registered to the bot database. Try this to register yourself:```!register_cf your_cf_handle```");
            }
        }
        else {
            message.reply("try this instead:```!cf_standings contest_id```\nTo get contest_id, try these commands: (Depending on your query)```!cf_contests\n!cf_contests finished\n!cf_contests gym\n!cf_contests finished gym```");
        }
    }
}

module.exports = CfStandingsCommand;