const { Client, Message, MessageEmbed } = require("discord.js");
const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = {
  name: "leave",
  description: "Display the Users avatar",
  category: "Admin",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {

    if(message.author.id !== "578678204890349594") {
        return message.channel.send({ content: ":x: | You are not allowed to use this Command"})
    }


    const guildId = args[0];
    if (!rgx.test(guildId)) return message.channel.send({ content: `Provide a guild`});
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return message.channel.send({ content: `Invalid guild ID`});
    await guild.leave();
    const embed = new MessageEmbed()
      .setTitle("Leave Guild")
      .setDescription(`I have successfully left **${guild.name}**.`)
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({embed: embed});
  },
};
