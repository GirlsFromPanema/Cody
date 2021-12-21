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

    // Fetch the Servers, map them and display ID / NAME / Amount of TOTAL Members
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

    // Due to limits, only show max 10 Servers at one time.
    if (servers.length <= 10) {
      const range = servers.length == 1 ? '[1]' : `[1 - ${servers.length}]`
      embed.setTitle(`Server List ${range}`).setDescription(servers.join('\n'))

      message.channel.send({ embeds: [embed] })

    // If there are more than 10, use the ReactionMenu to display a paginated list.
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
