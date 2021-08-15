const Discord = require('discord.js')

module.exports = {
  name: 'premium',
  category: '💰 Premium',
  description: 'Displays what includes in Cody Premium',
  cooldown: 3,

  run: async (client, message, args, user, guild) => {
    const embed = new Discord.MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setTitle('Cody Premium')
      .setTimestamp()
      .setDescription(
        '`1- More levels`\nBy being a premium user, you can unlock more levels.\n\n`2- More question tries`\nYou will have more question tries than non-premium users\n\n`3- Unlimited course restarts`\nYou will also be able to restart any course from the beginning!'
      )
    message.channel.send({ embed: embed })
  }
}
