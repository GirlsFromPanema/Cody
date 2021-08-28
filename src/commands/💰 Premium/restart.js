const { MessageEmbed } = require('discord.js')
const moment = require('moment')
const User = require('../../database/schemas/User')

module.exports = {
  name: 'restart',
  category: '💰 Premium',
  description: 'Restart a course from the beginning (premium)',
  cooldown: 10,

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

    //if the user isn't premium block the command
    if (!user || !user.isPremium) {
      const embed = new MessageEmbed()
        .setTitle('Premium Required')
        .setColor(
          message.guild.me.displayHexColor === '#000000'
            ? 'GREEN'
            : message.guild.me.displayHexColor
        )
        .setDescription(`This command is only for premium users`)
      return message.channel.send({ embed: embed })
    }
    //if the user doesn't exist / isn't enrolled yet it will tell him to enroll
    if (!user && !user.enrolled) {
      const embed = new MessageEmbed()
        .setTitle('User not Enrolled')
        .setColor(
          message.guild.me.displayHexColor === '#000000'
            ? 'GREEN'
            : message.guild.me.displayHexColor
        )
        .setDescription(`Please enroll a course before using this command`)
      return message.channel.send({ embed: embed })
    }

    //if the user is enrolled but without any joined course tell him to join a course
    if (!user.courses.length) {
      const embed = new MessageEmbed()
        .setTitle('User not Enrolled')
        .setColor(
          message.guild.me.displayHexColor === '#000000'
            ? 'GREEN'
            : message.guild.me.displayHexColor
        )
        .setDescription(`Please enroll a course before using this command`)
      return message.channel.send({ embed: embed })
    }

    //if the user doesn't provide the course he wants to resume, it will tell him to provide a course
    if (!args[0]) {
      //defining the user's courses (ARRAY)
      const userCourses = user.courses.map(
        c =>
          ` - \`${c.name}\` - enrolled ${moment(c.course.enrolled).fromNow()}`
      )

      //send the embed
      return message.channel.send({
        embed: new MessageEmbed()
          .setColor('RED')
          .setTitle('Provide a course')
          .setDescription(
            `Please provide a course you would like to restart!\n\n**Your Courses:**\n${userCourses.join(
              '\n'
            )}`
          )
      })
    }

    //defining the valid Courses available the user can enter. You can change these once you add more courses.
    const validCourses = require('../../questions/courses.json').courses

    if (!validCourses.includes(args[0].toLowerCase())) {
      //send the message
      return message.channel.send({
        embed: new MessageEmbed()
          .setColor('RED')
          .setTitle('Provide a Valid Course')
          .setDescription(
            `Invalid Course Provided.\n\n**Current Courses**\n${validCourses.join(
              ' - '
            )}`
          )
      })
    }

    //defining the user's joined courses (ARRAY)
    const validUserCourses = user.courses.map(c => c.name.toLowerCase())

    //if the user isn't enrolled in the course he provided tell him to join it
    if (!validUserCourses.includes(args[0].toLowerCase())) {
      //send embed
      return message.channel.send({
        embed: new MessageEmbed()
          .setColor('RED')
          .setTitle('Provide a Valid Course')
          .setDescription(
            `Invalid Course Provided.\n\n**Current Courses You are enrolled in**\n${validUserCourses.join(
              ' - '
            )}`
          )
      })
    }
    /* ask for a confirmation */

    //find the course from the database
    let course = user.courses.find(
      n => n.name.toLowerCase() === args[0].toLowerCase()
    )

    const confirmation = new MessageEmbed()
      .setTitle('Are you sure?')
      .setDescription(
        `Are you sure you would like to restart the ${
          args[0]
        } course?\n\n**Course Progress:**\n\n**Level:** \`${
          course.course.Level
        }\`\n**XP:** \`${course.course.xp}\`\nPage **#${
          course.course.step
        }**\n***Course enrolled ${moment(course.course.enrolled).fromNow()}***`
      )
      .setFooter('React with ✅ or ❌')
      .setColor(message.guild.me.displayHexColor)

    const confirmationMessage = await message.channel.send({
      embed: confirmation
    })

    confirmationMessage.react('✅')
    confirmationMessage.react('❌')

    const answer = await confirmationMessage.awaitReactions(
      (reaction, user) =>
        user.id == message.author.id &&
        (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'),
      {
        max: 1,
        time: 30000
      }
    )

    if (!answer.first()) {
      return message.channel.send('Cancelled!')
    } else {
      if (answer.first().emoji.name === '❌')
        return message.channel.send('Cancelled!')
    }

    /* time to reset */

    //find the user in the database
    let enrolled = await User.findOne({ Id: message.author.id })

    //define the  course (Object)
    const newCourse = {
      name: args[0].toLowerCase(),
      course: {
        enrolled: Date.now(),
        Level: 0,
        xp: 0,
        step: 0,
        finished: false
      }
    }

    //replace old course to now
    const index = enrolled.courses.indexOf(
      enrolled.courses.find(n => n.name.toLowerCase() === args[0].toLowerCase())
    )

    enrolled.courses[index] = newCourse

    //save all information
    await enrolled.save()

    //save the information to the cached user database
    client.userSettings.set(message.author.id, enrolled)

    //send a message saying the user was succfessfully enrolled
    const embed = new MessageEmbed()
      .setTitle('Course reset!')
      .setColor(
        message.guild.me.displayHexColor === '#000000'
          ? 'GREEN'
          : message.guild.me.displayHexColor
      )
      .setDescription(
        `Sucessfully restarted the **${args[0].toLowerCase()}** course!`
      )

    message.channel.send({ embed: embed })
  }
}
