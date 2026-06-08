const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const express = require('express');
const UsuarioRoute = require('./routes/UsuarioRoute');
const ChatRoute = require('./routes/ChatRoute');
const MensagemRoute = require('./routes/MensagemRoute');
const FeedRoute = require('./routes/FeedRoute');
const ComentarioRoute = require('./routes/ComentarioRoute');
const LocalizacaoRoute = require('./routes/LocalizacaoRoute');
const EventoRoute = require('./routes/EventoRoute');
// Inicializa a aplicação Express
const app = express();
const PORT = 3000;

// Permite receber requisições com corpo em JSON
app.use(express.json());
app.use(UsuarioRoute);
app.use(ChatRoute);
app.use(MensagemRoute);
app.use(FeedRoute);
app.use(ComentarioRoute);
app.use(LocalizacaoRoute);
app.use(EventoRoute);

// Inicia o servidor HTTP na porta definida
app.listen(PORT, () => {
    console.log(`Servidor está rodando em localhost:${PORT}`)
})
