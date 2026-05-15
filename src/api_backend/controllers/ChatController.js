const Chat = require('../models/Chat');

class ChatController{

    async criarChatPV(req, res){
        try{
            const{id, username} = req.body;
            const resultado = await Chat.rotaDoChatPV(id, username);
            res.status(201).json(resultado);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao criar o chat', error});
        }
    }

    async criarChatGrupo(req, res){
        try{
            const {idAdm, userIds, nome_grupo} = req.body;
            const resultado = await Chat.criarChatGrupo(idAdm, userIds, nome_grupo);
            res.status(201).json(resultado);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao criar o chat', error});
        }
    }

    async adicionarMembroGrupo(req, res){
        try{
            const {idChat} = req.params;
            const {idUsuario} = req.body;
            const resultado = await Chat.adicionarMembroGrupo(idChat, idUsuario);
            res.status(200).json(resultado);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao adicionar membro ao grupo', error});
        }
    }

    async editarChatGrupo(req, res){
        try{
            const {idChat} = req.params;
            const {nome_grupo, descricao} = req.body;
            const resultado = await Chat.editarChatGrupo(idChat, {nome_grupo, descricao});
            res.status(200).json(resultado);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao editar o grupo', error});
        }
    }

    async informacoesGrupo(req, res){
        try{
            const {idChat} = req.params;
            const resultado = await Chat.informacoesGrupo(idChat);
            res.status(200).json(resultado);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao editar o grupo', error});
        }
    }

    async sairGrupo(req, res){
        try{
            const {idChat, idUsuario} = req.params;
            const resultado = await Chat.sairGrupo(idChat, idUsuario);
            res.status(200).json(resultado);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao sair do grupo', error});
        }
    }

    async promoverAdm(req, res){
        try{
            const {idChat, idUsuario} = req.params;
            const resultado = await Chat.promoverAdm(idChat, idUsuario);
            res.status(200).json(resultado);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao sair do grupo', error});
        }
    }

    async listarChat(req, res){
        try{
            const {idUsuario} = req.params;
            const resultado = await Chat.listarChat(idUsuario);
            res.status(200).json(resultado);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao listar o chat', error});
        }
    }


}

module.exports = new ChatController();