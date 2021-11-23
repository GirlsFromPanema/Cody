const Discord = require('discord.js')

module.exports = {
  name: 'premium',
  category: '💰 Premium',
  description: 'Displays what includes in Cody Premium',
  cooldown: 360000,

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
      .setTitle('Cody Premium')
      .setTimestamp()
      .setDescription(
        '`1- More levels`\nBy being a premium user, you can unlock more levels.\n\n`2- More question tries`\nYou will have more question tries than non-premium users\n\n`3- Unlimited course restarts`\nYou will also be able to restart any course from the beginning!'
      )
    message.channel.send({ embed: embed })
  }
}
