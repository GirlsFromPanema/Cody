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

  run: async (client, message, args, user, guild) => {

    if(!message.guild.me.permissions.has("SEND_MESSAGES")) return;
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

    const users = await User.find({ hide: false })
      .sort({ xp: -1 })
      .limit(10)

    const array = []
    let i = 1
    for (let user of users) {
      const db = client.userSettings.get(user.Id)
      let level = 0
      if (user.courses && user.courses.length > 0) {
        if (user.courses.length === 1) {
          level = user.courses[0].course.Level
        } else {
          if (user.courses.length > 1) {
            console.log('----')
            console.log(`${i}- Getting user data`)
            console.log(user);
            console.log('----')
            level = user.courses.reduce((a, b) => {
              return a.course.Level || 0 + b.course.Level || 0
            })
          }
        }
      }

      if (db) {
        const fetch = client.users.cache.get(user.Id)
        if (fetch && fetch.username) {
          array.push(
            `\`${i}-\` **${fetch.username}** - \`${user.xp} XP | Level ${level}\``
          )
        } else
          array.push(
            `\`${i}-\` **Unknown User** - \`${user.xp} XP | Level ${level}\` `
          )
      } else
        array.push(
          `\`${i}-\` **Unknown User** - \`${user.xp} XP | Level ${level}\` `
        )
      i++
    }

    const embed = new Discord.MessageEmbed()
      .setTitle(`Global Cody Leaderboard`)
      .setColor(message.guild.me.displayHexColor)
      .setFooter(`Showing Top 10 Users | cody-bot.xyz`)
      .setDescription(array.length ? array.join('\n') : 'No users found')

    message.channel.send({ embed: embed })
  }
}
