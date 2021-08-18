const Discord = require("discord.js");
const User = require("../../database/schemas/User");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: "botinfo",
  category: "ℹ️ Information",
  description: "Sends you Cody's information",
  cooldown: 5,
  aliases: ["bi", "stats"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, user, guild) => {
    const users = await User.find();

    const embed = new Discord.MessageEmbed()
      .setTitle("Cody's Information")
      .setColor(message.guild.me.displayHexColor)
      .setTimestamp()
      .setFooter("cody-bot.xyz",  message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `**Ping:** \`${client.ws.ping}ms\`\n
        **Uptime:** \`${moment.duration(client.uptime).format("H [hours and] m [minutes]")}\`\n
        **Servers:** \`${client.guilds.cache.size}\`\n
        **Users:** \`${client.users.cache.size}\`\n
        **Channels:** \`${client.channels.cache.size}\`\n
        **CPU / RAM:** \`AMD Ryzen 5 5600X 6-Core | 3.85GB / 16GB\`\n\n
        **♨️ __Database Information:__ ♨️**\n
        **Users:** \`${users.length} users\`\n
        **Total XP:** \`${users.length > 1 ? users.reduce((a, b) => {return a.xp || 0 + b.xp || 0;}): users.xp || 0} XP\``);

    return message.channel.send({ embed: embed });
  },
};

function UpperCase(inputString) {
  return inputString.replace(inputString[0], inputString[0].toUpperCase());
}
