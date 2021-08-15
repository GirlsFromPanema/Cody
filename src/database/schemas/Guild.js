const mongoose = require('mongoose')
const config = require('../../config.json')

const guild = mongoose.Schema({
  Id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  prefix: {
    type: mongoose.SchemaTypes.String,
    required: true,
    default: config.prefix
  },
  disabledCommands: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },
  disabledChannels: {
    type: mongoose.SchemaTypes.Array,
    default: []
  }
})
module.exports = mongoose.model('guild', guild)
