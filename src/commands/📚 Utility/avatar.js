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
          !message.guild?.me?.hasPermission([
            "MANAGE_CHANNELS",
            "MANAGE_ROLES",
            "EMBED_LINKS",
            "SEND_MESSAGES",
            "MANAGE_MESSAGES",
            "VIEW_CHANNEL",
          ])
        ) {
          return message.channel.send("No perms");
        }

        const avatarembed = new MessageEmbed()
        .setTitle(`${message.author.username}'s Avatar`)
        .setImage(message.author.displayAvatarURL({dynamic: true, size: 1024}))
        .setFooter("Visit us at • cody-bot.xyz")
        //.setTimestamp()

        await message.channel.send({embed: avatarembed}).then(( m => m.react("👻")))
        message.react("✅")
    }
}