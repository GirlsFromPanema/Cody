const { Client, Message, MessageEmbed } = require("discord.js");
const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = {
  name: "statistic",
  description: "Display the Users avatar",
  ownerOnly: true,
  category: "Secret",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {

    const guildId = args[0];

    if (!rgx.test(guildId)) return message.channel.send(`:x: | Provide a guild`);

    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return message.channel.send(`:x: | Invalid guild ID`);

    const bots = guild.members.cache.filter((m) => m.user.bot).size;

    const embed = new MessageEmbed()
      .setTitle("Guild Stats")
      .setDescription(`**Name:** ${guild.name}.\n**Owner:** ${guild.owner.user.tag}\n**Total Members:** ${guild.memberCount}\n**Total Bots:** ${bots}\n**Created:** ${guild.createdAt}\n**Channels:** ${guild.channels.cache.size}\n**Roles:** ${guild.roles.cache.size}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor("RED");
    message.channel.send({embed: embed});
  },
};