const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "guide",
  description: "Guide how the Bot works.",
  category: "📚 Utility",
  aliases: "av",
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
      .setTitle(`Cody's Advice`)
      .setFooter("Visit us at • cody-bot.xyz")
      .setThumbnail(
        message.author.displayAvatarURL({ dynamic: true, size: 1024 })
      )
      .setDescription([
        "    📝Bot Guide",
        "•  To start, you have to run the $enroll Command, this will ask you which course you would like to join.",
        "•  After that, run the $resume (+ course) command you have enrolled to, this will continue in DMs.",
        "•  By the way, you can invite me [here](https://cody-bot.xyz)",
        "",
        "",
        "Happy Coding 😎",
      ]);

    //.setTimestamp()

    await message.channel.send({ embed: infoembed }).then((m) => m.react("👽"));
  },
};
