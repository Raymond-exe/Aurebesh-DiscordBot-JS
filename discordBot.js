require('dotenv').config();
const { Client }  = require('discord.js');//.config();
const client = new Client()

var CMD_PREFIX = '~'
var BOT_PREFIX = '||ab'
var ERROR_LOG_CHANNEL_ID = '775936990419222539'
var AUREBESH_TRANSLATION_KEY = 'https://ootinicast.com/aurebesh/Aurebesh.png'

// On ready
client.on('ready', onBotReady)

// On message received
client.on('message', (messageEvent) => onMessageReceived(messageEvent));

// Bot login
client.login(process.env.DISCORD_JS_BOT_TOKEN)



/********** EVENT FUNCTIONS **********/



function onBotReady() {
    // DM me the version that booted up I guess?
}

function onMessageReceived(messageEvent) {
    try {
        message = messageEvent.content
    
        //if the message was sent by a bot, ignore it
        if(messageEvent.author.bot) {
            return
        }
    
        //if the message starts with the bot prefix
        if (message.indexOf(CMD_PREFIX)==0 && !message.startsWith("~~")) {

            // code below:
            // seperates message into string[] split by space characters (without cmd prefix)
            // then it assigns "command" properly and removes the first entry (the command) from the args array
            var args = message.substring(CMD_PREFIX.length).trim().split(' ')
            var command = args.shift()

            var response = "";

            switch(command) {
                case 'key':
                    response = {files: [AUREBESH_TRANSLATION_KEY]};
                    break;
                case 'help':
                    response = helpCmd() //TODO remove parameter when done
                    break;
                case 'quote': case 'quotes':
                    if(args.length > 0) {
                        messageEvent.channel.send("You've sent an argument!") //TODO remove after debugging
                        messageEvent.channel.send("Is argument number: " +  Number.isInteger(args[0]))
                        response = quoteCmd(parseInt(args[0]))
                    } else {
                        response = quoteCmd();
                    }
                    break;
                case 'v': case 'ver': case 'version':
                    response = 'version 210216.3' //TODO find a better way to do this lol
                    break;
                case 'meme': case 'memes':
                    response = {files: [memeCmd()]};
                    break;
                // case 'gif': case 'gifs':
                //     response = {files: []}; //TODO gif cmd
                //     break;
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
        
        //if the message contains "hello there", respond with "general kenobi"
        if (message.toLowerCase().indexOf("hello there") >= 0) {
            messageEvent.channel.send("https://tenor.com/view/hello-there-general-kenobi-star-wars-grevious-gif-17774326")
        }
    } catch (error) {
        messageEvent.channel.send("Uh oh! I ran into an error. Sorry for the inconvenience, why don't we try that again?")
        logError(error);
    }

}



/********** COMMAND FUNCTIONS  **********/



function helpCmd(channel) {
    var helpJson = require("./helpCommand.json");

    if(channel != undefined) { channel.send("retrieved helpCommand.json!"); } //debug

    /*
    const embed = new Client().MessageEmbed()
        .setTitle(helpJson.Title)
        //.setDescription(helpJson.Description)
        //.setThumbnail(client.user.avatarURL) //*/
    var embed = "**" + helpJson.Title + "**\n"  //TODO remove for embed
    embed += "*" + helpJson.Description + "*\n" //TODO remove for embed

    if(channel != undefined) { channel.send("embed built!"); } //debug
    
    var commands = Object.keys(helpJson.Commands)
    
    if(channel != undefined) { channel.send("Keys retrieved!"); } //debug

    embed += "```" //TODO remove for embed
    commands.forEach(cmd => {
        embed += CMD_PREFIX + cmd + " - " + helpJson.Commands[cmd] + "\n"; //TODO change for embed
        //embed.addField(cmd, helpJson.Commands[cmd], false)
    });
    embed += "```" //TODO remove for embed
    
    if(channel != undefined) { channel.send("Commands added!"); } //debug

    return embed;
}

function quoteCmd(selectedIndex) {
    var quotes = require("./quotes.json").quotes;

    if(selectedIndex == undefined || selectedIndex > quotes.length) {
        selectedIndex = Math.round(Math.random()*quotes.length)
    }

    var selectedQuote = quotes[selectedIndex]
    return "*\"" + selectedQuote.text + "\"*   " + (selectedQuote.author=="" ? "" : "**-"+selectedQuote.author + "**");
}

function memeCmd() {
    var imgLinks = require("./memes.json").memes
    var selectedIndex = Math.round(Math.random()*imgLinks.length)
    var selectedMeme = imgLinks[selectedIndex]
    return selectedMeme
}



/********** ADDITIONAL FUNCTIONS **********/



function logError(error) {
    var channels = client.channels

    var i;
    for(i = 0; i < channels.length; i++) {
        if(channels[i].id == ERROR_LOG_CHANNEL_ID) {
            channels[i].send("**Error:```" + error + "```");
            break;
        }
    }
}

function getTranslationLink(str) {
    var output = "https://everythingfonts.com/testdrive/hKenvRq3__Z8DBqPgUDqjgeF?text=";


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
