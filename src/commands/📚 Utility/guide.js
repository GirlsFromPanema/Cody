const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'guide',
    description: "Display the Users avatar",
    category: '📚 Utility',
    aliases: "av",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {

        //message.delete()

        const infoembed = new MessageEmbed()
        .setTitle(`Cody's Advice`)
        .setFooter("Visit us at • cody-bot.xyz")
        .setThumbnail(message.author.displayAvatarURL({dynamic: true, size: 1024}))
        .setDescription([
            '**Stuck? Need more? No problem! ',
            '',
            '',
            '    ➜**Global Preference**',
            '• **[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)**',
            '• **[Python](https://docs.python.org/3/tutorial/index.html)**',
            '',
            '',
            '    ➜**Other Recources**',
            '• **[JS Tutorials(https://developer.mozilla.org/en-US/docs/Web/JavaScript)**',
            '• **[Py Tutorials](https://developer.mozilla.org/en-US/docs/Glossary/Python)**',
            '',
            '',
            '    ➜**Basic Tipps**',
            '•  The best thing you can do is **learning by doing**',
            '•  Programming is not easy, it takes a while! With many recources you can get the best experience',
            '•  By the way, you can invite me [here](https://cody-bot.xyz)',
            '',
            '',
            '**Happy Coding 😎**',
            ]);
        
        //.setTimestamp()

        await message.channel.send({embed: infoembed}).then(( m => m.react("👽")))
        
    }
}