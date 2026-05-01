const Usuario = require('../models/Usuario');

class UsuarioService{
    // Encaminha os dados recebidos para criação de usuário no model
    async criarUsuario(nome, email, senha, username, data_nascimento){
        return await Usuario.criarUsuario(nome, email, senha, username, data_nascimento);
    }
    // Encaminha a autenticação para o model
    async login(email, senha){
        return await Usuario.login(email, senha);
    }
}

module.exports = new UsuarioService();