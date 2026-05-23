const {db} = require('../factory/config');
const {addDoc, doc, getDoc, collection, query, getDocs, where, updateDoc, deleteDoc} = require('firebase/firestore');

class Evento{

    async criarEvento(userId, tipo_evento, max_participantes, data_evento, esporte, localizacaoId, publicar_feed) {
        try{
            const eventoRef = await addDoc(collection(db, 'eventos'), {
                adm: userId,
                tipo_evento,
                max_participantes,
                data_evento,
                esporte,
                localizacaoId,
                dataCriacao: new Date(),
                publicar_feed: publicar_feed || false,
                participantes: [],
                solicitacao_participacao: []
            });
            return { id: eventoRef.id, userId, tipo_evento, max_participantes, data_evento, esporte, localizacaoId };
        }catch(error){
            console.error('Não foi possível criar o evento:', error);
        }
    }

    async listarEventos() {
        try{
            const eventosRef = collection(db, 'eventos');
            const eventosSnapshot = await getDocs(eventosRef);
            const eventos = eventosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return eventos;
        }catch(error){
            console.error('Não foi possível mostrar os eventos:', error);
        }
    }

    async mostrarEvento(eventoId) {
        try{
            const eventoRef = doc(db, 'eventos', eventoId);
            const eventoDoc = await getDoc(eventoRef);
            if (!eventoDoc.exists()) {
                return null;
            }
            return { id: eventoDoc.id, ...eventoDoc.data() };
        }catch(error){
            console.error('Não foi possível mostrar o evento:', error);
        }
    }

    async editarEvento(eventoId, campos) {
        try{
            const eventoRef = doc(db, 'eventos', eventoId);
            await updateDoc(eventoRef, campos);
            const eventoDoc = await getDoc(eventoRef);
            return { id: eventoDoc.id, ...eventoDoc.data() };
        }catch(error){
            console.error('Não foi possível editar o evento:', error);
        }
    }

    async deletarEvento(eventoId) {
        try{
            const eventoRef = doc(db, 'eventos', eventoId);
            await deleteDoc(eventoRef);
        }catch(error){
            console.error('Não foi possível deletar o evento:', error);
        }
    }


    async participarEvento(eventoId, userId) {
        try{
            const eventoRef = doc(db, 'eventos', eventoId);
            const eventoDoc = await getDoc(eventoRef);
            if (!eventoDoc.exists()) {
                return null;
            }
            const eventoData = eventoDoc.data();
            if(eventoData.tipo_evento === 'privado'){
                if(eventoData.solicitacao_participacao && eventoData.solicitacao_participacao.includes(userId)){
                    return { error: 'Solicitação de participação já enviada' };
                }
                await updateDoc(eventoRef, {
                    solicitacao_participacao: [...(eventoData.solicitacao_participacao || []), userId]
                });
                return { message: 'Solicitação de participação enviada com sucesso' };
            }
            if (eventoData.participantes && eventoData.participantes.length >= eventoData.max_participantes) {
                return { error: 'Evento já atingiu o número máximo de participantes' };
            }
            await updateDoc(eventoRef, {
                participantes: [...(eventoData.participantes || []), userId]
            });
            return { message: 'Participação realizada com sucesso' };
        }catch(error){
            console.error('Não foi possível participar do evento:', error);
        }
    }

    async aceitarParticipacao(eventoId, userId) {
        try{
            const eventoRef = doc(db, 'eventos', eventoId);
            const eventoDoc = await getDoc(eventoRef);
            if (!eventoDoc.exists()) {
                return null;
            }
            const eventoData = eventoDoc.data();
            if (!eventoData.solicitacao_participacao.includes(userId)) {
                return { error: 'Solicitação de participação não encontrada' };
            }
            await updateDoc(eventoRef, {
                solicitacao_participacao: eventoData.solicitacao_participacao.filter(id => id !== userId),
                participantes: [...(eventoData.participantes || []), userId]
            });
            return { message: 'Participação aceita com sucesso' };
        }catch(error){
            console.error('Não foi possível aceitar a participação:', error);
        }
    }
}

module.exports = new Evento();