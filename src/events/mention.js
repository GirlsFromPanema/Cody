const { MessageEmbed } = require('discord.js');
const client = require("../index");
    
    client.on('message', async (message) => {

        const mentionRegex = new RegExp(`^<@!?${client.user.id}>( |)$`);

        if (message.content.match(mentionRegex)) {

            const embed = new MessageEmbed()
            .setTitle("Hey, Cody here!")
            .setDescription("Need help? Join our Support Server or contact us trough our Panel")
            .setColor("BLURPLE")
            

            return message.channel.send({ embeds: [embed] })
        }
    })
