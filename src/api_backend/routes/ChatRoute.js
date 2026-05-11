const ChatController = require('../controllers/ChatController');
const express = require('express');

const route = express.Router();

route.post('/chat', ChatController.criarChatPV);


module.exports = route;

