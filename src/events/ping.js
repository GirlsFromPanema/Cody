const client = require("../index")
const { MessageEmbed } = require("discord.js")


const embed = new MessageEmbed()
.setTitle("Cody")
.setDescription("👋🏼 Hey! I'm **Cody!**\nMy prefix is `$` but you can change it trough my Dashboard\n\n**Bot Guide**:\nEnroll a Course using `$enroll` + a language of your Choice\nfor example Python! You may use `$courses` to see my current available Courses\nMake sure your DMs are open, I will DM you further informations to continue to the Course!\nOnce done, resume the enrolled Course with `$resume + course`\n\n**Useful Links**:\n[Website](https://cody-bot.xyz)\n[Dashboard](https://cody-bot/panel)\n[Support](https://discord.gg/PTzKRJhdub)\n[Contact](https://cody-bot.xyz/contact)\n\nThanks for using ❤️ [me](https://discord.com/oauth2/authorize?client_id=858311918447099925&scope=bot&permissions=270126169&response_type=code&redirect_uri=https://cody-bot.xyz/dashboard)")
.setColor("BLURPLE")

client.on("message", (message) => {
    if(message.mentions.has(client.user)) {
    message.channel.send(embed)
        
    }
})