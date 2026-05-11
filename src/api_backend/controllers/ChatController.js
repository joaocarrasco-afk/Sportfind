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


}

module.exports = new ChatController();