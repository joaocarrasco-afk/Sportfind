const UsuarioController = require('../controllers/UsuarioController');
const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: 100 * 1024 * 1024 }); 

// Cria o agrupador de rotas relacionadas a usuário
const route = express.Router()

// Rota para cadastrar novo usuário
route.post('/usuario/cadastro', UsuarioController.criarUsuario);
// Rota para autenticar usuário
route.post('/usuario/login', UsuarioController.login);
// Rota para enviar o link para redefinir a senha no e-mail
route.post('/usuario/redefinirsenha', UsuarioController.linkRedefinirSenha);

route.get('/usuario/perfil/:id', UsuarioController.dadosPerfil);

route.put('/usuario/conta/:id', UsuarioController.atualizarDados);

route.put('/usuario/perfil/:id', upload.single('image'), UsuarioController.editarFoto );

route.put('/usuario/seguir/:id', UsuarioController.seguirUsuario);

route.put('/usuario/deixarseguir/:id', UsuarioController.deixarSeguirUsuario);

module.exports = route;


