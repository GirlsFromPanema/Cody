module.exports = {
  name: 'ping',
  category: 'ℹ️ Information',
  description: 'Returns latency and API ping',

  run: async (client, message, args, user, guild) => {
    // Send a "Pinging" Message
    const msg = await message.channel.send({ content: '🏓 Pinging...'})

    //Check if the message was already edited
    const timestamp = message.editedTimestamp
      ? message.editedTimestamp
      : message.createdTimestamp

    //define the bot's latency
    const latency = `\`\`\`js\nLatency: ${Math.floor(
      msg.createdTimestamp - timestamp
    )}ms\nAPI: ${Math.round(message.client.ws.ping)}ms\n\`\`\``

    //edit the message so that it displays the real ping
    msg.edit(latency)
  }
}
