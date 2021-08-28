const Discord = require('discord.js')

module.exports = {
  name: 'invite',
  category: '📚 Utility',
  description: "Sends you Cody's bot invite link",
  cooldown: 3,

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

    message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle('Invite Cody')
        .setColor('GREEN')
        .setFooter(`Thanks ${message.author.username} for supporting me!`)
        .setTimestamp()
        .setDescription(
          '[Click this to invite me](https://discord.com/api/oauth2/authorize?client_id=858311918447099925&permissions=141667728625&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Finvite&scope=bot)'
        )
    })
  }
}
