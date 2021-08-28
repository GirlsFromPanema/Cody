const { MessageEmbed } = require('discord.js')
const moment = require('moment')
const User = require('../../database/schemas/User')
module.exports = {
  name: 'enroll',
  category: '🌐 Learn how to Code',
  description: 'Signs you up!',
  cooldown: 5,

  run: async (client, message, args, user, guild) => {

    if (
      !message.guild.me.permissions.has(
        "EMBED_LINKS",
        "SEND_MESSAGES",
        "READ_MESSAGE_HISTORY",
        "VIEW_CHANNEL"
      )
    )
      return msg.channel.send(`
      ❌ I require some Permissions!

      **I need the following Permissions to work on your Server:**
      EMBED_LINKS, 
      SEND_MESSAGES, 
      READ_MESSAGE_HISTORY,
      VIEW_CHANNEL

      ⚠️ Please add me the right Permissions and re-run this Command!
  
      `);

    message.react("✅")


    //defining the valid Courses available the user can enter. You can change these once you add more courses.
    const validCourses = require('../../questions/courses.json').courses
    const answer = await ask(
      `What course would you like to enroll in!\n\n**Available Courses:**\n${validCourses.join(
        ' - '
      )}`,
      message
    )


    const timeover = new MessageEmbed()
    .setTitle(":x: | Error")
    .setDescription("The time ran out and the Process got canceled, rerun the Command to start again")
    .setColor("RED")
    .setFooter("Visit us at • cody-bot.xyz")
    .setTimestamp()



    //if the user doesn't respond or types 'cancel', send him a "cancelled message"
    if (!answer) {
      try {
        await message.author.send({embed: timeover})
      } catch {
        message.channel.send('Cancelled - Your dms are closed')
      }
      return
    }

    //check if the user wrote a course that isn't a course in the array we defined (Not a valid course)
    if (!validCourses.includes(answer)) {
      try {
        await message.author.send(
          new MessageEmbed()
            .setColor('RED')
            .setTitle('Provide a Valid Course')
            .setDescription(
              `Invalid Course Provided.\n\n**Current Courses available**\n${validCourses.join(
                ' - '
              )}`
            )
        )
      } catch {
        message.channel.send(` ${message.author} `, {
          embed: new MessageEmbed()
            .setColor('RED')
            .setTitle('Provide a Valid Course')
            .setDescription(
              `Invalid Course Provided.\n\n**Current Courses available**\n${validCourses.join(
                ' - '
              )}`
            )
        })
      }
      return
    }

    //define the user's courses (array)
    const validUserCourses = user.courses.map(c => c.name.toLowerCase())

    //check if the user already is enrolled in the selected course
    if (validUserCourses.includes(answer)) {
      try {
        await message.author.send(
          new MessageEmbed()
            .setColor('RED')
            .setTitle('Course already enrolled')
            .setDescription(`You are already enrolled in this course, run the resume Command to proceed here`)
        )
      } catch {
        message.channel.send(` ${message.author} `, {
          embed: new MessageEmbed()
            .setColor('RED')
            .setTitle('Course already enrolled')
            .setDescription(`You are already enrolled in this course, run the resume Command to proceed here`)
        })
      }
      return
    }

    //check if its a premium course
    const premiumcourses = require('../../questions/courses.json')
      .premium_courses
    if (premiumcourses.includes(answer) && !user.isPremium) {
      try {
        await message.author.send(
          new MessageEmbed()
            .setColor('RED')
            .setTitle('Premium Required')
            .setDescription(`You need premium to enroll this course`)
        )
      } catch {
        message.channel.send(` ${message.author} `, {
          embed: new MessageEmbed()
            .setColor('RED')
            .setTitle('Course already enrolled')
            .setDescription(`You need premium to enroll this course`)
        })
      }
      return
    }

    /* If the user isn't in the course, its time to add him to the course */

    //find the user in the database
    let enrolled = await User.findOne({ Id: message.author.id })

    //set when the user actually signed up
    if (!enrolled.enrolled) {
      enrolled.enrolled = Date.now()
    }

    //define the new user's selected course (Object)
    const newCourse = {
      name: answer,
      course: {
        enrolled: Date.now(),
        Level: 0,
        xp: 0,
        step: 0
      }
    }

    //push the object to the user's courses
    enrolled.courses.push(newCourse)

    //save all information
    await enrolled.save()

    //save the information to the cached user database
    client.userSettings.set(message.author.id, enrolled)

    //send a message saying the user was succfessfully enrolled
    const embed = new MessageEmbed()
      .setTitle('Enrolled!')
      .setColor(
        message.guild.me.displayHexColor === '#000000'
          ? 'GREEN'
          : message.guild.me.displayHexColor
      )
      .setDescription(
        `Sucessfully enrolled the **${answer.toLowerCase()}** course!`
      )

    try {
      await message.author.send(embed)
    } catch {
      message.channel.send(` ${message.author} `, { embed: embed })
    }
  }
}

// the function to ask the user
async function ask (question, message) {
  let msg
  try {
    msg = await message.author.send(
      new MessageEmbed()
        .setColor('GREEN')
        .setAuthor(
          message.author.tag,
          message.member.user.displayAvatarURL({
            dynamic: true
          })
        )
        .setDescription(`${question}\n\nNot sure yet? type \`cancel\``)
    )
  } catch (err) {
    console.log(err)
    return false
  }

  const answers = await msg.channel.awaitMessages(
    m => m.author.id == message.author.id,
    {
      max: 1,
      time: 30000
    }
  )

  if (!answers.first()) {
    return false
  } else {
    if (answers.first().content.toLowerCase() === 'cancel') return false
    return answers.first().content.toLowerCase()
  }
}
