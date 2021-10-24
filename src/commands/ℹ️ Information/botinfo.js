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


    const users = await User.find(); 


    let totalXP = 0;
    if(users.length && users.length > 0){
      for(let i = 0; i < users.length; i++){
        const user = users[i];
        if(user && user.xp){
          totalXP = totalXP + user.xp
        }
      }
    }


    const infos = stripIndent`
    Bot Information:
    • Ping     : ${client.ws.ping}ms
    • Uptime   : ${moment.duration(client.uptime).format("H [hours and] m [minutes]")}
    • Servers  : ${client.guilds.cache.size}
    • Users    : ${client.users.cache.size}
    • Library :  DiscordPHP\n
    Database Information: 
    - Database : Mongoose
    - Users    : ${users.length} users
    - Total XP : ${totalXP} XP`;
    	
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
