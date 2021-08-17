/*
const Discord = require('discord.js')
const moment = require('moment')
const User = require('../../database/schemas/User')

module.exports = {
  name: 'leaderboard',
  category: 'ℹ️ Information',
  description: "Display's Cody's global coding leaderboard",
  cooldown: 5,
  aliases: ['lb'],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
/*
  run: async (client, message, args, user, guild) => {
    const users = await User.find({ hide: false })
      .sort({ xp: -1 })
      .limit(10)

    const array = []
    let i = 1
    for (let user of users) {
      const db = client.userSettings.get(user.Id)
      if (db) {
        const fetch = client.users.cache.get(user.Id)
        if (fetch && fetch.username) {
          array.push(
            `\`${i}-\` **${fetch.username}** - \`${
              user.xp
            } XP | Level ${user.courses.reduce((a, b) => {
              return a.course.Level || 0 + b.course.Level || 0
            })}\``
          )
        } else
          array.push(
            `\`${i}-\` **Unknown User** - \`${
              user.xp
            } XP | Level ${user.courses.reduce((a, b) => {
              return a.course.Level || 0 + b.course.Level || 0
            })}\` `
          )
      } else
        array.push(
          `\`${i}-\` **Unknown User** - \`${
            user.xp
          } XP | Level ${user.courses.reduce((a, b) => {
            return a.course.Level || 0 + b.course.Level || 0
          })}\` `
        )
      i++
    }
/*
    const embed = new Discord.MessageEmbed()
      .setTitle(`Global Cody Leaderboard`)
      .setColor(message.guild.me.displayHexColor)
      .setFooter(`Showing Top 10 Users | cody-bot.xyz`)
      .setDescription(array.length ? array.join('\n') : "No users found")

    message.channel.send({ embed: embed })
  }
}
*/