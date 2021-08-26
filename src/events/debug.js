const client = require('../../src/index')

client.on('debug', async (info) => {
 console.log(info)
})
