const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: "Display a Discord Users Avatar",
    category: '📚 Utility',
    aliases: "av",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {

        if(!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        if (
          !message.guild.me.hasPermission([
            "EMBED_LINKS",
            "ADD_REACTIONS",
            "SEND_MESSAGES",
            "READ_MESSAGE_HISTORY",
            "VIEW_CHANNEL",
          ])
        ) {
          return message.channel.send(`
            ❌ I require some Permissions!
      
            **I need the following Permissions to work on your Server:**
            EMBED_LINKS,
            ADD_REACTIONS, 
            SEND_MESSAGES, 
            READ_MESSAGE_HISTORY,
            VIEW_CHANNEL
      
            ⚠️ Please add me the right Permissions and re-run this Command!
        
            `);
        }

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if(!user) return message.channel.send("> Please provide a (valid) User to get their Avatar!");
        if(message.author.bot) return;

        const embed1 = new MessageEmbed()
        .setImage(user.displayAvatarURL ({dynamic: true, size: 512}))
        .setFooter("cody-bot.xyz | 😎")
        .setTimestamp()
      
        await message.channel.send({embed: embed1})
    }
}