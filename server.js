require('dotenv').config();  
const Discord = require("discord.js");

const responses = require("./responses.json");

const utilities = require("./misc/utilities");
const logger = utilities.getLogger();

const client = new Discord.Client();

client.on('ready', () => {
    console.info(`Logged in as ${client.user.tag}!`);
});

client.on("message", function(message) { 
    logger.info("incoming message on " + message.channel.name + " from " + message.author);
    if(message.author.bot) {
        logger.info("ignoring bot...");
        return;
    }
    let roleId = getRoleId(message.guild, "punching bag");
    let role = message.guild.roles.cache.get(roleId);
    logger.info("role id " + roleId);
    try {
        let author = message.author.username;

        if (message.content.startsWith('!jerkbot punchme')) {
            message.member.roles.add(role).catch(console.error);;
            message.channel.send("Well well... someone's feeling tough.");
        } else if (message.content.startsWith('!jerkbot uncle')) {
            message.member.roles.remove(role).catch(console.error);;
            message.channel.send("Toughen up, cupcake");
        } else if (message.content.startsWith('!jerkbot help')) {
            message.channel.send("Hey look! " + author + " needs instructions!!!\n*sigh*\njerkbot punchme|uncle");
        } else if(message.channel.name.includes("general")) {
            let messageBody = message.content;
            if(hasRoleByName(message.member, "punching bag")) {
                if(messageBody.toUpperCase().includes("MOONCAKES")) {
                    const person = message.author.username;
                    const msg = person + " demands mooncakes.";
                    console.log(msg);
                    message.channel.send(msg);
                    return;
                }
                // if so, determine if it is time to punch
                if(Math.random() <= process.env.DAMAGE_FREQUENCY) {
                    // pick a random response
                    let idx = Math.trunc(Math.random() * responses.length);
                    let punchString = responses[idx];
                    console.log(idx + " " + punchString);

                    logger.info(author + " IS a punching bag and got '" + punchString + "'");
                    if(punchString && punchString != "")
                        message.channel.send(punchString);
                    else {
                        logger.error(err);
                        message.channel.send("I'm supposed to say something snarky but I crashed instead :(");
                    }
                } else {
                    logger.info(author + " IS a punching bag but ducked");
                }
            } else {
                logger.info(author + " is NOT a punching bag");
            }
        }
    } catch(err) {
        logger.error(err);
        console.log(err);
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
