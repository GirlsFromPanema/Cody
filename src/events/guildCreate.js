/*
const client = require("../index");
const { Discord, MessageEmbed, Guild } = require("discord.js");



const embed = new MessageEmbed()                              
  //.setAuthor(guild.name, guild.iconURL({ dynamic: true}))
  .setThumbnail("https://cdn.discordapp.com/attachments/876477209186017340/876820442562822184/Rd0c07cb2486f8c6aa515c4f9fc608357.png", {size: 1024})
  .setColor("BLURPLE")
  .setDescription([
    '**Hey there, Cody here! Thanks for inviting me!** 👋',
    '',
    `Standard Prefix: **\`$\`**`,
    `Commands: **\`$help\`**`,
    '',
    '    🌐**Help & Support**',
    '• **[Status](https://cody-bot.xyz/status)**',
    '• **[Support Server](https://docs.Aeo.com)**',
    '• **[Contact us](https://cody-bot.xyz/contact)**',
    '',
    '',
    '    💠**Other Links**',
    '• **[Dashboard](https://cody-bot.xyz/panel)**',
    '• **[Invite Cody](https://cody-bot.xyz)**',
    '',
    '',
    '    🔎**Information**',
    '•  I am here to teach you Coding, I have many languages you can choose from',
    '•  From the Basic/Beginner Level to the advanced World of **JavaScript** - **Python** and more!',
    '•  You can configurate me trough my [Dashboard](https://cody-bot.xyz/panel)',
    '',
    '',
    '**Have a great day! 😎**',
    ]);


client.on('guildCreate', (guild) => {
    guild.systemChannel.send({ embed: embed }).catch(() => {});
  });
  */