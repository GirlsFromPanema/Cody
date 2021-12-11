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

      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

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

        const avatarembed = new MessageEmbed()
        .setTitle(`${member.user.username}'s Avatar`)
        .setImage(member.user.displayAvatarURL({dynamic: true, size: 1024}))
        .setFooter("Visit us at • cody-bot.xyz")

        await message.channel.send({embed: avatarembed})
    }
}