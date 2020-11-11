require('dotenv').config();
const { Client } = require('discord.js')//.config();
const client = new Client()

var CMD_PREFIX = '~'
var BOT_PREFIX = '||ab'

// On ready
client.on('ready', onBotReady)

// On message received
client.on('message', (messageEvent) => { onMessageReceived(messageEvent) })

// Bot login
client.login(process.env.DISCORD_JS_BOT_TOKEN)



/********** EVENT FUNCTIONS **********/



function onBotReady() {
    // DM me the version that booted up I guess?
}

function onMessageReceived(messageEvent) {
    message = messageEvent.content

    //if the message wasn't sent by a bot and it started with the right prefix
    if(!messageEvent.author.bot) {

        //if the message starts with the bot prefix
        if (message.indexOf(CMD_PREFIX)==0) {

            var command = message.substring(1).trim()
            command = command.substring(0, command.indexOf(' ')>0 ? command.indexOf(' ') : command.length)
            var response = "";

            switch(command) {
                case 'key':
                    response = {files: ["https://ootinicast.com/aurebesh/Aurebesh.png"]};
                    break;
                case 'help':
                    response = helpCmd()
                    break;
                case 'quote':
                    response = quoteCmd()
                    break;
                case 'version':
                    response = 'version 201110.0' //TODO find a better way to do this lol
                    break;
                default:
                    response = 'Command \"' + CMD_PREFIX + command + '\" not recognized. Use ' + CMD_PREFIX + 'help to see all commands!';
            }

            messageEvent.channel.send(response);

            return
        }

        //if the message starts with the translation prefix and is spoiler tagged
        if (message.indexOf(BOT_PREFIX)==0 && message.lastIndexOf('||')==message.length-2) {
            //if you can't delete the message, ask for perms
            if(!messageEvent.deletable) {
                messageEvent.channel.send('Oops! I need permission to delete messages in this channel in order to work properly. Thank you!')
                return
            }
    
            var textToTranslate = message.substring(BOT_PREFIX.length, message.length-2).trim() + ' -@' + messageEvent.author.username
            
            messageEvent.channel.send(getTranslationLink(textToTranslate))
            messageEvent.delete() //delete the message

            return
        }
    }

}



/********** COMMAND FUNCTIONS  **********/



function helpCmd() {
    var helpJson = require("./helpCommand.json");

    const embed = new Client().MessageEmbed()
        .setTitle(helpJson.Title)
        .setDescription(helpJson.Description)
        .setThumbnail(client.user.avatarURL)

    var commands = Object.keys(helpJson.Commands)

    commands.forEach(cmd => {
        embed.addField(cmd, helpJson.Commands[cmd], false)
    });

    return embed;
}

function quoteCmd(channel) {
    var quotes = require("./quotes.json").quotes;
    var selectedIndex = Math.round(Math.random()*quotes.length)
    var selectedQuote = quotes[selectedIndex]
    return "*\"" + selectedQuote.text + "\"* " + (selectedQuote.author=="" ? "" : "**-"+selectedQuote.author + "**");
}

function getTranslationLink(str) {
    var output = "https://everythingfonts.com/testdrive/hKenvRq3__Z8DBqPgUDqjgeF?filetype=png&text=";


    // Loop through the provided string
    // If it's alphanumeric, add it to the given link
    // If it's not, add '%' + the hex code instead
    var i, c
    for(i = 0; i < str.length; i++) {
        c = str.charCodeAt(i)
        output = output + '%' + c.toString(16)
    }

    //return the link
    return output
}