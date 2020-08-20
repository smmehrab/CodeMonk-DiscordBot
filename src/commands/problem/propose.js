// Imports
const Commando = require("discord.js-commando");
const { RichEmbed } = require('discord.js');
const https = require('https');
const path = require('path');

const fs = require('fs');
const jsonfile = require('jsonfile');
const appDir = path.dirname(require.main.filename);
const dataDir = appDir + '\\data\\';


class ProposeCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'propose',
            group: 'problem',
            memberName: 'propose',
            description: "To propose a problem to the community so that they can decide if that's interesting enough to get included to the problem list.```(Under Development)```",
        });
    }

    async run(message, args) {
        if (!message.content.startsWith("!") || message.author.bot) return;

        var params = args.split("\"");
        params.map(param => param.trim());

        var title = "Proposed";
        var link;

        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            if (validURL(param)) {
                link = param;
            } else {
                title += " - " + param;
            }
        }

        if (!link) {
            message.reply("sorry, the url that you provided for your problem, isn't valid. Please, provide a valid url. Don't forget to follow the proper syntax: ```!propose \"Problem Title\" problem_link```");
        } else {
            let embed = new RichEmbed()
                .setTitle(title)
                .setURL(link)
                .setDescription("");

            let confirm = await message.channel.send(embed);
            await confirm.react('✅');
            await confirm.react('❎');

            if (reaction.emoji.name === '✅') {
                let userVotes = new Map();
                let pollTally = new discord.Collection(pollOptions.map(o => [o, 0]));
                let pollFilter = m => !m.bot;
                let voteCollector = message.channel.createMessageCollector(pollFilter, {
                    time: 60000
                });
                userCreatedPolls.set(message.author.id, voteCollector);
                await processPollResults(voteCollector, pollOptions, userVotes, pollTally);
                let max = Math.max(...pollTally.array());
                console.log(pollTally.entries());
                let entries = [...pollTally.entries()];
                let winners = [];
                let embed = new discord.RichEmbed();
                let desc = '';
                entries.forEach(entry => entry[1] === max ? winners.push(entry[0]) : null);
                entries.forEach(entry => desc += entry[0] + " received " + entry[1] + " votes(s)\n");
                embed.setDescription(desc);

                if (winners.length === 1) {
                    message.channel.send(winners[0] + " is the winner!", embed);
                }
                else {
                    message.channel.send("We have a draw!", embed);
                }
            }
        }
    }
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}


function processPollResults(voteCollector, pollOptions, userVotes, pollTally) {
    return new Promise((resolve, reject) => {
        voteCollector.on('collect', msg => {
            let option = msg.content.toLowerCase();
            if (!userVotes.has(msg.author.id) && pollOptions.includes(option)) {
                userVotes.set(msg.author.id, msg.content);
                let voteCount = pollTally.get(option);
                pollTally.set(option, ++voteCount);
            }
        });
        voteCollector.on('end', collected => {
            console.log("Collected " + collected.size + " votes.");
            resolve(collected);
        })
    });
}

function getPollOptions(collector) {
    return new Promise((resolve, reject) => {
        collector.on('end', collected => resolve(collected.map(m => m.content.toLowerCase())));
    });
}

function delay(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time)
    })
}

module.exports = ProposeCommand;