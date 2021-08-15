const { MessageEmbed } = require('discord.js')
const moment = require('moment')
const User = require('../../database/schemas/User')
const oneTry = new Set()

module.exports = {
  name: 'start',
  category: '🌐 Learn how to Code',
  description: 'Resume the course you were learning.',
  cooldown: 5,

  run: async (client, message, args, user, guild) => {
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
            `Please provide a course you would like to start!\n\n**Your Courses:**\n${userCourses.join(
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

    //check if its a premium course
    const premiumcourses = require('../../questions/courses.json')
      .premium_courses
    if (premiumcourses.includes(args[0].toLowerCase()) && !user.isPremium) {
      try {
        await message.author.send(
          new MessageEmbed()
            .setColor('RED')
            .setTitle('Premium Required')
            .setDescription(`You need premium to resume this course`)
        )
      } catch {
        message.channel.send(` ${message.author} `, {
          embed: new MessageEmbed()
            .setColor('RED')
            .setTitle('Course already enrolled')
            .setDescription(`You need premium to resume this course`)
        })
      }
      return
    }

    //defining the questions for the selected course
    const userSelectedQuestions = require(`../../questions/${args[0].toLowerCase()}.json`)

    //find the course from the database
    let course = user.courses.find(
      n => n.name.toLowerCase() === args[0].toLowerCase()
    )

    //an array that will return all course levels
    const levels = Object.keys(userSelectedQuestions[0]).length

    //if the user's course is finished tell him he is already done with it
    if (course.course.finished) {
      return message.channel.send('You are already done with this course.')
    }

    if (oneTry.has(message.author.id)) {
      return message.channel.send('Course already started in dms.')
    }

    //send a message telling the user the course is starting also important to check if the user's dms are closed
    let startingCourse
    try {
      startingCourse = await message.author.send('Starting Course...')
    } catch {
      // if dms are closed it will send him a message (READ FUNCTIONS AT THE BOTTOM)
      return cancelPrompt(1, message, false)
    }

    oneTry.add(message.author.id)

    message.reply('Continuing Course in dms!')

    /* Here, we define the answer which will be the user's response. We define the answer to be the function "ask" by awaiting it too.
    If the user types cancel / time runs off the answer will be false (BOOLEAN), if the user types an actual text the answer will be defined as the text */
    let answer = await ask(
      `**Continue Where you left off!**\n\nHey, to continue your **${
        course.name
      }** course please type **start**\n\n**Level:** ${
        course.course.Level
      }\n**XP:** ${course.course.xp}\nPage **#${
        course.course.step
      }**\n***Course enrolled ${moment(course.course.enrolled).fromNow()}***`,
      message,
      true,
      30000,
      false,
      false,
      false,
      false,
      false
    )

    //handle the answer
    if (answer && answer === 'cancel')
      return await cancelPrompt(2, message, false)

    //start the course if the answer was equal to "start"
    if (answer === 'start') {
      // delete the "starting course" message
      startingCourse.delete().catch(() => {})

      //define the course again
      course = user.courses.find(
        n => n.name.toLowerCase() === args[0].toLowerCase()
      )

      //find the questions from the user's selected course (LEVEL)
      const userQuestions =
        userSelectedQuestions[0][`level${course.course.Level}`]

      //defining some variables used for tries, xp, and question
      let answer
      let newXP = 0
      let userTries = 0
      let question

      //define the i to be where the user stopped the course or 0 which is the beginning of the course
      const userI = course.course.step || 0

      //make a loop that will loop through the questions and handle answers
      for (let i = userI; i < userQuestions.length; i++) {
        //defining the question using i
        question =
          userQuestions[i] && userQuestions[i][0] ? userQuestions[i][0] : null

        //avoiding errors
        if (question) {
          //handle premium
          if (question.premium && !user.isPremium) {
            try {
              await message.author.send(
                new MessageEmbed()
                  .setColor('RED')
                  .setDescription(
                    `Page \`${i}\` skipped ⏩\n\n**This question requires premium**`
                  )
              )
            } catch {
              return await cancelPrompt(1, message, false)
            }
          } else {
            //if the question has tries add 1 to the user's tries
            let userQuestionTries = question.tries || null
            if (user.isPremium && question.premiumTries)
              userQuestionTries = question.premiumTries

            if (userQuestionTries) {
              userTries = userTries + 1
            }

            //HANDLING THE QUESTION TYPE

            /* 
            if its continue run the continueQuestion function
            if its a answer run the ask function
            if its a reaction run the reaction function
            */

            if (question.type === 'continue') {
              answer = await continueQuestion(
                question.question,
                message,
                true,
                question.time || 30000
              )
            } else if (question.type === 'answer') {
              answer = await ask(
                question.question,
                message,
                true,
                question.time || 30000,
                userQuestionTries || false,
                userTries,
                i,
                Object.keys(userQuestions).length,
                course.course.Level + 1
              )
            } else if (question.type === 'reaction') {
              answer = await reaction(
                question.question,
                message,
                true,
                question.time || 30000,
                userQuestionTries || false,
                userTries,
                i,
                Object.keys(userQuestions).length,
                course.course.Level + 1
              )
            }

            //handle the user's answer
            if (answer && answer === 'cancel')
              return await cancelPrompt(2, message, false)

            if (!answer) return await cancelPrompt(2, message, false)

            //if the answer is wrong handle it
            if (!question.answers.includes(answer)) {
              //if the question has tries handle it
              if (userQuestionTries) {
                //if the user has tried the question enough times handle it by sending a message with the correct answer
                if (userTries >= userQuestionTries) {
                  await cancelPrompt(3, message, question.answers)
                  return
                } else {
                  //give the user 1 more try by changing the i by 1 so that it can be re added with the loop (to be on the same page)
                  i = i - 1
                }
              } else return await cancelPrompt(3, message, question.answers) //if the question has no tries handle it by sending a message with the correct answer directly
            } else {
              //if the user's answer is correct handle it

              //reset userTries to 0
              userTries = 0

              //if the question has xp add the xp to the user's xp
              if (question.xp && question.xp !== 0) {
                newXP = newXP + question.xp
                user.courses.find(
                  n => n.name.toLowerCase() === args[0].toLowerCase()
                ).course.xp =
                  user.courses.find(
                    n => n.name.toLowerCase() === args[0].toLowerCase()
                  ).course.xp ||
                  0 + newXP ||
                  0
              }

              //add 1 to the user's step (PAGE)
              user.courses.find(
                n => n.name.toLowerCase() === args[0].toLowerCase()
              ).course.step =
                user.courses.find(
                  n => n.name.toLowerCase() === args[0].toLowerCase()
                ).course.step + 1
              const info = await user.save({ new: true })
              user = info
              message.client.userSettings.set(message.author.id, info)

              //send the user how much xp he got
              if (question.xp && question.xp !== 0) {
                try {
                  message.author.send(
                    new MessageEmbed()
                      .setColor('GREEN')
                      .setDescription(
                        `${
                          question.correct ? question.correct : 'Correct!'
                        } **(+${question.xp} XP)**`
                      )
                  )
                } catch {
                  return await cancelPrompt(1, message, false)
                }
              }
            }
          }
        }
      }
      // add the xp to the user's xp
      user.xp = user.xp + newXP || 0

      user.courses.find(
        n => n.name.toLowerCase() === args[0].toLowerCase()
      ).course.Level =
        user.courses.find(n => n.name.toLowerCase() === args[0].toLowerCase())
          .course.Level + 1

      user.courses.find(
        n => n.name.toLowerCase() === args[0].toLowerCase()
      ).course.step = 0
      user.courses.find(
        n => n.name.toLowerCase() === args[0].toLowerCase()
      ).course.xp = 0

      //check if that level was the last level
      if (levels <= course.course.Level) {
        user.courses.find(
          n => n.name.toLowerCase() === args[0].toLowerCase()
        ).course.finished = true
        const info = await user.save({ new: true })
        user = info
        message.client.userSettings.set(message.author.id, info)

        try {
          message.author.send(
            new MessageEmbed()
              .setColor('GREEN')
              .setTitle('Congrats!')
              .setDescription(
                `You have finished the ${args[0]} course, congrats!`
              )
          )
          if (oneTry.has(message.author.id)) oneTry.delete(message.author.id)
          return
        } catch {
          return await cancelPrompt(1, message, false)
        }
      }
      //save everything above (xp, step, etc)
      const info = await user.save({ new: true })
      user = info
      message.client.userSettings.set(message.author.id, info)

      //send the user a summary of the next level

      //get the next level question length
      const newLevelLength = Object.keys(
        userSelectedQuestions[0][
          `level${
            info.courses.find(
              n => n.name.toLowerCase() === args[0].toLowerCase()
            ).course.Level
          }`
        ]
      ).length

      //get the new level xp length
      const newLevelXP = userSelectedQuestions[0][
        `level${
          info.courses.find(n => n.name.toLowerCase() === args[0].toLowerCase())
            .course.Level
        }`
      ].reduce(function (a, b) {
        return a[0].xp + b[0].xp
      })

      //send the user the message
      try {
        message.author.send(
          new MessageEmbed()
            .setColor('GREEN')
            .setDescription(
              `New Level Advanced!\n\nLevel ${info.courses.find(
                n => n.name.toLowerCase() === args[0].toLowerCase()
              ).course.Level - 1} ➜ ${
                info.courses.find(
                  n => n.name.toLowerCase() === args[0].toLowerCase()
                ).course.Level
              } **(+${newXP} XP)**\n\nTo start the level, make sure to re-run the command!\n\n**Level ${
                info.courses.find(
                  n => n.name.toLowerCase() === args[0].toLowerCase()
                ).course.Level
              } Summary**\n- ${newLevelLength} Pages\n- ${newLevelXP} Total XP`
            )
        )
      } catch {
        return await cancelPrompt(1, message, false)
      }
      newXP = 0
    } else return await cancelPrompt(2, message, false)
  }
}

