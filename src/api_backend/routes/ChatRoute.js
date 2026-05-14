const ChatController = require('../controllers/ChatController');
const express = require('express');

const route = express.Router();

route.post('/chat', ChatController.criarChatPV);
route.post('chat/grupo', ChatController.criarChatGrupo);
route.post('/chat/grupo/:id/adicionar', ChatController.adicionarMembroGrupo);


module.exports = route;

