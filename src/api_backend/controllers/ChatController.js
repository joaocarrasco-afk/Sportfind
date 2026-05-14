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
            const {idChat, idUsuario} = req.body;
            const resultado = await Chat.adicionarMembroGrupo(idChat, idUsuario);
            res.status(200).json(resultado);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao adicionar membro ao grupo', error});
        }
    }


}

module.exports = new ChatController();