const mongoose = require('mongoose')

const user = mongoose.Schema({
  Id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  isPremium: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },
  hide: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },
  xp: {
    type: mongoose.SchemaTypes.Number,
    default: 0
  },
  enrolled: {
    type: mongoose.SchemaTypes.Number,
    default: null
  },
  courses: [
    {
      name: mongoose.SchemaTypes.String,
      course: {
        enrolled: mongoose.SchemaTypes.Number,
        Level: mongoose.SchemaTypes.Number,
        step: mongoose.SchemaTypes.Number,
        xp: mongoose.SchemaTypes.Number,
        finished: { type: mongoose.SchemaTypes.Boolean, default: false }
      }
    }
  ],
  premium: {
    redeemedBy: {
      type: mongoose.SchemaTypes.Array,
      default: null
    },

    redeemedAt: {
      type: mongoose.SchemaTypes.Number,
      default: null
    },

    expiresAt: {
      type: mongoose.SchemaTypes.Number,
      default: null
    },

    plan: {
      type: mongoose.SchemaTypes.String,
      default: null
    }
  }
})
module.exports = mongoose.model('user', user)
