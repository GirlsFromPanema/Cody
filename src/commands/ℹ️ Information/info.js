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
        .setDescription(`Welcome ${message.author.username}, want to start to learn the huge World of Programming?\nBut you don't like to visit Websites or other Sources?\n\nThen **Cody** is exactly what you need! Learn popular Languages like **JavaScript**, **Python** and much more from the basic to the advanced Level\n\n[Invite](https://discord.com/api/oauth2/authorize?client_id=858311918447099925&permissions=141667728625&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Finvite&scope=bot) | [Dashboard](https://cody.gg) | [Status](https://cody.gg/status)`)
        

        message.channel.send({embed: infoembed})
    }
}