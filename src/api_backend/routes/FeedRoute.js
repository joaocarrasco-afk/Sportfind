const FeedController = require('../controllers/FeedController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: 100 * 1024 * 1024 }); 
const express = require('express');

const route = express.Router();


route.post('/feed/post/:userId', upload.single('image'), FeedController.criarPost);
route.get('/feed', FeedController.mostrarFeed);
route.get('/feed/post/:userId', FeedController.mostrarPostUsuario);
route.get('/feed/post/usuario/:postId', FeedController.post);
route.delete('/feed/post/:postId/:userId', FeedController.deletarPost);
route.put('/feed/post/:postId/:userId', FeedController.editarPost);


module.exports = route;
