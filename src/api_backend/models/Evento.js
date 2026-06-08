const {db} = require('../factory/config');
const {addDoc, doc, getDoc, collection, query, getDocs, where, updateDoc, deleteDoc} = require('firebase/firestore');

class Evento{

    async criarEvento(userId, nome, tipo_evento, max_participantes, data_evento, esporte, localizacaoId, publicar_feed) {
        try{
            const eventoRef = await addDoc(collection(db, 'eventos'), {
                adm: this.idDocumento(userId),
                nome: nome?.trim() || 'Partida',
                tipo_evento,
                max_participantes,
                data_evento,
                esporte,
                localizacaoId: this.idDocumento(localizacaoId),
                dataCriacao: new Date(),
                publicar_feed: publicar_feed !== false,
                participantes: [],
                solicitacao_participacao: []
            });
            return { id: eventoRef.id, userId, nome, tipo_evento, max_participantes, data_evento, esporte, localizacaoId };
        }catch(error){
            console.error('Não foi possível criar o evento:', error);
        }
    }

    formatarData(valor) {
        if (!valor) return '';
        if (typeof valor?.toDate === 'function') return valor.toDate().toISOString();
        if (valor instanceof Date) return valor.toISOString();
        return String(valor);
    }

    montarEnderecoLocal(endereco) {
        if (!endereco || typeof endereco !== 'object') return '';
        const { rua, numero, bairro, cidade, estado, cep } = endereco;
        const partes = [
            [rua, numero].filter(Boolean).join(', '),
            bairro,
            [cidade, estado].filter(Boolean).join(' - '),
            cep ? `CEP ${cep}` : '',
        ].filter(Boolean);
        return partes.join(' • ');
    }

    idDocumento(valor) {
        if (valor == null || valor === '') return null;
        if (typeof valor === 'string') {
            const id = valor.trim();
            return id || null;
        }
        if (typeof valor === 'number' && Number.isFinite(valor)) {
            return String(valor);
        }
        return null;
    }

    async buscarUsuarioEvento(admId) {
        const id = this.idDocumento(admId);
        if (!id) {
            return { username: 'Usuário', url_perfil: null };
        }
        const userDoc = await getDoc(doc(db, 'usuario', id));
        return {
            username: userDoc.exists() ? userDoc.data().username : 'Usuário',
            url_perfil: userDoc.exists() ? userDoc.data().url ?? null : null,
        };
    }

    async buscarLocalEvento(localizacaoId) {
        const id = this.idDocumento(localizacaoId);
        if (!id) return null;

        const locDoc = await getDoc(doc(db, 'localizacao', id));
        if (!locDoc.exists()) return null;

        const loc = locDoc.data();
        return {
            id,
            name: loc.name ?? 'Local',
            address: this.montarEnderecoLocal(loc.endereco),
            emoji: loc.emoji ?? '📍',
        };
    }

    async listarEventos() {
        try{
            const eventosSnapshot = await getDocs(collection(db, 'eventos'));
            const eventos = await Promise.all(eventosSnapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();
                const { username, url_perfil } = await this.buscarUsuarioEvento(data.adm);
                const local = await this.buscarLocalEvento(data.localizacaoId);

                return {
                    id: docSnap.id,
                    ...data,
                    username,
                    url_perfil,
                    local,
                    dataCriacao: this.formatarData(data.dataCriacao),
                    data_evento: this.formatarData(data.data_evento),
                    participantes: data.participantes ?? [],
                };
            }));

            return eventos
                .filter((evento) => evento.publicar_feed !== false)
                .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
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
            const data = eventoDoc.data();
            const { username, url_perfil } = await this.buscarUsuarioEvento(data.adm);
            const local = await this.buscarLocalEvento(data.localizacaoId);

            return {
                id: eventoDoc.id,
                ...data,
                username,
                url_perfil,
                local,
                dataCriacao: this.formatarData(data.dataCriacao),
                data_evento: this.formatarData(data.data_evento),
                participantes: data.participantes ?? [],
            };
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
            const participantes = eventoData.participantes || [];
            if (participantes.includes(userId)) {
                return { message: 'Já está participando', participantes };
            }
            if (
                eventoData.max_participantes > 0 &&
                participantes.length >= eventoData.max_participantes
            ) {
                return { error: 'Evento já atingiu o número máximo de participantes' };
            }
            const atualizados = [...participantes, userId];
            await updateDoc(eventoRef, { participantes: atualizados });
            return { message: 'Participação realizada com sucesso', participantes: atualizados };
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