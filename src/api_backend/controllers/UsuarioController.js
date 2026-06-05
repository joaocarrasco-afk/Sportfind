const Usuario = require('../models/Usuario');

class UsuarioController{
    // Recebe os dados da requisição e aciona o serviço de cadastro
    async criarUsuario(req, res){
        try {
            const { nome, email, senha, username, data_nascimento } = req.body;
            
            const resultado = await Usuario.criarUsuario(nome, email, senha, username, data_nascimento);
            if (!resultado?.uid) {
                res.status(400).json({ mensagem: 'Não foi possível criar a conta.', resultado });
                return;
            }
            res.status(201).json(resultado);
        } catch (error) {
            // Retorna erro quando não for possível concluir o cadastro
            
            res.status(400).json({ mensagem: 'Não foi possível criar a conta.', resultado});
        }
    }
    // Recebe credenciais e aciona o serviço de autenticação
    async login(req, res){
        try {
            const { email, senha } = req.body;
            const resultado = await Usuario.login(email, senha);
            // Retorna os dados básicos do usuário autenticado
            res.status(200).json(resultado);
        } catch (error) {
            // Retorna erro quando as credenciais forem inválidas
            res.status(401).json({ mensagem: 'Credenciais inválidas.'});
        }
    }

    // Recebe o email para manda o link
    async linkRedefinirSenha(req, res){
        try{
            const {email} = req.body;
            const usuario = await Usuario.linkRedefinirSenha(email);
            res.status(200).json(usuario);
        }catch(error){
            res.status(400).json({mensagem: 'Não foi possível enviar o link'});
        }
    }

    async dadosPerfil(req, res){
        try{
            const { id } = req.params;
            const dados = await Usuario.dadosPerfil(id);
            if(!dados){
                res.status(404).json({messagem: 'Perfil não encontrado'});
                return;
            }
            res.status(200).json(dados);
        }catch(error){
            res.status(400).json({messagem: `Não foi possivel carregar o perfil: ${error} `});
        }
    }

    async atualizarDados(req, res) {
        try {
            const { id } = req.params;
            const { nome, username, telefone} = req.body;
            const dados = await Usuario.atualizarDados(id, {
                nome,
                username,
                telefone,
            });
            if (!dados) {
                res.status(404).json({ mensagem: 'Perfil não encontrado.' });
                return;
            }
            res.status(200).json(dados);
        } catch (error) {
            res.status(400).json({
                mensagem: error.message || 'Não foi possível atualizar os dados.',
            });
        }
    }

    async editarFoto(req, res){
        try{
            const { id } = req.params;
            const file = req.file;
            if (!file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
            const fileBuffer = file.buffer;
            const fotoAtualizada = await Usuario.editarFoto(id, fileBuffer);
            res.status(200).json(fotoAtualizada);
        }catch(error){
            res.status(400).json({mensagem: `Não foi possivel editar a foto: ${error} `});
        }
    }

    async seguirUsuario(req, res){
        try{
            const { id } = req.params;
            const { idSeguir } = req.body;
            const resultado = await Usuario.seguirUsuario(id, idSeguir);
            res.status(200).json(resultado);
        }catch(error){
            res.status(400).json({mensagem: `Não foi possível seguir o usuário: ${error}`});
        }
    }

    async deixarSeguirUsuario(req, res){
        try{
            const { id } = req.params;
            const { idSeguir } = req.body;
            const resultado = await Usuario.deixarSeguirUsuario(id, idSeguir);
            res.status(200).json(resultado);
        }catch(error){
            res.status(400).json({mensagem: `Não foi possível deixar de seguir o usuário: ${error}`});
        }
    }

}

module.exports = new UsuarioController();