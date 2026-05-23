const Localizacao = require('../models/Localizacao');

class LocalizacaoController{
    async criarLocalizacao(req, res) {
        try {
            const { name, type, access, emoji, lat, lng, color, description, infraestrutura, rua, numero, bairro, cidade, estado, cep } = req.body;
            const file = req.file;
            if (!file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
            const message = await Localizacao.criarLocalizacao({name, type, access, emoji, lat, lng, color, fileBuffer: file.buffer, description, infraestrutura, endereco: {rua, numero, bairro, cidade, estado, cep} });
            res.status(201).json(message);
        } catch (error) {
            res.status(500).json({ error: 'Falha no upload' });
        }
    }

    async mostrarLocalizacao(req, res) {
        try {
            const { id } = req.params;
            const localizacao = await Localizacao.mostrarLocalizacao(id);
            if (!localizacao) return res.status(404).json({ error: 'Localização não encontrada' });
            res.status(200).json(localizacao);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao mostrar localização' });
        }
    }

    async listarLocalizacoes(req, res) {
        try {
            const localizacoes = await Localizacao.listarLocalizacoes();
            res.status(200).json(localizacoes);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar localizações' });
        }
    }

    async atualizarLocalizacao(req, res) {
        try {
            const { id } = req.params;
            const {name, type, access, emoji, lat, lng, color, description, infraestrutura} = req.body;
            const resultado = await Localizacao.atualizarLocalizacao(id, {name, type, access, emoji, lat, lng, color, description, infraestrutura});
            res.status(200).json(resultado);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar localização' });
        }
    }



}

module.exports = new LocalizacaoController();