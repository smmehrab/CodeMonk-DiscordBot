const fs = require('fs');
const jsonfile = require('jsonfile');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const dataPath = appDir + '\\data\\';

module.exports = {
    getHandle :  (guildId, username) => {
        var database = {};
        try {
            if (!fs.existsSync(dataPath)) {
                fs.mkdirSync(dataPath);
            }
        } catch (error) {
            console.log("sorry, something went wrong.\n```" + `Error :\n${error.message}` + "```");
            return null;
        }

        var databaseLocation = dataPath + guildId + ".json";
        if (fs.existsSync(databaseLocation)) {
            database = jsonfile.readFileSync(databaseLocation);
        }
    
        if (database) {
            for (var user in database) {
                if(database[user].username == username){
                    return database[user].cf_handle;
                }
            }
        }
    
        return null;
    },

    getHandleList : (guildId) => {
        var handleList = [];
        var database = {};
        
        try {
            if (!fs.existsSync(dataPath)) {
                fs.mkdirSync(dataPath);
            }
        } catch (error) {
            console.log("sorry, something went wrong.\n```" + `Error :\n${error.message}` + "```");
            return handleList;
        }
    
        var databaseLocation = dataPath + guildId + '.json';
        if (fs.existsSync(databaseLocation)) {
            database = jsonfile.readFileSync(databaseLocation);
        }
    
        if (database) {
            for (var user in database) {
                handleList.push(database[user].cf_handle);
            }
        }
    
        return handleList;
    }    
}