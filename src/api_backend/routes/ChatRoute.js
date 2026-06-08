const ChatController = require('../controllers/ChatController');
const express = require('express');

const route = express.Router();

route.post('/chat', ChatController.criarChatPV);
route.post('/chat/pv', ChatController.buscarOuCriarChatPV);
route.get('/chat/pv/:idUsuario', ChatController.listarChatsPV);
route.post('/chat/grupo', ChatController.criarChatGrupo);
route.post('/chat/grupo/:idChat/adicionar', ChatController.adicionarMembroGrupo);
route.put('/chat/grupo/:idChat/editar', ChatController.editarChatGrupo);
route.get('/chat/grupo/:idChat/informacoes', ChatController.informacoesGrupo);
route.put('/chat/grupo/:idChat/:idUsuario/sair', ChatController.sairGrupo);
route.put('/chat/grupo/:idChat/:idUsuario/promover', ChatController.promoverAdm);
route.get('/chat/:idUsuario', ChatController.listarChat);

module.exports = route;

