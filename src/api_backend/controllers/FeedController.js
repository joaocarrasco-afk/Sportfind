const Feed = require('../models/Feed');

class FeedController{

    async criarPost(req, res) {
        try {
            const { descricao } = req.body;
            const {userId} = req.params; 
            const file = req.file;
            if (!file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
            const tipo = file.mimetype.startsWith('image/') ? 'image' : (file.mimetype.startsWith('video/') ? 'video' : 'media');
            if(tipo === 'media') return res.status(400).json({ error: 'Tipo de arquivo não suportado' });

            
            const message = await Feed.criarPost({
            descricao,
            userId,
            fileBuffer: file.buffer,
            tipo 
            });

            res.status(201).json(message);
        } catch (err) {
            res.status(500).json({ error: 'Falha no upload' });
        }
    }

    async mostrarFeed(req, res) {
        try {
            const feed = await Feed.mostrarFeed();
            res.status(200).json(feed);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao mostrar feed' });
        }
    }

    async mostrarPostUsuario(req, res) {
        try {
            const { userId } = req.params;
            const feed = await Feed.mostrarPostUsuario(userId);
            res.status(200).json(feed);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao mostrar feed do usuário' });
        }
    }

    async post(req, res) {
        try {
            const { postId } = req.params;
            const post = await Feed.post(postId);
            if (!post) return res.status(404).json({ error: 'Post não encontrado' });
            res.status(200).json(post);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao mostrar post' });
        }
    }

    async deletarPost(req, res) {
        try {
            const { postId, userId } = req.params;
            await Feed.deletarPost(postId, userId);
            res.status(200).json({ message: 'Post deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao deletar post' });
        }
    }

    async editarPost(req, res) {
        try {
            const {postId, userId} = req.params;
            const { descricao } = req.body;
            await Feed.editarPost(postId, descricao, userId);
            res.status(200).json({ message: 'Post editado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao editar post' });
        }
    }

    async likePost(req, res) {
        try {
            const { postId, userIdCurtiu } = req.params;
            await Feed.likePost(postId, userIdCurtiu);
            res.status(200).json({ message: 'Post curtido com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao curtir post' });
        }
    }

    async tirarLikePost(req, res) {
        try {
            const { postId, userIdCurtiu } = req.params;
            await Feed.tirarLikePost(postId, userIdCurtiu);
            res.status(200).json({ message: 'Like removido com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover like' });
        }
    }
            
}

module.exports = new FeedController();