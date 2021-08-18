const Discord = require("discord.js");
const User = require("../../database/schemas/User");
const moment = require("moment");
require("moment-duration-format");
const { stripIndent } = require('common-tags');

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


    const infos = stripIndent`
    Bot Information
    • Ping     : ${client.ws.ping}ms
    • Uptime   : ${moment.duration(client.uptime).format("H [hours and] m [minutes]")}
    • Servers  : ${client.guilds.cache.size}
    • Users    : ${client.users.cache.size}
    • Channels : ${client.channels.cache.size}\n
    Database Information: 
    - Users    : ${users.length} users
    - Total XP : ${users.length > 1 ? users.reduce((a, b) => {return a.xp || 0 + b.xp || 0;}): users.xp || 0} XP`;
    	
    const embed = new Discord.MessageEmbed()
      .setTitle("Cody's Information")
      .setColor("#2f3136")
      //.setColor(message.guild.me.displayHexColor)
      .setTimestamp()
      .setFooter("cody-bot.xyz",  message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(`\`\`\`diff\n${infos}\`\`\``)
        

    return message.channel.send({ embed: embed });
  },
};

function UpperCase(inputString) {
  return inputString.replace(inputString[0], inputString[0].toUpperCase());
}
