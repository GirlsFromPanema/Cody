const { Client, Message, MessageEmbed, Discord } = require('discord.js');
  
module.exports = {
    name: 'info',
    cooldown: 60,
    /** 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */
    run: async(client, message, args) => {
        
        const infoembed = new MessageEmbed()
        .setTitle("Cody Information")
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setColor("RANDOM")
        .setTimestamp()
        .setDescription(`Welcome ${message.author.username}, want to start to learn the huge World of Programming?\nBut you don't like to visit Websites or other Sources?\n\nThen **Cody** is exactly what you need! Learn popular Languages like **JavaScript**, **Python** and much more from the basic to the advanced Level\n\n[Invite](https://discord.com/oauth2/authorize?client_id=858311918447099925&scope=bot&permissions=270126169&response_type=code&redirect_uri=https://cody-bot.xyz/dashboard) | [Dashboard](https://cody-bot.xyz/panel) | [Status](https://cody-bot.xyz/status)`)
        

        message.channel.send({embed: infoembed})
    }
}