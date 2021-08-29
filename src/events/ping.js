const client = require("../index")
const { MessageEmbed } = require("discord.js")


const embed = new MessageEmbed()
.setTitle("Cody | Ping")
.setDescription("Hey! I'm Cody! My prefix is `$` but you can change it trough my Dashboard\n\n**Bot Guide**: Enroll a Course using `$enroll` + a language of your Choice, for example Python!\nMake sure your DMs are open, I will DM you further informations to continue to the Course!\nOnce done, resume the enrolled Course with `$resume + course`\n\nUseful Links:\n[Website](https://cody-bot.xyz)\n[Dashboard](https://cody-bot/panel)\n[Support](https://discord.gg/PTzKRJhdub)\n[Contact](https://cody-bot.xyz/contact)\n\nThanks for using [me](https://discord.com/oauth2/authorize?client_id=858311918447099925&scope=bot&permissions=270126169&response_type=code&redirect_uri=https://cody-bot.xyz/dashboard)")


client.on("message", (message) => {
    if(message.mentions.has(client.user)) {
    message.channel.send(embed)
        
    }
})