const Discord = require("discord.js");
const User = require("../../database/schemas/User");
const moment = require("moment");

module.exports = {
  name: "stat",
  category: "💰 Premium",
  description: "Display detailed statistics",
  cooldown: 1000 * 60 * 60 * 24,
  aliases: ["st"],

  run: async (client, message, args, user, guild) => {
    if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
    if (
      !message.guild.me.hasPermission([
        "EMBED_LINKS",
        "ADD_REACTIONS",
        "SEND_MESSAGES",
        "READ_MESSAGE_HISTORY",
        "VIEW_CHANNEL",
      ])
    ) {
      return message.author.send(`
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

    const errorembed = new Discord.MessageEmbed()
      .setTitle(":x: | Error")
      .setDescription(
        `${message.author.username} you need a valid Premium Subscription to be able to run this Command!\nTo receive a premium Code, contact us [here](https://cody-bot.xyz/contact) with a valid Email address so we can send you the Code.\n\nThanks for using me <3`
      )
      .setColor("RED")
      .setTimestamp();

    const stats = new Discord.MessageEmbed()
    .setTitle("Stats")
    .setThumbnail(message.guild.iconURL({ dynamic: true }))
    .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
    .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
    .setDescription(
        `**Username:** ${
          message.author.tag
        }\n**Subscription:** Available\n**Ends in:** ${moment(
          Number(user.premium.expiresAt)
        ).toNow(true)}\n\n
        **Popular Courses:**\n1️⃣ JavaScript\n2️⃣ Java\n3️⃣ Python\n
        **General Course Time:**\n3 Courses - 0d:06h:12min\n
        **Fastest Course done:**\nJavaScript by Suse#2692 in 0d:00h:8min\n
        **Slowest Course done:**\nJava by Koni#9521 in 02d:12h:22min\n
        **Questions asked:**\n934 Questions asked to 408 Users\n
        `
      )
    try {
    if (user && user.isPremium) {
       message.react("✅").then(() =>  message.author.send(stats))
      
    } else {
      return message.channel.send(errorembed);
    }
    } catch (err) {
        console.log(err)
        message.channel.send(":x: Please enable your DMs before running this Command!")
        }
  },
};
