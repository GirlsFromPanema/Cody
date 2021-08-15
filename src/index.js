const { Collection, Client } = require('discord.js')
const client = new Client({
  disableMention: 'everyone'
})
const mongoose = require('./database/mongoose')
const path = require('path')
const fs = require('fs')
const config = require('./config.json')
module.exports = client
client.commands = new Collection()
client.prefix = config.prefix
client.aliases = new Collection()
client.guildSettings = new Collection();
client.userSettings = new Collection();
client.categories = fs.readdirSync(path.resolve('src/commands'))
;['command'].forEach(handler => {
  require(path.resolve(`src/handlers/${handler}`))(client)
})

mongoose.init()
client.login(config.token)
require('./dashboard/index')(client)
