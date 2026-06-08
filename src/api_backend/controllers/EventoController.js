const Evento = require('../models/Evento');

class EventoController{

    async criarEvento(req, res){
        try{
            const {
                userId,
                nome,
                tipo_evento,
                max_participantes,
                data_evento,
                esporte,
                localizacaoId,
                publicar_feed,
            } = req.body;
            const evento = await Evento.criarEvento(
                userId,
                nome,
                tipo_evento,
                max_participantes,
                data_evento,
                esporte,
                localizacaoId,
                publicar_feed,
            );
            res.status(201).json(evento);
        }catch(error){
            console.error('Não foi possível criar o evento:', error);
            res.status(500).json({ error: 'Não foi possível criar o evento' });
        }
    }

    async listarEventos(req, res){
        try{
            const eventos = await Evento.listarEventos();
            res.status(200).json(eventos ?? []);
        }catch(error){
            console.error('Não foi possível mostrar os eventos:', error);
            res.status(500).json({ error: 'Não foi possível mostrar os eventos' });
        }
    }

    async mostrarEvento(req, res){
        try{
            const { id } = req.params;
            const evento = await Evento.mostrarEvento(id);
            if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
            res.status(200).json(evento);
        }catch(error){
            console.error('Não foi possível mostrar o evento:', error);
            res.status(500).json({ error: 'Não foi possível mostrar o evento' });
        }
    }

    async editarEvento(req, res){
        try{
            const { id } = req.params;
            const campos = req.body;
            const eventoAtualizado = await Evento.editarEvento(id, campos);
            if (!eventoAtualizado) return res.status(404).json({ error: 'Evento não encontrado' });
            res.status(200).json(eventoAtualizado);
        }catch(error){
            console.error('Não foi possível editar o evento:', error);
            res.status(500).json({ error: 'Não foi possível editar o evento' });
        }
    }

    async deletarEvento(req, res){
        try{
            const { id } = req.params;
            await Evento.deletarEvento(id);
            res.status(200).json({ message: 'Evento deletado com sucesso' });
        }catch(error){
            console.error('Não foi possível deletar o evento:', error);
            res.status(500).json({ error: 'Não foi possível deletar o evento' });
        }
    }

    async participarEvento(req, res){
        try{
            const { id } = req.params;
            const { userId } = req.body;
            const resultado = await Evento.participarEvento(id, userId);
            if (!resultado) return res.status(404).json({ error: 'Evento não encontrado' });
            if (resultado.error) return res.status(400).json({ error: resultado.error });
            res.status(200).json(resultado);
        }catch(error){
            console.error('Não foi possível participar do evento:', error);
            res.status(500).json({ error: 'Não foi possível participar do evento' });
        }
    }


}

module.exports = new EventoController();
