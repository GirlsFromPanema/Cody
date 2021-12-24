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

    // Check the Users Input for a Guild ID
    const guildId = args[0];
    if (!rgx.test(guildId)) return message.channel.send({ content: `:x: | Provide a guild`});

    // Fetch the Guild and check if it exists or if the bot is in it.
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return message.channel.send({ content: `:x: | Invalid guild ID`});

    // Check the total amount of Bots in the Guild.
    const bots = guild.members.cache.filter((m) => m.user.bot).size;

    // Create the embed and send it.
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
      
    message.channel.send({ embeds: [embed]});
  },
};