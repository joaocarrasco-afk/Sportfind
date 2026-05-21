const LocalizacaoController = require('../controllers/LocalizacaoController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: 100 * 1024 * 1024 }); 
const express = require('express');

const route = express.Router();

route.post('/localizacao', upload.single('image'), LocalizacaoController.criarLocalizacao);
route.get('/localizacao/:id', LocalizacaoController.mostrarLocalizacao);
route.get('/localizacao', LocalizacaoController.listarLocalizacoes);
route.put('/localizacao/:id', LocalizacaoController.atualizarLocalizacao);

module.exports = route;