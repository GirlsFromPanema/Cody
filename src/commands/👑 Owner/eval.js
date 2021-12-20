const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'eval',
  category: '👑 Owner',
  description: 'Execute a code',
  ownerOnly: true,

  run: async (client, message, args, user, guild) => {
    const input = args.join(' ')
    if (!input) return message.channel.send({ content: 'Please enter a code to execute.'})

    const embed = new MessageEmbed()

    try {
      let output = eval(input)
      if (typeof output !== 'string')
        output = require('util').inspect(output, { depth: 0 })

      embed
        .addField(
          'Input',
          `\`\`\`js\n${
            input.length > 1024 ? 'Too large to display.' : input
          }\`\`\``,
        )
        .addField(
          'Output',
          `\`\`\`js\n${
            output.length > 1024
              ? 'Too large to display. Check console'
              : output
          }\`\`\``,
        )
        .setColor('#66FF00')

      if (output.length > 1024) {
        console.log(output)
      }
    } catch (err) {
      embed
        .addField(
          'Input',
          `\`\`\`js\n${
            input.length > 1024 ? 'Too large to display.' : input
          }\`\`\``,
        )
        .addField(
          'Output',
          `\`\`\`js\n${
            err.length > 1024 ? 'Too large to display.' : err
          }\`\`\``,
        )
        .setColor('#FF0000')
    }

    message.channel.send({ embeds: [embed] })
  },
}
