const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Criar Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  imgId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = User = mongoose.model('users', UserSchema)