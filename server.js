require('dotenv').config();  
const Discord = require("discord.js");

const responses = require("./responses.json");

const utilities = require("./misc/utilities");
const logger = utilities.getLogger();

const client = new Discord.Client();

client.on("message", function(message) { 
    try {
        let author = message.author.username;
        let messageBody = message.content;

        let roleId = getRoleId(message.guild, "punching bag");
        logger.info("role id " + roleId);

        let isPunchingBag = hasRoleByName(message.member, "punching bag");
        if(isPunchingBag) {
            // if so, determine if it is time to punch
            if(Math.random() <= process.env.DAMAGE_FREQUENCY) {
                // pick a random response
                let idx = Math.trunc(Math.random() * responses.length);
                let punchString = responses[idx];
                console.log(idx + " " + punchString);

                logger.info(author + " IS a punching bag and got '" + punchString + "'");
                if(punchString && punchString != "")
                    message.channel.send(punchString);
                else
                    message.channel.send("I'm supposed to say something snarky but I crashed instead :(");
        
            } else {
                logger.info(author + " IS a punching bag but ducked");
            }
        } else {
            logger.info(author + " is NOT a punching bag");
        }
    } catch(err) {
        logger.error(err);
        message.channel.send("I'm supposed to say something snarky but I crashed instead :(");
    }
});   

client.login(process.env.BOT_TOKEN);

function getRoleId(server, roleLabel) {
    var roleId = "";
    server.roles.cache.each(role => {
        if(role.name == roleLabel) {
            var r1 = "" + role.name;
            var r2 = "" + roleLabel;
            if(r1 == r2 && roleId == "") {
                roleId = role.id;
            }
            
        }
    });
    return roleId;
}

function hasRoleByName(member, roleName) {
    var found = false;
    member.roles.cache.each(role => {
        // have to force these both to cast as strings for comparison
        // TODO: find a better way to do this
        var r1 = "" + role.name;
        var r2 = "" + roleName;
        if(r1 == r2) {
            found = true;
        }
    });
    return found;
}
