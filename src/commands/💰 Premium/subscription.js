const Discord = require('discord.js')
const User = require('../../database/schemas/User')
const moment = require('moment')

module.exports = {
  name: 'subscription',
  category: '💰 Premium',
  description: 'Displays info about your premium sub',
  cooldown: 3,
  aliases: ['sub'],

  run: async (client, message, args, user, guild) => {
    if (user && user.isPremium) {
      return message.channel.send({
        embed: new Discord.MessageEmbed()
          .setColor('GREEN')
          .setDescription(
            `**Name:** ${
              message.author.tag
            }\n**Subscription:** Available\n**Ends in:** ${moment(
              Number(user.premium.expiresAt)
            ).toNow(true)}`
          )
      })
    } else {
      return message.channel.send(`**> You do not have Premium active!**`)
    }
  }
}
