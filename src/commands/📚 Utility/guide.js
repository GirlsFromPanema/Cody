const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "guide",
  description: "Display the Users avatar",
  category: "📚 Utility",
  aliases: "av",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    //message.delete()

    const infoembed = new MessageEmbed()
      .setTitle(`Cody's Advice`)
      .setFooter("Visit us at • cody-bot.xyz")
      .setThumbnail(
        message.author.displayAvatarURL({ dynamic: true, size: 1024 })
      )
      .setDescription([
        "**Stuck? Need more? No problem! ",
        "",
        "",
        "    ➜ Global Preference",
        "• [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)",
        "• [Python](https://docs.python.org/3/tutorial/index.html)",
        "",
        "",
        "    ➜ Other Recources",
        "• [JS Tutorials](https://developer.mozilla.org/en-US/docs/Web/JavaScript)",
        "• [Py Tutorials](https://developer.mozilla.org/en-US/docs/Glossary/Python)",
        "",
        "",
        "    📝Bot Guide",
        "•  To start, you have to run the enroll Command, this will ask you which course you would like to join.",
        "•  After that, run the resume (+ course) command, this will continue in DMs.",
        "•  By the way, you can invite me [here](https://cody-bot.xyz)",
        "•  You can run the $info Command to learn more about the Bot and access the Dashboard!",
        "",
        "",
        "Happy Coding 😎",
      ]);

    //.setTimestamp()

    await message.channel.send({ embed: infoembed }).then((m) => m.react("👽"));
  },
};
