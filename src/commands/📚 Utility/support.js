const Discord = require("discord.js");

module.exports = {
  name: "support",
  category: "📚 Utility",
  description: "Sends you Cody's bot support server link",
  cooldown: 3,

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

    message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle("Support Server")
        .setColor("GREEN")
        .setDescription(
          "[Click this to join our support server](https://discord.gg/nBF9GRcq8c)"
        ),
    });
  },
};
