const { Client, Message, MessageEmbed } = require('discord.js')
const ReactionMenu = require('../../data/ReactionMenu.js')
module.exports = {
  name: 'servers',
  category: '👑 Owner',
  ownerOnly: true,
  description: 'Lists Codys Servers',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, guild) => {
    const servers = message.client.guilds.cache.map(guild => {
      return `\`${guild.id}\` - **${guild.name}** - \`${guild.memberCount}\` members`
    })

    const embed = new MessageEmbed()
      .setTitle('Server List')
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({
          dynamic: true,
        }),
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor)

    if (servers.length <= 10) {
      const range = servers.length == 1 ? '[1]' : `[1 - ${servers.length}]`
      embed.setTitle(`Server List ${range}`).setDescription(servers.join('\n'))

      message.channel.send({ embeds: [embed] })
    } else {
      new ReactionMenu(
        message.client,
        message.channel,
        message.member,
        embed,
        servers,
      )
    }
  },
}
