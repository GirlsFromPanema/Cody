const Discord = require('discord.js')
const moment = require('moment')

module.exports = {
  name: 'userinfo',
  category: 'ℹ️ Information',
  description: 'Sends you information about a provided user',
  cooldown: 3,
  aliases: ['ui'],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, user, guild) => {
    const mentionedUser =
      message.mentions.users.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member

    if (!mentionedUser)
      return message.channel.send(':x: Please provide a valid User')

    const userDatabase = client.userSettings.get(mentionedUser.id)
    if (!userDatabase)
      return message.channel.send(
        'I could not find any data for ' + mentionedUser.user.tag
      )

    const embed = new Discord.MessageEmbed()
      .setTitle(mentionedUser.user.tag + "'s Information")
      .setColor(message.guild.me.displayHexColor)
      .setThumbnail(mentionedUser.user.displayAvatarURL({ dynamic: true }))
      .setFooter(`ID: ${mentionedUser.id}`)
      .setDescription(
        `**Name:** \`${mentionedUser.user.tag}\`\n**ID:** \`${
          mentionedUser.id
        }\`\n**Status:** \`${UpperCase(
          mentionedUser.presence.status
        )}\`\n**Joined At:** \`${moment(mentionedUser.joinedAt).format(
          'MMMM Do YYYY, h:mm:ss a'
        )}\`\n**Created At:** \`${moment(mentionedUser.user.createdAt).format(
          'MMMM Do YYYY, h:mm:ss a'
        )}\`\n\n**Enrolled At:** \`${
          userDatabase.enrolled
            ? moment(userDatabase.enrolled).format('MMMM Do YYYY, h:mm:ss a')
            : 'Not Enrolled'
        }\`\n**Courses:** \`${
          userDatabase.courses.length
            ? userDatabase.courses.map(c => UpperCase(c.name)).join(' - ')
            : 'None'
        }\`\n**Level:** \`${
          userDatabase.courses && userDatabase.courses.length > 1
                ? userDatabase.courses.reduce((a, b) => {
                    return a.course.Level || 0 + b.course.Level || 0;
                  })
                : userDatabase.courses.course.Level || 0
        }\`\n**XP:** \`${userDatabase.xp}\``
      )

    return message.channel.send({ embed: embed })
  }
}

function UpperCase (inputString) {
  return inputString.replace(inputString[0], inputString[0].toUpperCase())
}
