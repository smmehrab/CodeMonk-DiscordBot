// Imports
const Commando = require("discord.js-commando");
const got = require('got');
const storage = require('../../util/storage');
const {formatUserRatings, formatUserHistory} = require('../../util/messageFormatter');

class CfRatingsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'cf_ratings',
            group: 'codeforces',
            memberName: 'cf_ratings',
            description: "Shows the rating changes of the specific user/contest.```!cf_ratings``````!cf_ratings handle``````!cf_ratings contestId```",
        });
    }

    async run(message, args) {
        if (!message.content.startsWith("!") || message.author.bot) return;

        var params = args.length == 0 ? [] : args.split(" ");
        var handle;

        if (params.length == 0) {
            var handleList = storage.getHandleList(message.guild.id);
            if (handleList.length > 0) {
                try {
                    const response = await got("https://codeforces.com/api/user.info?handles=" + handleList.join(";"));
                    var userRatings = JSON.parse(response.body).result;
                    userRatings.reverse();
                    if (!userRatings) {
                        userRatings = [];
                    }

                    if (userRatings.length > 0) {
                        userRatings = formatUserRatings(userRatings);
                        message.embed(userRatings);
                    } else {
                        message.reply("sorry, no such info found.");
                    }
                } catch (error) {
                    console.log("Error: " + error.message);
                    message.reply("sorry, something went wrong.\n```" + `Error :\n${error.message}` + "```");
                }
            } else {
                message.reply("none from this server, is currently registered to the bot database. Try this to register yourself:```!register_cf your_cf_handle```");
            }
        } else {
            if (params[0] == "!self") {
                handle = storage.getHandle(message.guild.id, message.author.username);
            }
            else {
                handle = params[0];
            }

            if (handle) {
                try {
                    const response = await got("https://codeforces.com/api/user.rating?handle=" + handle);
                    var ratingChanges = JSON.parse(response.body).result;
                    if (!ratingChanges) {
                        ratingChanges = [];
                    }
                    ratingChanges.reverse();

                    if (ratingChanges.length > 0) {
                        ratingChanges = formatUserHistory(handle, ratingChanges);
                        message.embed(ratingChanges);
                    } else {
                        message.reply("sorry, no such info found.");
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
}

module.exports = CfRatingsCommand;