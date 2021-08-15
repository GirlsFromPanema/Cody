const { Client, Message, MessageEmbed } = require("discord.js");
const forbidded = require("../../banned")
const prefix = "$"

module.exports = {
  name: "say",
  description: "Display the Users avatar",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {

    const forbidden = [
      `trash`,
      "Trash",
      "@everyone",
      "@Everyone",
      "trash", 
      "Trash", 
      "gay", 
      "Gay", 
      "Trash", 
      "Gaylord", 
      "gaylord", 
      "Nigger", 
      "niger",
      "Cody trash",
      "trash Cody",
      "Asshole",
      "asshole",
      "Hoe",
      "hoe",
      "Nigga",
      "nigga",
      "cody trash",
      "noob"
      
    ];


    for (let i = 0; i < forbidden.length; i++) {
        if (message.content.includes(forbidden[i])) {
          message.delete();
          message.channel.send(`${message.author.username} you are not allowed to use that Word! I have blocked your last Input: ||${args[0]}||`);
          return; 
        }
      }

    if (!args[0])
      return message.channel.send(
        `I couldn't understand, could you repeat it please? But with a word please ...\nExample: **${prefix}say hello**`
      );

    

    message.channel.send(args[0]);
  },
};
