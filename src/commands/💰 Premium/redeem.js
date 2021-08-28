const Discord = require('discord.js')
const schema = require('../../database/schemas/Code')
const User = require('../../database/schemas/User')
const moment = require('moment')

module.exports = {
  name: 'redeem',
  category: '💰 Premium',
  description: 'redeem a premium code to get premium',
  cooldown: 5,

  run: async (client, message, args, user, guild) => {

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

    user = await User.findOne({
      Id: message.author.id
    })

    let code = args[0]

    if (!code)
      return message.channel.send({
        embed: new Discord.MessageEmbed()
          .setColor('0xff0000')
          .setDescription(`**Please specify the code you want to redeem!**`)
      })

    if (user && user.isPremium) {
      return message.channel.send({
        embed: new Discord.MessageEmbed()
          .setColor('0xff0000')
          .setDescription(`**> You already are a premium user**`)
      })
    }

    const premium = await schema.findOne({
      code: code.toUpperCase()
    })

    if (premium) {
      const expires = moment(premium.expiresAt).format(
        'dddd, MMMM Do YYYY HH:mm:ss'
      )

      user.isPremium = true
      user.premium.redeemedBy.push(message.author)
      user.premium.redeemedAt = Date.now()
      user.premium.expiresAt = premium.expiresAt
      user.premium.plan = premium.plan

      user = await user.save({ new: true }).catch(() => {})
      client.userSettings.set(message.author.id, user)

      await premium.deleteOne().catch(() => {})

      message.channel.send({
        embed: new Discord.MessageEmbed()
          .setTitle('Premium Redeemed')
          .setDescription(
            `**You have successfully redeemed premium!**\n\n\`Expires at: ${expires}\``
          )
          .setColor('0x5eff00')
          .setTimestamp()
      })
    } else {
      return message.channel.send({
        embed: new Discord.MessageEmbed()
          .setColor('0xff0000')
          .setDescription(
            `**The code is invalid. Please try and using valid one!**`
          )
      })
    }
  }
}
