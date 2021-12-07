const client = require('../../src/index')

// Mongoose debugging before production
client.on('debug', async (info) => {
 console.log(info)
})
