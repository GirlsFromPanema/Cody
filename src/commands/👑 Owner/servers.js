const { Client, Message, MessageEmbed } = require("discord.js");
const ReactionMenu = require("../../data/ReactionMenu.js");

module.exports = {
  name: "servers",
  cooldown: 10,
  category: "👑 Owner",
  ownerOnly: true, 
  description: "Lists Codys Servers",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, guild) => {
    

    const owner = await message.guild.members.fetch(guild.ownerID) 
    .then(guildMember => sOwner = guildMember) 


    const servers = message.client.guilds.cache.array().map((guild) => {
      return `${guild.member(sOwner) ? sOwner.toString() : guild.owner.user.tag} - \`${guild.id}\` - **${guild.name}** - \`${guild.memberCount}\` members`;
    });

    const embed = new MessageEmbed()
      .setTitle("Server List")
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor("BLURPLE");

    if (servers.length <= 10) {
      const range = servers.length == 1 ? "[1]" : `[1 - ${servers.length}]`;
      message.channel.send(
        embed
          .setTitle(`Server List ${range}`)
          .setDescription(servers.join("\n"))
      );
    } else {
      new ReactionMenu(
        message.client,
        message.channel,
        message.member,
        embed,
        servers
      );
    }
  },
};
