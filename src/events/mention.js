const { MessageEmbed } = require('discord.js');
module.exports = (client, instance) => {
    
    client.on('message', async (message) => {

        const mentionRegex = new RegExp(`^<@!?${client.user.id}>( |)$`);

        if (message.content.match(mentionRegex)) {

            const embed = new MessageEmbed()
                .setDescription("Something")

            return message.channel.send({ embeds: [embed] })
        }
    })
}