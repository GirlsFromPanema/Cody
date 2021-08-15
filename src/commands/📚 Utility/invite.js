const Discord = require('discord.js')

module.exports = {
  name: 'invite',
  category: '📚 Utility',
  description: "Sends you Cody's bot invite link",
  cooldown: 3,

  run: async (client, message, args, user, guild) => {
    message.channel.send({
      embed: new Discord.MessageEmbed()
        .setTitle('Invite me')
        .setColor('GREEN')
        .setDescription(
          '[Click this to invite me](https://discord.com/oauth2/authorize?client_id=858311918447099925&permissions=240518548544&scope=bot)'
        )
    })
  }
}
