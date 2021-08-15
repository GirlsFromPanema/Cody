const config = require('../config.json')
const mongoose = require('mongoose')

module.exports = {
  init: () => {
    if (!config.mongo_database_link)
      throw new Error(`Please provide a mongo db link in the config.json file`)

    mongoose.connect(config.mongo_database_link, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    mongoose.set('useFindAndModify', false)
    mongoose.Promise = global.Promise

    mongoose.connection.on('err', err => {
      console.log('MONGO DB ERROR\n\n' + err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('DISCONNECTED FROM THE DATABASE')
    })

    mongoose.connection.on('connected', () => {
      console.log('CONNECTED TO THE DATABASE')
    })
  }
}
