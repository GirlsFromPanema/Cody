const { Client, Message, MessageEmbed } = require("discord.js");


module.exports = {
  name: "fetch",
  cooldown: 360000,
  category: "👑 Owner",
  ownerOnly: true,
  description: "Cody Server Stats",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    
    if(!args[0]) return message.channel.send('`❌ | You must provide me with a guild id!`')

    let guild = message.client.guilds.cache.get(args[0]);

    if(!guild) return message.channel.send('`❌ | You must provide me with a guild id that I am already in!`')

    let inv; 
    inv = await guild.channels.cache.first().createInvite()
    console.log(inv)

        const embed = new MessageEmbed()
          .setColor('#2F3136')
          .setDescription(`✅ | Here is your invite to ${guild.name}: ${inv.url}`)

        message.channel.send(embed)
    
  },
};