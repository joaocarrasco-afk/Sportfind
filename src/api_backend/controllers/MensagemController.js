const Mensagem = require('../models/Mensagem');

class MensagemController{

    async enviarMensagem(req, res){
        try{
            const {idChat} = req.params;
            const {idUsuario, mensagem} = req.body;
            const resultado = await Mensagem.enviarMensagem(idChat, idUsuario, mensagem);
            res.status(200).json(resultado);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao enviar a mensagem', error});
        }
    }

    mostrarMensagens(req, res){
        try{
            const { idChat } = req.params;

            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const cancelar = Mensagem.mostrarMensagens(idChat, (mensagens) => {
                res.write(`data: ${JSON.stringify(mensagens)}\n\n`);
            });

            req.on('close', () => {
                cancelar?.();
            });
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao mostrar as mensagens', error});
        }
    }

    async editarMensagem(req, res){
        try{
            const {idChat, idMensagem} = req.params;
            const {novaMensagem} = req.body;
            const resultado = await Mensagem.editarMensagem(idChat, idMensagem, novaMensagem);
            res.status(200).json(resultado);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao editar a mensagem', error});
        }
    }

    async deletarMensagem(req, res){
        try{
            const {idChat, idMensagem} = req.params;
            const resultado = await Mensagem.deletarMensagem(idChat, idMensagem);
            res.status(200).json(resultado);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao deletar a mensagem', error});
        }
    }




}

module.exports = new MensagemController();