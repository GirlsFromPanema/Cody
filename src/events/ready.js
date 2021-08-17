const client = require('../../src/index')
const User = require('../database/schemas/User')
const Guild = require('../database/schemas/Guild')

client.on('ready', async () => {
  console.log(`${client.user.tag} is now online!`)

<<<<<<< HEAD
  client.user.setActivity('$help • cody-bot.xyz', { type: 'PLAYING' })
=======
  client.user.setActivity('$help | cody-bot.eu', { type: 'PLAYING' })
>>>>>>> baeda548631cefd6b9a789cf231a5bf90aee4e0e

  const users = await User.find()
  for (let user of users) {
    client.userSettings.set(user.Id, user)
  }

  const guilds = await Guild.find()
  for (let guild of guilds) {
    client.guildSettings.set(guild.Id, guild)
  }

  require("../handlers/premium")(client)
})
