const Usuario = require('../models/Usuario');

class UsuarioController{
    // Recebe os dados da requisição e aciona o serviço de cadastro
    async criarUsuario(req, res){
        try {
            const { nome, email, senha, username, data_nascimento } = req.body;
            const uid = await Usuario.criarUsuario(nome, email, senha, username, data_nascimento);
            // Retorna sucesso na criação da conta
            res.status(201).json({ uid });
        } catch (error) {
            // Retorna erro quando não for possível concluir o cadastro
            res.status(400).json({ mensagem: 'Não foi possível criar a conta.' });
        }
    }
    // Recebe credenciais e aciona o serviço de autenticação
    async login(req, res){
        try {
            const { email, senha } = req.body;
            const usuario = await Usuario.login(email, senha);
            // Retorna os dados básicos do usuário autenticado
            res.status(200).json(usuario);
        } catch (error) {
            // Retorna erro quando as credenciais forem inválidas
            res.status(401).json({ mensagem: 'Credenciais inválidas.' });
        }
    }
}

module.exports = new UsuarioController();