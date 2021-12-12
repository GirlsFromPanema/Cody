const { Client, Message, MessageEmbed, Discord } = require("discord.js");

module.exports = {
  name: "inbox",
  category: "ℹ️ Information",
  description: "Display the newest Messages",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {

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

    const infoembed = new MessageEmbed()
      .setTitle("Cody Information")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setColor("RANDOM")
      .setTimestamp()
      .setDescription(
        `Welcome ${message.author.username}!\nLast update: ${new Date().toLocaleString()} GMT\n\n📥 **Inbox:**\n*Dear Premium Users (82), we have added a Yearly Premium Subscription!\nIf you have been a premium member for more than 2 Months, contact us [here](https://cody-bot.xyz/contact) to receive your yearly plan, totally for free!*\n\n**🤔 Why aren't there coming new levels/languages to Codys Courses?**\n-> There are, don't worry. It takes a lot of time and I cannot work all the time on it.\n\n❤️ Thanks for 100.000+ Users, and for the great Feedback in the past months!`
      )
      .setFooter(`${message.author.username}`)

    message.channel.send({ embed: infoembed });
  },
};
