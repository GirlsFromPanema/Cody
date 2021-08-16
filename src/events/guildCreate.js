const client = require("../index");
const { Discord, MessageEmbed } = require("discord.js");



client.on("guildCreate", (guild) => {
    let channelToSendTo;

    guild.channels.cache.forEach((channel) => {
        if (
            channel.type === "text" &&
            !channelToSendTo &&
            channel.permissionsFor(guild.me).has("SEND_MESSAGES")
        )
        channelToSendTo = channel;
    });

    if(!channelToSendTo);

  const embed = new MessageEmbed()                              
  .setAuthor(guild.name, guild.iconURL({ dynamic: true}))
  .setImage("https://cdn.discordapp.com/attachments/876477209186017340/876820442562822184/Rd0c07cb2486f8c6aa515c4f9fc608357.png")
  .setColor("BLURPLE")
  .setDescription([
    '**Hey there, Cody here! Thanks for inviting me!** 👋',
    '',
    `Standard Prefix: **\`$\`**`,
    `Commands: **\`$help\`**`,
    '',
    '    🌐**Help & Support**',
    '• **[Status](https://www.google.com)**',
    '• **[Support Server](https://docs.Aeo.com)**',
    '',
    '',
    '    💠**Other Links**',
    '• **[Dashboard](https://Aeo.com/dashboard)**',
    '• **[Invite Cody](https://Aeo.xyz/invite)**',
    '',
    '',
    '    🔎**Information**',
    '•  I am here to teach you Coding, I have many languages you can choose from',
    '•  From the Basic/Beginner Level to the advanced World of **JavaScript** - **Python** and more!',
    '',
    '',
    '**Have a great day! 😎**',
    ]);
});











    
