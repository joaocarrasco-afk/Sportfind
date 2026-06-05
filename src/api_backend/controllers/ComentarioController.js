const Comentario = require('../models/Comentario');

class ComentarioController{
    async criarComentario(req, res){
        try{
            const {userId, postId} = req.params;
            const {texto} = req.body;
            const comentario = await Comentario.criarComentario(userId, postId, texto);
            res.status(201).json(comentario);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao criar o comentário', error});
        }
    }

    async mostrarComentarios(req, res){
        try{
            const {postId} = req.params;
            const comentarios = await Comentario.mostrarComentarios(postId);
            res.status(200).json(comentarios);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao mostrar os comentários', error});
        }
    }

    async mostrarRespostas(req, res){
        try{
            const {comentarioPaiId} = req.params;
            const respostas = await Comentario.mostrarRespostas(comentarioPaiId);
            res.status(200).json(respostas);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao mostrar as respostas', error});
        }
    }

    async deletarComentario(req, res){
        try{
            const {comentarioId, userId} = req.params;
            const resultado = await Comentario.deletarComentario(comentarioId, userId);
            if(resultado?.error){
                return res.status(403).json({menssagem: resultado.error});
            }
            res.status(200).json(resultado);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao deletar o comentário', error});
        }
    }

    async editarComentario(req, res){
        try{
            const {comentarioId, userId} = req.params;
            const {texto} = req.body;
            const resultado = await Comentario.editarComentario(comentarioId, userId, texto);
            if(resultado?.error){
                return res.status(403).json({menssagem: resultado.error});
            }
            res.status(200).json(resultado);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao editar o comentário', error});
        }
    }  
    
    async criarResposta(req, res){
        try{
            const {postId, comentarioPaiId, userId} = req.params;
            const {texto} = req.body;
            const resposta = await Comentario.responderComentario(userId, postId, texto, comentarioPaiId);
            res.status(201).json(resposta);
        }catch(error){
            res.status(400).json({menssagem: 'Erro ao criar a resposta', error});
        }
    }

}

module.exports = new ComentarioController();