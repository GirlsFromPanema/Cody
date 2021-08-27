const { Client, Message, MessageEmbed } = require("discord.js");


module.exports = {
  name: "fetch",
  cooldown: 10,
  category: "👑 Owner",
  description: "Lists Codys Servers",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (message.author.id !== "578678204890349594") {
      return message.channel.send(
        ":x: | You are not allowed to use this Command"
      );
    }
    if(!args[0]) return message.channel.send('`❌ | You must provide me with a guild id!`')

    let guild = message.client.guilds.cache.get(args[0]);

    if(!guild) return message.channel.send('`❌ | You must provide me with a guild id that I am already in!`')

    let inv; 
    inv = await message.channel.createInvite({maxage: 10 * 60 * 1000, maxUses: 1})
    console.log(inv)

        const embed = new MessageEmbed()
          .setColor('#2F3136')
          .setDescription(`✅ | Here is your invite to ${guild.name}: ${inv.url}`)

        message.channel.send(embed)
    
  },
};
