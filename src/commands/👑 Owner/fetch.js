const { Client, Message, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'fetch',
  category: '👑 Owner',
  ownerOnly: true,
  description: 'Cody Server Stats',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {

    // Check the users input for a guild id
    if (!args[0])
      return message.channel.send({ content: '`❌ | You must provide me with a guild id!`'})

    // Check if the guild exists or the bot is in it
    let guild = message.client.guilds.cache.get(args[0])

    if (!guild)
      return message.channel.send(
        { content: '`❌ | You must provide me with a guild id that I am already in!`'},
      )

    // Create Invite
    let inv
    inv = await guild.channels.cache.first().createInvite()

    // Create a embed with the Link displaying guild name and the final invite link -> send it.
    const embed = new MessageEmbed()
      .setColor('#2F3136')
      .setDescription(`✅ | Here is your invite to ${guild.name}: ${inv.url}`)

    message.channel.send({ embeds: [embed] })
  },
}
