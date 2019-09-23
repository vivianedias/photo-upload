const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const db = require('./config/db')

const users = require('./routes/api/users')

// Executando express
const app = express()

// Middleware do body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Adicionando Helmet para melhorar a segurança da API
app.use(helmet())

// Habilitando CORS para todos os requests
app.use(cors())

// Usar Routes
app.use('/api/users', users)

// Acessar arquivos de imagem salvos
app.use(express.static('public'))

// Definir porta que o app irá rodar
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running on port ${port}`))