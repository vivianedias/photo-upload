const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

// Carregar modelo User
const User = require('../../models/Users')
// Carregar modelo Images
const Images = require('../../models/Images')

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  let errors = {}
  User.findOne({ username: req.body.username })
    .then(user => {
      // Caso já exista um usuário com esse username, ele retorna um erro
      if (user) {
        errors.username = 'Esse username já foi usado'
        return res.status(400).json(errors)
      } else {
        const newUser = new User({
          name: req.body.name,
          username: req.body.username,
          imgId: req.body.imgId,
          description: req.body.description,
          location: req.body.location
        })
        newUser.save()
          .then(user => res.json(user))
          .catch(err => {
            // Caso dê um erro ao buscar usuário, a api retorna um erro
            console.log(err);
            res.status(404).json({ user: 'Erro ao salvar usuário' })
          })
      }
    })
    .catch(err => {
      // Caso dê um erro ao buscar usuário, a api retorna um erro
      console.log(err);
      res.status(404).json({ user: 'Erro ao cadastrar usuário' })
    })
})

// @route   GET api/users/:username
// @desc    Buscar usuário pelo username
// @access  Public
router.get('/:username', (req, res) => {
  const errors = {}
  User.findOne({ username: req.params.username })
    .then(user => {
      // Caso não haja nenhum usuário com esse username, a api retorna um erro
      if (!user) {
        errors.nousers = 'Esse usuário não existe'
        res.status(404).json(errors)
      }
      // Retorna o usuário
      res.json(user)
    })
    .catch(err => {
      // Caso dê um erro ao buscar usuário, a api retorna um erro
      console.log(err);
      res.status(404).json({ user: 'Erro ao buscar usuário' })
    })
})

// Setar engine de armazenamento
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
}).single('img')

// Check file type
const checkFileType = (file, cb) => {
  // Allow ext
  const fileTypes = /jpeg|jpg|png|gif/

  // Check ext
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  // Check mime
  const mimetype = fileTypes.test(file.mimetype)
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Erro: Insira apenas imagens')
  };
}

// @route   POST api/users/upload
// @desc    Upload img usuário
// @access  Public
router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    const errors = {}

    // Caso haja erro no upload, cair aqui
    if (err) {
      errors.upload = err
      return res.status(404).json(errors)
    }

    // Caso o usuário não insira n  enhuma imagem e tente fazer upload, cair aqui
    if (!req.file) {
      errors.upload = 'Insira uma foto de perfil'
      return res.status(400).json(errors)
    }

    // Salvar img
    new Images(req.file)
      .save()
      .then(img => res.json({
        msg: 'Upload da imagem foi bem sucedido!',
        file: `uploads/${img.filename}`,
        id: img._id
      }))
      .catch(() => {
        errors.upload = 'Ocorreu um erro ao fazer o upload da imagem'
        res.status(404).json(errors)
      })
  })
})

// @route   GET api/users/image
// @desc    Buscar img usuário
// @access  Public
router.get('/image/:imgId', (req, res) => {
  const errors = {}
  Images.findById(req.params.imgId)
    .then(img => {
      res.send(img)
    })
    .catch(() => {
      errors.upload = 'Ocorreu um erro ao carregar a imagem'
      res.status(404).json(errors)
    })
})

module.exports = router
