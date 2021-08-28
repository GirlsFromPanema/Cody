const { Client, Message, MessageEmbed, Discord } = require("discord.js");

module.exports = {
  name: "info",
  cooldown: 60,
  category: "ℹ️ Information",
  description: "Dunno what to do?",
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
        `Welcome ${message.author.username}, want to start to learn the huge World of Programming?\nBut you don't like to visit Websites or other Sources?\n\nThen **Cody** is exactly what you need! Learn popular Languages like **JavaScript**, **Python** and much more from the basic to the advanced Level\nRun the $guide Command to get started with the Bot!\n\n[Invite](https://discord.com/oauth2/authorize?client_id=858311918447099925&scope=bot&permissions=270126169&response_type=code&redirect_uri=https://cody-bot.xyz/dashboard) | [Dashboard](https://cody-bot.xyz/panel) | [Status](https://cody-bot.xyz/status)`
      );

    message.channel.send({ embed: infoembed });
  },
};
