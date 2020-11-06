require('dotenv').config();
const { Client } = require('discord.js')//.config();
const client = new Client()

var BOT_PREFIX = '||ab'

// On ready
client.on('ready', () => {
    console.log('Logged in as @' + client.user.tag)
})

client.on('message', (messageEvent) => {
    message = messageEvent.content

    //if the message wasn't sent by a bot and it started with the right prefix
    if(!messageEvent.author.bot && message.indexOf(BOT_PREFIX)==0 && message.lastIndexOf('||')==message.length-2) {

        //if you can't delete the message, ask for perms
        if(!messageEvent.deletable) {
            messageEvent.channel.send('Oops! I need permission to delete messages in this channel in order to work properly. Thank you!')
            return
        }

        messageEvent.delete() //delete the message

        var textToTranslate = message.substring(4, message.length-2).trim() + ' -@' + messageEvent.author.username
        var translationLink = getTranslationLink(textToTranslate)
        messageEvent.channel.send(translationLink)
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