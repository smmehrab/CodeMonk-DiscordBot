// Imports
const Commando = require("discord.js-commando");
const { RichEmbed } = require('discord.js');
const https = require('https');
const path = require('path');
const fs = require('fs');
const jsonfile = require('jsonfile');
const appDir = path.dirname(require.main.filename);
const dataDir = appDir + '\\data\\';

class RegisterCfCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'register_cf',
            group: 'register',
            memberName: 'register_cf',
            description: "To register the specified codeforces handle to the bot, so that it can associate that with your discord id.```!register_cf your_codeforces_handle```"
        });
    }

    async run(message, args) {
        if (!message.content.startsWith("!") || message.author.bot) return;
        var handle = args;

        var database = {};
        var databaseLocation = appDir + '\\data\\' + message.guild.id + '.json';

        try {
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir);
                console.log("Directory is Created.");
            } else {
                console.log("Directory Already Exists.");
            }
        } catch (err) {
            message.reply("sorry, something went wrong.\n```" + `Error :\n${error.message}` + "```");
        }

        if(fs.existsSync(databaseLocation)){
            database = jsonfile.readFileSync(databaseLocation);
            console.log("Guild Database is Created.");
            console.log(database);
        } else{
            console.log("Guild Database Already Exists");
        }

        database[message.author.id] = {
            username : message.author.username,
            cf_handle : handle
        }
        console.log(database);

        jsonfile.writeFileSync(databaseLocation, database);
        message.reply("you are successfully registered as " + handle + ".");

        // const filter = m => m.content.includes('');
        // message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
        // .then(collected => {
        //     message.channel.send(`${collected.first()}`);
        // })
        // .catch(error => {
        //     message.channel.send(error);
        // });

        // if(args.length>0){
        //     var handle = args;
        //     https.get('https://codeforces.com/api/user.info?handles='+handle, (resp) => {
        //         let data = '';
    
        //         // A chunk of data has been recieved.
        //         resp.on('data', (chunk) => {
        //             data += chunk;
        //         });
    
        //         // The whole response has been received. Print out the result.
        //         resp.on('end', () => {
        //             var received = JSON.parse(data).result;
        //             if(received){
        //                 var info = received[0];
        
        //                 var description = ``;
        //                 description += `Rank : ${info.rank}\n`;
        //                 description += `Rating : ${info.rating} (max. ${info.maxRating}, ${info.maxRank})\n\n`;
        //                 description += `Contribution : ${info.contribution}\n`
        //                 description += `Organization : ${info.organization}\n`;  
                        
        //                 // message.guild.channels.find(channel => channel.name === "codemonk-lab").id;
        //                 var embed = new RichEmbed()
        //                 .setTitle(info.handle)
        //                 // .addField(`${info.rating}, ${info.rank}`, `(max. ${info.maxRating}, ${info.maxRank})`, true)
        //                 .setDescription(description)
        //                 .setThumbnail("https:"+info.avatar)
        //                 .setColor(0x00AE86)
        //                 .setFooter('www.codeforces.com');
                        
        //                 message.embed(embed);
        //             } else{
        //                 message.reply("sorry, can't find the specified user's info.");
        //             }
        //         });
    
        //     }).on("error", (error) => {
        //         console.log("Error: " + error.message);
        //         message.reply("sorry, something went wrong.\n```" + `Error :\n${error.message}` + "```");
        //     });
        // }
        // else{
        //     message.reply("try this instead.\n```!cf_user_info handle```");
        // }     
    }
}

module.exports = RegisterCfCommand;
