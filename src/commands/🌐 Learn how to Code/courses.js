const courses = require('../../questions/courses.json')
const Discord = require('discord.js')

module.exports = {
  name: 'courses',
  category: '🌐 Learn how to Code',
  description: "Displays all cody's current available courses",
  cooldown: 3,

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

    const embed = new Discord.MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setTitle("Cody's available Courses")
      .setTimestamp()

    for (let course of courses.courses) {
      const description = require(`../../questions/${course}.json`)
      const levels = Object.keys(description[0]).length
      embed.addField(
        course,
        `${courses.course_descriptions[course]} **(${levels} Levels)** ${
          courses.premium_courses.includes(course) ? ` \`- premium\`` : ''
        }`
      )
    }

    message.channel.send({ embed: embed })
  }
}
