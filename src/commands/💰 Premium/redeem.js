const Discord = require('discord.js')
const schema = require('../../database/schemas/Code')
const User = require('../../database/schemas/User')
const moment = require('moment')

module.exports = {
  name: 'redeem',
  category: '💰 Premium',
  description: 'redeem a premium code to get premium',

  run: async (client, message, args, user, guild) => {
    if (!message.guild.me.permissions.has('SEND_MESSAGES')) return
    if (
      !message.guild.me.permissions.has([
        'EMBED_LINKS',
        'ADD_REACTIONS',
        'SEND_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'VIEW_CHANNEL',
      ])
    ) {
      return message.channel.send({
        content: `
      ❌ I require some Permissions!

      **I need the following Permissions to work on your Server:**
      EMBED_LINKS,
      ADD_REACTIONS, 
      SEND_MESSAGES, 
      READ_MESSAGE_HISTORY,
      VIEW_CHANNEL

      ⚠️ Please add me the right Permissions and re-run this Command!
  
      `,
      })
    }

    // Check if the user with a unique ID is in the database.
    user = await User.findOne({
      Id: message.author.id,
    })

    // Checl Users input for a valid code
    let code = args[0]

    if (!code)
      return message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setColor('0xff0000')
            .setDescription(`**Please specify the code you want to redeem!**`),
        ],
      })

    // If the user is already a premium user, we dont want to save that so we return it.
    if (user && user.isPremium) {
      return message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setColor('0xff0000')
            .setDescription(`**> You already are a premium user**`),
        ],
      })
    }

    // Check if the code is valid within the database
    const premium = await schema.findOne({
      code: code.toUpperCase(),
    })

    // Set the expire date for the code
    if (premium) {
      const expires = moment(premium.expiresAt).format(
        'dddd, MMMM Do YYYY HH:mm:ss',
      )

      // Once the code is expired, we delete it from the database and from the users profile
      user.isPremium = true
      user.premium.redeemedBy.push(message.author)
      user.premium.redeemedAt = Date.now()
      user.premium.expiresAt = premium.expiresAt
      user.premium.plan = premium.plan

      user = await user.save({ new: true }).catch(() => {})
      client.userSettings.set(message.author.id, user)

      await premium.deleteOne().catch(() => {})

      // Send a success message once redeemed
      message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setTitle('Premium Redeemed')
            .setDescription(
              `**You have successfully redeemed premium!**\n\n\`Expires at: ${expires}\``,
            )
            .setColor('0x5eff00')
            .setTimestamp(),
        ],
      })

      // Error message if the code is not valid/failed.
    } else {
      return message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setColor('0xff0000')
            .setDescription(
              `**The code is invalid. Please try and using valid one!**`,
            ),
        ],
      })
    }
  },
}
