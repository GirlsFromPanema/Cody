const Discord = require('discord.js')

module.exports = {
  name: 'support',
  category: '📚 Utility',
  description: "Sends you Cody's bot support server link",
  cooldown: 3,

  run: async (client, message, args, user, guild) => {
    message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle('Support Server')
        .setColor('GREEN')
        .setDescription(
          '[Click this to join our support server](https://discord.gg/npJg754WFp)'
        )
    })
  }
}
