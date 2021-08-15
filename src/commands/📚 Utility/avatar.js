const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: "Display the Users avatar",
    aliases: "av",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {

        //message.delete()

        const avatarembed = new MessageEmbed()
        .setTitle(`${message.author.username}'s Avatar`)
        .setImage(message.author.displayAvatarURL({dynamic: true, size: 1024}))
        //.setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        //.setTimestamp()

        await message.channel.send({embed: avatarembed}).then(( m => m.react("👻")))
        message.react("✅")
    }
}