const EventoController = require('../controllers/EventoController');
const express = require('express');

const route = express.Router();

route.post('/evento', EventoController.criarEvento);
route.get('/evento', EventoController.listarEventos);
route.get('/evento/:id', EventoController.mostrarEvento);
route.put('/evento/:id', EventoController.editarEvento);
route.delete('/evento/:id', EventoController.deletarEvento);
route.post('/evento/:id/participar', EventoController.participarEvento);


module.exports = route;