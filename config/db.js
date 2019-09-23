const mongoose = require('mongoose')
const keys = require('./keys')

const MONGO_USERNAME = 'viviane'
const MONGO_PASSWORD = keys.dbPassword
const MONGO_HOSTNAME = 'localhost'
const MONGO_PORT = '27017'
const MONGO_DB = 'photoupload'

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`

// Conectar com MongoDB
mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))
