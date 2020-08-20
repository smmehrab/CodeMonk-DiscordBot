const { RichEmbed } = require('discord.js');
const timeconverter = require('./timeconverter');

const verdictMap = new Map([
    ["FAILED", "SF"],
    ["OK", "AC"],
    ["COMPILATION_ERROR", "CE"],
    ["RUNTIME_ERROR", "RE"],
    ["WRONG_ANSWER", "WA"],
    ["PRESENTATION_ERROR", "PA"],
    ["TIME_LIMIT_EXCEEDED", "TLE"],
    ["MEMORY_LIMIT_EXCEEDED", "MLE"],
    ["TESTING", "..."],
    ["REJECTED", "RJ"],
]);

module.exports = {
    formatUserDetails : (userDetails)=>{
        var description = `
            Rank : ${userDetails.rank}
            Rating : ${userDetails.rating} (max. ${userDetails.maxRating}, ${userDetails.maxRank})
            
            Contribution : ${userDetails.contribution}
            Organization : ${userDetails.organization}
            `;  
        
        return new RichEmbed()
        .setTitle(userDetails.handle)
        .setURL("https://codeforces.com/profile/" + userDetails.handle)
        .setDescription(description)
        .setThumbnail("https:"+userDetails.avatar)
        .setColor(0x00AE86)
        .setFooter('www.codeforces.com');
    }, 

    formatSubmissions : (submissions, ifDetails)=>{
        var description = "";
        var handle;
        for (var index = 0; index < Math.min(submissions.length, 10); index++) {
            var submission = submissions[index];
            var id = submission.id;
            var date = timeconverter.convertTimestamp(submission.creationTimeSeconds);
            var contestId = submission.problem.contestId;
            var problem = submission.problem.index + ". " + submission.problem.name;
            var author = submission.author.members[0].handle;
            handle = author;
            var participantType = submission.author.participantType;
            author += (participantType != "CONTESTANT") ? " *" : "";
            var passedCase = submission.passedTestCount;
            var verdict = verdictMap.get(submission.verdict);
            var time = submission.timeConsumedMillis + " ms";
            var memory = parseInt(parseInt(submission.memoryConsumedBytes) / 1024) + " KB";
    
            description += `\u200B\n**${author}** - [#${id}](https://codeforces.com/contest/${contestId}/submission/${id}/)`;
            description += "\u200B\n```YAML\n" + verdict + " | " + problem + "```";
    
            if ((verdict != "AC" && !ifDetails) || ifDetails) {
                description += "```brainfuck\n";
                if (ifDetails) {
                    description += "Date : " + date + "\n";
                    description += "Time : " + time + "\n";
                    description += "Memory : " + memory + "\n";
                }
                description += "Passed : " + passedCase + "\n";
                description += "```";
            }
        }
    
        return new RichEmbed()
            .setColor(0x00AE86)
            .setTitle("Submissions")
            .setURL('https://codeforces.com/sumissions/' + handle)
            .setDescription(description)
            .setFooter('www.codeforces.com');
    },

    formatStandings : (data) => {
        var standings = data.standings;
        var contest = data.contest;
    
        var description = "";
        for (var user = 0; user < standings.length; user++) {
            var handle = standings[user].party.members[0].handle;
            var participantType = standings[user].party.participantType.toLowerCase();
    
            var rank = standings[user].rank;
            var points = standings[user].points;
            var penalty = standings[user].penalty;
            
            var successfulHacks = standings[user].successfulHackCount;
            var unsuccessfulHacks = standings[user].unsuccessfulHackCount;
            var problemResults = standings[user].problemResults;
    
            description += "```YAML\n" + rank + ". " + handle + ((participantType=="contestant") ? "" : " *") + "```";
            description += "```brainfuck\n"; 
            for(var index=0; index<problemResults.length; index++){
                description += problemResults[index].points;
                description += (index==problemResults.length-1) ? "```" : " | ";
            }
            if(participantType=="contestant"){
                description += "```brainfuck\n";
                description += "Points : " + points + "\n";
                description += "Penalty: " + penalty + "\n";
                description += "Hacks : " + (successfulHacks - unsuccessfulHacks) + "```";
            }
        }
    
        return new RichEmbed()
        .setColor(0x00AE86)
        .setTitle(contest.name)
        .setDescription(description)
        .setURL('https://codeforces.com/contests/'+contest.id)
        .setFooter('www.codeforces.com');
    },

    formatUserHistory : (handle, ratingChanges) => {
        var description = "```brainfuck\nhandle | rank | change | final rating```";
        for (var index = 0; index < Math.min(ratingChanges.length, 10); index++) {
            var ratingChange = ratingChanges[index];
            var contestName = ratingChange.contestName;
            var contestId = ratingChange.contestId;
            var change = (ratingChange.newRating - ratingChange.oldRating);
            change = (change >= 0) ? ("+" + change) : change;
            var rating = ratingChange.newRating;
            var rank = ratingChange.rank;
    
            description += `\u200B\n[#${contestName}](https://codeforces.com/contest/${contestId}/)`;
            description += "\u200B\n```YAML\n" + handle + " | " + rank + " | " + change + " | " + rating + "```";
        }
    
        return new RichEmbed()
            .setColor(0x00AE86)
            .setTitle(handle + "'s Rating")
            .setURL("https://codeforces.com/contests/with/" + handle)
            .setDescription(description)
            .setFooter('www.codeforces.com');
    },

    formatUserRatings : (userRatings) => {
        var description = "```brainfuck\nhandle | rank | rating```";
        for (var index = 0; index < userRatings.length; index++) {
            var userRating = userRatings[index];
            description += "```yaml\n" + userRating.handle;
            description += " | " + userRating.rank + " | " + userRating.rating + " (max. " + userRating.maxRating + ")```";
        }
    
        return new RichEmbed()
            .setColor(0x00AE86)
            .setTitle("Codeforces Rating")
            .setURL("https://codeforces.com/ratings")
            .setDescription(description)
            .setFooter('www.codeforces.com');
    },

    formatContests : (contests, ifUpcoming, ifGym)=>{
        var title = ifUpcoming ? "Upcoming Contests" : "Finished Contests"
        var phase = ifUpcoming ? (ifGym? "CODING": "BEFORE") : "FINISHED";
        var contestCount = 0;
        var isInline;
    
        var embed = new RichEmbed()
        .setColor(0x00AE86)
        .setTitle(title)
        .setURL('https://codeforces.com/contests')
        .setFooter('www.codeforces.com');
    
        for(var i=0; i<20; i++){
            var contest = contests[i];
            if(phase==contest.phase){
                var name = (i==0) ? `\u200B\n**${contest.name}**\n` : `**${contest.name}**\n`;
                var time = (ifGym && !ifUpcoming) ? `` : `${timeconverter.convertTimestamp(contest.startTimeSeconds)}\n`;
                var id =  `ID : ${contest.id}\n`;
                var link = `[Enter](https://codeforces.com/contest/${contest.id})\u200B`;
        
                embed.addField(name, time + id + link);
                contestCount++;
                if(contestCount>9) {
                    break;
                }
            }
        }
    
        return embed;
    }
}