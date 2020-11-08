require('dotenv').config();
const { Client } = require('discord.js')//.config();
const client = new Client()

var CMD_PREFIX = '~'
var BOT_PREFIX = '||ab'

// On ready
client.on('ready', () => {
    console.log('Logged in as @' + client.user.tag)
})

client.on('message', (messageEvent) => {
    message = messageEvent.content

    //if the message wasn't sent by a bot and it started with the right prefix
    if(!messageEvent.author.bot) {

        //if the message starts with the bot prefix
        if (message.indexOf(CMD_PREFIX)==0) {

            var command = message.substring(1, command, command.length)
            messageEvent.channel.send('1: ' + command)
            command = command.trim().substring(0, command.indexOf(' '))
            messageEvent.channel.send('2: ' + command)
            var response = "";


            switch(command) {
                case 'key':
                    response = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.explicit.bing.net%2Fth%3Fid%3DOIP.Y1Xg_WAVI6L2KZr4PrLqcgHaGE%26pid%3DApi&f=1';
                    break;
                case 'help':
                    response = 'help cmd WIP lol'; //TODO make the help command
                    break;
                case 'version':
                    response = 'version 201108.0.0'
                    break;
                default:
                    response = 'Command not recognized. Use ' + CMD_PREFIX + 'help to see all commands!';
            }

            messageEvent.channel.send(response);

            return
        } else // don't worry, this else links to the next if
        // if the message starts with the translation prefix
        if (message.indexOf(BOT_PREFIX)==0 && message.lastIndexOf('||')==message.length-2) {
            //if you can't delete the message, ask for perms
            if(!messageEvent.deletable) {
                messageEvent.channel.send('Oops! I need permission to delete messages in this channel in order to work properly. Thank you!')
                return
            }
    
            var textToTranslate = message.substring(4, message.length-2).trim() + ' -@' + messageEvent.author.username
            var translationLink = getTranslationLink(textToTranslate)
            messageEvent.channel.send(translationLink)
            
            messageEvent.delete() //delete the message

            return
        }
    }

})


client.login(process.env.DISCORD_JS_BOT_TOKEN)



/********** FUNCTIONS **********/



function getTranslationLink(str) {
    var output = "https://everythingfonts.com/testdrive/hKenvRq3__Z8DBqPgUDqjgeF?text=";


    var i, c
    for(i = 0; i < str.length; i++) {
        c = str.charAt(i)

        if (    (c >= 'a' && c <= 'z') ||
			    (c >= 'A' && c <= 'Z') ||
                (c >= '0' && c <= '9')
            ) {
            output = output + c
		} else {
            c = str.charCodeAt(i)
            output = output + '%' + c.toString(16)
        }
    }

    return output
}