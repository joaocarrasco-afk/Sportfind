const express = require('express');
const ComentarioController = require('../controllers/ComentarioController');

const route = express.Router();

route.post('/comentario/:userId/:postId', ComentarioController.criarComentario);
route.get('/comentarios/:postId', ComentarioController.mostrarComentarios);
route.get('/respostas/:comentarioPaiId', ComentarioController.mostrarRespostas);
route.delete('/comentario/:comentarioId/:userId', ComentarioController.deletarComentario);
route.put('/comentario/:comentarioId/:userId', ComentarioController.editarComentario);
route.post('/resposta/:postId/:comentarioPaiId/:userId', ComentarioController.criarResposta);

module.exports = route;