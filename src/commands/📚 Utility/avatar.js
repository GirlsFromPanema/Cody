const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: "Display the Users avatar",
    category: '📚 Utility',
    aliases: "av",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {

        //message.delete()
        if (
            !message.guild.me.permissions.has(
              "EMBED_LINKS",
              "SEND_MESSAGES",
              "READ_MESSAGE_HISTORY",
              "VIEW_CHANNEL"
            )
          )
            return msg.channel.send(`
            ❌ I require some Permissions!
      
            **I need the following Permissions to work on your Server:**
            EMBED_LINKS, 
            SEND_MESSAGES, 
            READ_MESSAGE_HISTORY,
            VIEW_CHANNEL
      
            ⚠️ Please add me the right Permissions and re-run this Command!
        
            `);

        const avatarembed = new MessageEmbed()
        .setTitle(`${message.author.username}'s Avatar`)
        .setImage(message.author.displayAvatarURL({dynamic: true, size: 1024}))
        .setFooter("Visit us at • cody-bot.xyz")
        //.setTimestamp()

        await message.channel.send({embed: avatarembed}).then(( m => m.react("👻")))
        message.react("✅")
    }
}