/* 

The ask function is the function we use when we want the user to answer with a text.

PARAMS:
question -> The question (STRING)
message -> The message object (OBJECT)
cancel -> Whether "Type cancel to cancel" will show up or not (BOOLEAN)
time -> The time in seconds the user has to answer (NUMBER)
tries-> The question Tries (NUMBER)
userTries -> The user's Tries (NUMBER)
step -> The user's step (NUMBER)
length -> The length of the questions (NUMBER)
level -> The next level of the course (NUMBER)


example:

const whatUserResponded = await ask("How are you?", message, true, 30000, 2, 1, 1, 2);

if the user responded, "whatUserResponded" will be what the user responded. 
If time ran out or he typed "cancel" it will return false (BOOLEAN)

*/
async function ask (
  question,
  message,
  cancel,
  time,
  tries,
  userTries,
  step,
  length,
  level
) {
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
        .setFooter(
          `🕒 ${(time || 30000) / 1000} seconds to answer ${
            step && length && level
              ? `| #${step} - ${length - step} left till level ${level}`
              : ''
          }`,
          message.client.user.displayAvatarURL()
        )
        .setDescription(
          `${
            tries && userTries ? `**Try ${userTries}/${tries}**\n\n` : ''
          }${question} ${
            cancel === true ? `\n\n**Type \`cancel\` to cancel**` : ''
          }`
        )
    )
  } catch (err) {
    console.log(err)
    return cancelPrompt(1, message, false)
  }

  const answers = await msg.channel.awaitMessages(
    m => m.author.id == message.author.id,
    {
      max: 1,
      time: time || 30000
    }
  )

  if (!answers.first()) {
    return false
  } else {
    if (answers.first().content.toLowerCase() === 'cancel') return 'cancel'
    return answers.first().content.toLowerCase()
  }
}

/* 

The continue function is the function we use when we want the user to continue to the next page 
(Type continue)

PARAMS:
question -> The question (STRING)
message -> The message object (OBJECT)
cancel -> Whether "Type continue to continue" will show up or not (BOOLEAN)
time -> The time in seconds the user has to answer (NUMBER)


example:

const whatUserResponded = await ask("How are you?", message, true, 30000);

- if the user responded, "whatUserResponded" will be what the user responded. 
- If time ran out it will return false (BOOLEAN)
- If the user types cancel if will return "cancel" (STRING)
- If the user typed continue it will return "continue" (STRING)

*/

async function continueQuestion (question, message, cancel, time) {
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
        .setFooter(
          `🕒 ${(time || 30000) / 1000} seconds to answer`,
          message.client.user.displayAvatarURL()
        )
        .setDescription(
          `${question}${
            cancel === true ? `\n\n**Type \`continue\` to continue**` : ''
          }`
        )
    )
  } catch {
    return cancelPrompt(1, message, false)
  }

  const answers = await msg.channel.awaitMessages(
    m => m.author.id == message.author.id,
    {
      max: 1,
      time: time || 30000
    }
  )

  if (!answers.first()) {
    return false
  } else {
    if (answers.first().content.toLowerCase() === 'continue') return 'continue'
    if (answers.first().content.toLowerCase() === 'cancel') return 'cancel'
    else return false
  }
}

/* 

The function to handling the cancel prompt 
(If the user's dms are closed, if he types an incorrect answer. If the time runs out, etc)

Params:
- number: Type number (NUMBER)
- message: The message object (OBJECT)
- answer: The answer of the wrong answer (STRING) (OPTIONAL)

Types:
- 1: The user's dms are closed
- 2: The user types cancel or time runs out
- 3: The user types an incorrect answer and the bot tells him the correct ones

*/

async function cancelPrompt (number, message, answer) {
  if (oneTry.has(message.author.id)) oneTry.delete(message.author.id)

  if (number === 1) {
    const cancelEmbed = new MessageEmbed()
      .setColor('RED')
      .setAuthor(
        message.author.tag,
        message.member.user.displayAvatarURL({
          dynamic: true
        })
      )
      .setFooter(
        `Cody | The best coding bot for discord`,
        message.client.user.displayAvatarURL()
      )
      .setDescription(`I couldn't dm you. Please make sure your dms are open!`)

    message.channel.send(` ${message.author} `, {
      embed: cancelEmbed
    })
  } else if (number === 2) {
    const cancelEmbed = new MessageEmbed()
      .setColor('RED')
      .setDescription(`Successfully Cancelled Prompt.`)

    try {
      await message.author.send(cancelEmbed)
    } catch {
      message.channel.send(` ${message.author} `, {
        embed: cancelEmbed
      })
    }
  } else if (number === 3) {
    const cancelEmbed = new MessageEmbed()
      .setColor('RED')
      .setAuthor(
        message.author.tag,
        message.member.user.displayAvatarURL({
          dynamic: true
        })
      )
      .setFooter(
        `Cody | The best coding bot for discord`,
        message.client.user.displayAvatarURL()
      )
      .setDescription(
        `${
          answer
            ? `Your answer was incorrect!\n\n${
                answer.length & (answer.length === 1)
                  ? `**Correct Answer:**`
                  : `**Possible Answers:**`
              } \`${answer.join(
                ' - '
              )}\`\n\nTo retry, make sure to re-run the command`
            : 'Time has ended. I have cancelled the prompt'
        }`
      )

    try {
      await message.author.send(cancelEmbed)
    } catch {
      message.channel.send(` ${message.author} `, {
        embed: cancelEmbed
      })
    }
  }
}

/* 

The reaction function is the function we use when we want the user to answer with a reaction. (✅ or ❌)

PARAMS:
question -> The question (STRING)
message -> The message object (OBJECT)
cancel -> Whether "Type cancel to cancel" will show up or not (BOOLEAN)
time -> The time in seconds the user has to answer (NUMBER)
tries-> The question Tries (NUMBER)
userTries -> The user's Tries (NUMBER)
step -> The user's step (NUMBER)
length -> The length of the questions (NUMBER)
level -> The next level of the course (NUMBER)


example:

const whatUserResponded = await ask("How are you?", message, true, 30000, 2, 1, 1, 2);

if the user reacted ✅, answer will be "✅" (STRING)
if the user reacted ❌, answer will be "❌" (STRING)

*/

async function reaction (
  question,
  message,
  cancel,
  time,
  tries,
  userTries,
  step,
  length,
  level
) {
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
        .setFooter(
          `🕒 ${(time || 30000) / 1000} seconds to answer ${
            step && length && level
              ? `| #${step} - ${length - step} left till level ${level}`
              : ''
          }`,
          message.client.user.displayAvatarURL()
        )
        .setDescription(
          `${
            tries && userTries ? `**Try ${userTries}/${tries}**\n\n` : ''
          }${question} ${
            cancel === true ? `\n\n**Type \`cancel\` to cancel**` : ''
          }`
        )
    )
  } catch (err) {
    console.log(err)
    return cancelPrompt(1, message, false)
  }

  msg.react('✅')
  msg.react('❌')

  const answers = await msg.awaitReactions(
    (reaction, user) =>
      user.id == message.author.id &&
      (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'),
    {
      max: 1,
      time: time || 30000
    }
  )

  if (!answers.first()) {
    return false
  } else {
    if (answers.first().emoji.name === '✅') return '✅'
    else if (answers.first().emoji.name === '❌') return '❌'
    else return false
  }
}
