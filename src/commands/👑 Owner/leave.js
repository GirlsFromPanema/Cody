const { Client, Message, MessageEmbed } = require("discord.js");
const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = {
  name: "leave",
  description: "Display the Users avatar",
  category: "Admin",
  ownerOnly: true,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {

    // Check the users input for a guild id.
    const guildId = args[0];
    if (!rgx.test(guildId)) return message.channel.send({ content: `Provide a guild`});

    // Check if the guild exists or the bot is in it.
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return message.channel.send({ content: `Invalid guild ID`});

    // If everything is fine, leave the guild.
    await guild.leave();

    // Create embed, send once done.
    const embed = new MessageEmbed()
      .setTitle("Leave Guild")
      .setDescription(`I have successfully left **${guild.name}**.`)
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    message.channel.send({embeds: [embed]});

  },
};
