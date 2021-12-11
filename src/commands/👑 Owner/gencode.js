const Discord = require('discord.js')
const schema = require('../../database/schemas/Code')
const moment = require('moment')
var voucher_codes = require('voucher-code-generator')

module.exports = {
  name: 'gencode',
  category: '👑 Owner',
  description: 'Generates a premium code',
  ownerOnly: true,

  run: async (client, message, args, user, guild) => {
    let codes = []

    const plan = args[0]
    const plans = ['daily', 'weekly', 'monthly', 'yearly']

    if (!plan) return message.channel.send(`**> Please provide plan**`)

    if (!plans.includes(args[0]))
      return message.channel.send(
        `**Invalid Plan, available plans:** ${plans.join(', ')}`
      )

    let time
    if (plan === 'daily') time = Date.now() + 86400000
    if (plan === 'weekly') time = Date.now() + 86400000 * 7
    if (plan === 'monthly') time = Date.now() + 86400000 * 30
    if(plan === 'yearly') time = Date.now() + 86400000 * 365

    let amount = args[1]
    if (!amount) amount = 1

    for (var i = 0; i < amount; i++) {
      const codePremium = voucher_codes.generate({
        pattern: '####-####-####'
      })

      const code = codePremium.toString().toUpperCase()

      const find = await schema.findOne({
        code: code
      })

      if (!find) {
        schema.create({
          code: code,
          plan: plan,
          expiresAt: time
        })

        codes.push(`${i + 1}- ${code}`)
      }
    }

    message.channel.send(
      `\`\`\`Generated +${codes.length}\n\n--------\n${codes.join(
        '\n'
      )}\n--------\n\nType - ${plan}\nExpires - ${moment(time).format(
        'dddd, MMMM Do YYYY'
      )}\`\`\`\nTo redeem, use \`$redeem <code>\``
    )
  }
}
