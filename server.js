const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const UsuarioRoute = require('./src/api_backend/routes/UsuarioRoute');
const ChatRoute = require('./src/api_backend/routes/ChatRoute');
const MensagemRoute = require('./src/api_backend/routes/MensagemRoute');
const FeedRoute = require('./src/api_backend/routes/FeedRoute');
const ComentarioRoute = require('./src/api_backend/routes/ComentarioRoute');
const LocalizacaoRoute = require('./src/api_backend/routes/LocalizacaoRoute');
const EventoRoute = require('./src/api_backend/routes/EventoRoute');
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
