const Discord = require('discord.js')
const moment = require('moment')
const { presence } = require('../..')
const User = require('../../database/schemas/User')

module.exports = {
  name: 'userinfo',
  category: 'ℹ️ Information',
  description: 'Sends you information about a user',
  aliases: ['ui'],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

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

    // Check if the User is a premium user
    if (user && user.isPremium) {
      var premiumstatus = '✅'
    } else {
      var premiumstatus = '❌'
    }

    const mentionedUser =
      message.mentions.users.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member

    if (!mentionedUser)
      return message.channel.send({
        content: ':x: Please provide a valid User',
      })

    let tag
    if (mentionedUser.user && mentionedUser.user.tag) {
      tag = mentionedUser.user.tag
    } else {
      tag = mentionedUser.username + '#' + mentionedUser.discriminator
    }

    let avatar
    if (
      mentionedUser.user &&
      mentionedUser.user.displayAvatarURL({ dynamic: true })
    ) {
      avatar = mentionedUser.user.displayAvatarURL({ dynamic: true })
    } else {
      avatar = mentionedUser.displayAvatarURL({ dynamic: true })
    }
    console.log(avatar)

    let presence = 'offline'
    if (user.presence && user.presence.status) {
      presence = user.presence.status
    }
    const userDatabase = client.userSettings.get(mentionedUser.id)
    if (!userDatabase)
      return message.channel.send({
        content: 'I could not find any data for ' + tag,
      })

    let level = 0
    if (userDatabase.courses && userDatabase.courses.length > 0) {
      if (userDatabase.courses.length === 1) {
        level = userDatabase.courses[0].course.Level
      } else {
        if (userDatabase.courses.length > 1) {
          for (let courseLevel of userDatabase.courses) {
            if (courseLevel.course.Level)
              level = level + courseLevel.course.Level
          }
        }
      }
    }

    const embed = new Discord.MessageEmbed()
      .setTitle(tag + "'s Information")
      .setColor('GREEN')
      .setThumbnail(avatar)
      .setFooter(`ID: ${mentionedUser.id}`)
      .setDescription(
        `**Name:** \`${tag}\`\n**ID:** \`${
          mentionedUser.id
        }\`\n**Status:** \`${UpperCase(presence)}\`\n**Joined At:** \`${moment(
          mentionedUser.joinedAt,
        ).format('MMMM Do YYYY, h:mm:ss a')}\`\n**Created At:** \`${moment(
          mentionedUser.user && mentionedUser.user.createdAt
            ? mentionedUser.user.createdAt
            : mentionedUser.createdAt,
        ).format('MMMM Do YYYY, h:mm:ss a')}\`\n\n**Enrolled At:** \`${
          userDatabase.enrolled
            ? moment(userDatabase.enrolled).format('MMMM Do YYYY, h:mm:ss a')
            : 'Not Enrolled'
        }\`\n**Premium:** ${premiumstatus}\n**Courses:** \`${
          userDatabase.courses.length
            ? userDatabase.courses.map(c => UpperCase(c.name)).join(' - ')
            : 'None'
        }\`\n**Level:** \`${level}\`\n**XP:** \`${userDatabase.xp ||
          0}\`\n\nBy the way, you have a new Message in your Inbox!\nType \`<prefix> inbox\` to see it!`,
      )

    return message.channel.send({ embeds: [embed] })
  },
}

function UpperCase (inputString) {
  return inputString.replace(inputString[0], inputString[0].toUpperCase())
}
