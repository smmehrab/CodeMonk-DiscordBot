<br />
<p align="center">
    <img src="assets/logo.png" alt="Logo" width="200" height="auto">
</p>
<h3 align="center">CodeMonk - Discord Bot</h3>
<br />

<bold>A Discord Bot for Small Competitive Programming Communities</bold> so that they may keep track of their ratings, solve, submissions etc and also manage the shared problems in a more easy and convenient manner.

It's inspired from another discord bot named [TLE](https://github.com/cheran-senthil/TLE), which I was originally trying to install on our server of a small group of improving problem solvers. Somehow, silly me, found it hard to install that bot, as my app was showing some error. But I loved their work and thought I can make one of my own too, based on my own needs.

Hope, I will keep improving this bot as I climb up the ladders of learning problem solving skills in the near future. Any kind of help in both the scenario will be highly appreciated and something, I will forever be grateful to. Up for a long journey. Cheers!

<br>

# Installation

Not quite there yet.

<br>

# Commands

To run a command in any server, use ```@CodeMonk#3112``` ```command```. For example, ```@CodeMonk#3112``` ```!cf_user```.
To run a command in this DM, simply use command with no prefix.

<br>

## Codeforces API


**!register_cf** 

To register user's codeforces handle to his/her discord username.
```
!register_cf codeforces_handle
```

**!cf_contests**  

Shows the upcoming/finished contests of codeforces.

```
!cf_contests
!cf_contests "upcoming"/"finished"
!cf_contests "upcoming"/"finished" "gym"
```

**!cf_ratings** 

Shows the rating changes of the specific user/contest.
```
!cf_rating
!cf_rating handle
!cf_rating contestId
```

**!cf_standings**

Shows the standings of the registered users of the server on a specific contest.

```
!cf_standings contestId
```

**!cf_submissions**

Shows the submission history of the specific user/contest (Or both).

```
!cf_submissions
!cf_submissions handle
!cf_submissions handle contestId
```

**!cf_user** 

Shows the profile of a specific user.
```
!cf_user
!cf_user !self
!cf_user handle
```

<br>

## Youtube API

Working on...

<br>

## Problem Management

Working on...

- Proposing a problem to the community
- Adding interesting problem to the queue based on community respons

<br>

## Utility

**!help** 

Displays a list of available commands, or detailed information for a specified command.

**!prefix** 

Shows or sets the command prefix.

**!ping** 

Checks the bot's ping to the Discord server.

**!eval** 

Executes JavaScript code.