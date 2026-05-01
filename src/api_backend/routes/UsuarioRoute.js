const UsuarioController = require('../controllers/UsuarioController');
const express = require('express');

// Cria o agrupador de rotas relacionadas a usuário
const route = express.Router()

// Rota para cadastrar novo usuário
route.post('/usuario/cadastro', UsuarioController.criarUsuario);
// Rota para autenticar usuário
route.post('/usuario/login', UsuarioController.login);

module.exports = route;


