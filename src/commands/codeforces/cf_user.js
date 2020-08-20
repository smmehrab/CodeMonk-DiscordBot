const Commando = require("discord.js-commando");
const got = require('got');
const storage = require('../../util/storage');
const {formatUserDetails} = require('../../util/messageFormatter');

class CfUserCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'cf_user',
            group: 'codeforces',
            memberName: 'cf_user',
            description: "Shows the profile of a specific user.```!cf_user``````!cf_user !self``````!cf_user handle```"
        });
    }

    async run(message, args) {
        if (!message.content.startsWith("!") || message.author.bot) return;
        
        var handle;
        if(!args || args == "!self"){
            handle = storage.getHandle(message.guild.id, message.author.username);
        } else{
            handle = args;
        }

        if(handle){
            try {
                const response = await got('https://codeforces.com/api/user.info?handles='+handle);
                var userDetails = JSON.parse(response.body).result[0];
                if(userDetails){
                    userDetails = formatUserDetails(userDetails);
                    message.embed(userDetails);
                } else{
                    message.reply("sorry, can't find the specified user's info.");
                }
            } catch (error) {
                console.log("Error: " + error.message);
                message.reply("sorry, something went wrong.\n```" + `Error :\n${error.message}` + "```");
            }
        } else{
            message.reply("sorry, you haven't registered your cf_handle yet. To Register:\n```yaml\n!register_cf your_cf_handle```");
        }
    }
}

module.exports = CfUserCommand;
