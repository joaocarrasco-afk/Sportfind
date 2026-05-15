const MensagemController = require('../controllers/MensagemController');
const express = require('express');

const route = express.Router();

route.post('/chat/:idChat/mensagem', MensagemController.enviarMensagem);
route.get('/chat/:idChat/mensagem', MensagemController.mostrarMensagens);
route.put('/chat/:idChat/mensagem/:idMensagem', MensagemController.editarMensagem);
route.delete('/chat/:idChat/mensagem/:idMensagem', MensagemController.deletarMensagem);

module.exports = route;