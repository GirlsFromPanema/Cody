const Discord = require("discord.js");
const User = require("../../database/schemas/User");
const moment = require("moment");

module.exports = {
  name: "stat",
  category: "💰 Premium",
  description: "Display detailed statistics",
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
      return message.author.send({ content: `
        ❌ I require some Permissions!
  
        **I need the following Permissions to work on your Server:**
        EMBED_LINKS,
        ADD_REACTIONS, 
        SEND_MESSAGES, 
        READ_MESSAGE_HISTORY,
        VIEW_CHANNEL
  
        ⚠️ Please add me the right Permissions and re-run this Command!
    
        ` });
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
        **General Course Time:**\n3 Courses - 0d:08h:12min:44sec\n
        **Fastest Course done:**\nJavaScript by Suse#2692 in 0d:00h:08min:48sec\n
        **Slowest Course done:**\nJava by Koni#9521 in 02d:12h:22min:33sec\n
        **Questions asked:**\n1021 Questions asked to 498 Users\n
        `
      )
    try {
    if (user && user.isPremium) {
       message.react("✅").then(() =>  message.author.send({ embeds: [stats] }))
      
    } else {
      return message.channel.send(errorembed);
    }
    } catch (err) {
        console.log(err)
        message.channel.send({ content: ":x: Please enable your DMs before running this Command!" })
        }
  },
};
