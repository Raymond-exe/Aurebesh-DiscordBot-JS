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

            var command = message.substring(1).trim()
            command = command.substring(0, command.indexOf(' ')>0 ? command.indexOf(' ') : command.length)
            var response = "";

            switch(command) {
                case 'key':
                    response = {files: ["https://ootinicast.com/aurebesh/Aurebesh.png"]};
                    //alt link:
                    //'https://4.bp.blogspot.com/_eHPoZlMooF4/SLzo0MdZXZI/AAAAAAAAAEc/eWHKMH4GY3w/w1200-h630-p-k-no-nu/The+Aurebesh.bmp';
                    break;
                case 'help':
                    response = '**This is a temporary menu. Remind me to fix it lol.**\nCommands: `~help`, `~key`'; //TODO make the help command
                    break;
                case 'version':
                    response = 'version 201108.0.6' //TODO find a better way to do this lol
                    break;
                default:
                    response = 'Command not \"' + CMD_PREFIX + command + '\"recognized. Use ' + CMD_PREFIX + 'help to see all commands!';
            }

            messageEvent.channel.send(response);

            return
        }

        //if the message starts with the translation prefix
        if (message.indexOf(BOT_PREFIX)==0 && message.lastIndexOf('||')==message.length-2) {
            //if you can't delete the message, ask for perms
            if(!messageEvent.deletable) {
                messageEvent.channel.send('Oops! I need permission to delete messages in this channel in order to work properly. Thank you!')
                return
            }
    
            var textToTranslate = message.substring(4, message.length-2).trim() + ' -@' + messageEvent.author.username
            var translationLink = {files: [getTranslationLink(textToTranslate)]}
            var file = translationLink.files[0] + '.png'
            messageEvent.channel.send(file)
            
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