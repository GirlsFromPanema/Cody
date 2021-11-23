const { MessageEmbed } = require('discord.js')
module.exports = {
  name: 'help',
  category: 'ℹ️ Information',
  description: "Sends you Cody's help menu.",
  cooldown: 90000,

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

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

    const embed = new MessageEmbed()
      .setColor(
        message.guild.me.displayHexColor === '#000000'
          ? 'GREEN'
          : message.guild.me.displayHexColor
      )
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setTitle("Cody's Help Menu")
      .setTimestamp()

    let fields = []
    client.categories.forEach(cat => {
      let cmds = client.commands.filter(cmd => cmd.category == cat)
      fields.push({
        name: `${cat} [${cmds.size}]`,
        value: cmds
          .map(cmd => `> \`${cmd.name}:\` ${cmd.description}`)
          .join('\n')
      })
    })

    embed.addFields(fields)

    message.channel.send({ embed: embed })
  }
}
