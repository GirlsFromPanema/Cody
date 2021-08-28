const client = require('../../src/index')
const config = require('../../src/config.json')
const prefix = client.prefix
const { Collection } = require('discord.js')
const Timeout = new Collection()
const ms = require('ms')
const User = require('../database/schemas/User')
const Guild = require('../database/schemas/Guild')

client.on('message', async message => {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return
  if (!message.guild) return
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g)
  const cmd = args.shift().toLowerCase()
  if (cmd.length == 0) return
  let command = client.commands.get(cmd)
  if (!command) command = client.commands.get(client.aliases.get(cmd))
  if (command) {
    let user = message.client.userSettings.get(message.author.id)

    if (!user) {
      const findUser = await User.findOne({ Id: message.author.id })
      if (!findUser) {
        const newUser = await User.create({ Id: message.author.id })
        message.client.userSettings.set(message.author.id, newUser)
        user = newUser
      } else return
    }

    let guild = message.client.guildSettings.get(message.guild.id)

    if (!guild) {
      const findGuild = await Guild.findOne({ Id: message.guild.id })
      if (!findGuild) {
        const newGuild = await Guild.create({ Id: message.guild.id })
        message.client.guildSettings.set(message.guild.id, newGuild)
        guild = newGuild
      } else return
    }

    if (guild.disabledChannels.includes(message.channel.id)) return
    if (guild.disabledCommands.includes(command.name || command)) return

    if (command.ownerOnly) {
      if (!config.developers.includes(message.author.id))
        return message.channel.send(
          '**> You do not have permission to use this command**'
        )
    }

    if (
      !message.guild.me.hasPermission([
        "EMBED_LINKS",
        "SEND_MESSAGES",
        "READ_MESSAGE_HISTORY",
        "VIEW_CHANNEL"
      ])
    )
      return message.channel.send(`
      ❌ I require some Permissions!

      **I need the following Permissions to work on your Server:**
      EMBED_LINKS, 
      SEND_MESSAGES, 
      READ_MESSAGE_HISTORY,
      VIEW_CHANNEL

      ⚠️ Please add me the right Permissions and re-run this Command!
  
      `);


    if (command.cooldown) {
      if (Timeout.has(`${command.name}${message.author.id}`))
        return message.channel.send({
          embed: `You are on a \`${ms(
            Timeout.get(`${command.name}${message.author.id}`) - Date.now(),
            { long: true }
          )}\` cooldown.`
        })
      command.run(client, message, args, user, guild)
      Timeout.set(
        `${command.name}${message.author.id}`,
        Date.now() + command.cooldown
      )
      setTimeout(() => {
        Timeout.delete(`${command.name}${message.author.id}`)
      }, command.cooldown)
    } else command.run(client, message, args, user, guild)
  }
})
