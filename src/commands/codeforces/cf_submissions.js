const Commando = require("discord.js-commando");
const got = require('got');
const storage = require('../../util/storage');
const {formatSubmissions} = require('../../util/messageFormatter');

class CfSubmissionsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'cf_submissions',
            group: 'codeforces',
            memberName: 'cf_submissions',
            description: "Shows the submission history of the specific user/contest (Or both).```!cf_submissions``````!cf_submissions handle``````!cf_submissions handle contestId```"
        });
    }

    async run(message, args) {
        if (!message.content.startsWith("!") || message.author.bot) return;

        var params = args.split(" ");
        var handle;
        var contest_id;
        var ifDetails = false;
        if (params.includes("!details")) {
            ifDetails = true;
        }

        if (args.length == 0 || params[0] == "!self" || params[0] == "" || (parseInt(params[0]) > 0 && parseInt(params[0]) < 10000)) {
            handle = storage.getHandle(message.guild.id, message.author.username);
        } else {
            handle = params[0];
        }

        if (parseInt(params[0]) > 0 && parseInt(params[0]) < 10000) {
            contest_id = params[0];
        } else if (parseInt(params[1]) > 0 && parseInt(params[1]) < 10000) {
            contest_id = params[1];
        } else {
            contest_id = -1;
        }

        if (handle) {
            try {
                const response = await got("https://codeforces.com/api/" + (contest_id == -1 ? "user" : "contest") + ".status?" + (contest_id == -1 ? "" : ("contestId=" + contest_id)) + '&from=1&count=10&handle=' + handle);
                var submissions = JSON.parse(response.body).result;
                if (submissions) {
                    submissions = formatSubmissions(submissions, ifDetails);
                    message.embed(submissions);
                } else{
                    message.reply("sorry, there are no such submissions.")
                }
            } catch (error) {
                console.log("Error: " + error.message);
                message.reply("sorry, something went wrong.\n```" + `Error :\n${error.message}` + "```");
            }
        } else {
            message.reply("sorry, you haven't registered your cf_handle yet. To Register:\n```yaml\n!register_cf your_cf_handle```");
        }
    }
}

module.exports = CfSubmissionsCommand;