const express = require('express');
const UsuarioRoute = require('./routes/UsuarioRoute');
const ChatRoute = require('./routes/ChatRoute');

// Inicializa a aplicação Express
const app = express();
const PORT = 3000;

// Permite receber requisições com corpo em JSON
app.use(express.json());
// Registra as rotas de usuário na aplicação
app.use(UsuarioRoute);

app.use(ChatRoute);

// Inicia o servidor HTTP na porta definida
app.listen(PORT, () => {
    console.log(`Servidor está rodando em localhost:${PORT}`)
})
