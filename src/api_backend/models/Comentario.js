const {db} = require('../factory/config');
const {addDoc, doc, getDoc, collection, query, getDocs, where, updateDoc, deleteDoc} = require('firebase/firestore');

class Comentario{

    async _ajustarContagemPost(postId, delta){
        try{
            const postRef = doc(db, 'feed', postId);
            const postDoc = await getDoc(postRef);
            if(!postDoc.exists()) return;
            const atual = postDoc.data().comentarios ?? 0;
            await updateDoc(postRef, { comentarios: Math.max(0, atual + delta) });
        }catch(error){
            console.error('Não foi possível atualizar contagem de comentários:', error);
        }
    }

    async _buscarPerfilUsuario(userId){
        const userRef = doc(db, 'usuario', userId);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            return { username: 'Usuário Desconhecido', url_perfil: null };
        }
        const data = userDoc.data();
        return {
            username: data.username ?? 'Usuário Desconhecido',
            url_perfil: data.url ?? null,
        };
    }

    _formatarComentario(docSnap){
        const comentarioData = docSnap.data();
        return {
            id: docSnap.id,
            ...comentarioData,
            dataCriacao: comentarioData.dataCriacao.toDate().toISOString(),
        };
    }

    async criarComentario(userId, postId, texto){
        try{
            const comentarioRef = await addDoc(collection(db, 'comentarios'), {
                user: userId,
                postId: postId,
                texto: texto,
                tipo: 'comentario',
                dataCriacao: new Date()
            });
            await this._ajustarContagemPost(postId, 1);
            const { username, url_perfil } = await this._buscarPerfilUsuario(userId);
            return {
                id: comentarioRef.id,
                user: userId,
                postId,
                texto,
                tipo: 'comentario',
                username,
                url_perfil,
                dataCriacao: new Date().toISOString(),
            };
        }catch(error){
            console.error('Não foi possível criar o comentário:', error);
            throw error;
        }
    }

    async mostrarComentarios(postId){
        try{
            const comentariosRef = query(collection(db, 'comentarios'), where('postId', '==', postId), where('tipo', '==', 'comentario'));
            const comentariosSnapshot = await getDocs(comentariosRef);
            const comentarios = await Promise.all(comentariosSnapshot.docs.map(async d => {
                const comentarioData = this._formatarComentario(d);
                const { username, url_perfil } = await this._buscarPerfilUsuario(comentarioData.user);
                return { ...comentarioData, username, url_perfil };
            }));
            return comentarios.sort((a, b) => new Date(a.dataCriacao) - new Date(b.dataCriacao));
        }catch(error){
            console.error('Não foi possível mostrar os comentários:', error);
            throw error;
        }
    }

    async mostrarRespostas(comentarioPaiId){
        try{
            const respostasRef = query(collection(db, 'comentarios'), where('comentarioPaiId', '==', comentarioPaiId), where('tipo', '==', 'resposta'));
            const respostasSnapshot = await getDocs(respostasRef);
            const respostas = await Promise.all(respostasSnapshot.docs.map(async d => {
                const respostaData = this._formatarComentario(d);
                const { username, url_perfil } = await this._buscarPerfilUsuario(respostaData.user);
                return { ...respostaData, username, url_perfil };
            }));
            return respostas.sort((a, b) => new Date(a.dataCriacao) - new Date(b.dataCriacao));
        }catch(error){
            console.error('Não foi possível mostrar as respostas:', error);
            throw error;
        }
    }

    async _deletarRespostas(comentarioPaiId){
        const respostasRef = query(collection(db, 'comentarios'), where('comentarioPaiId', '==', comentarioPaiId));
        const respostasSnapshot = await getDocs(respostasRef);
        let removidos = respostasSnapshot.docs.length;
        await Promise.all(respostasSnapshot.docs.map(d => deleteDoc(d.ref)));
        return removidos;
    }

    async deletarComentario(comentarioId, userId){
        try{
            const comentarioRef = doc(db, 'comentarios', comentarioId);
            const comentarioDoc = await getDoc(comentarioRef);
            if(!comentarioDoc.exists()) return { error: 'Comentário não encontrado' };
            const data = comentarioDoc.data();
            if(data.user !== userId) return { error: 'Usuário não autorizado a deletar este comentário' };

            let removidos = 1;
            if(data.tipo === 'comentario'){
                removidos += await this._deletarRespostas(comentarioId);
            }
            await deleteDoc(comentarioRef);
            if(data.postId) await this._ajustarContagemPost(data.postId, -removidos);
            return { message: 'Comentário deletado com sucesso', removidos };
        }catch(error){
            console.error('Não foi possível deletar o comentário:', error);
            throw error;
        }
    }

    async editarComentario(comentarioId, userId, novoTexto){
        try{
            const comentarioRef = doc(db, 'comentarios', comentarioId);
            const comentarioDoc = await getDoc(comentarioRef);
            if(!comentarioDoc.exists()) return { error: 'Comentário não encontrado' };
            if(comentarioDoc.data().user !== userId) return { error: 'Usuário não autorizado a editar este comentário' };
            await updateDoc(comentarioRef, { texto: novoTexto });
            return { message: 'Comentário editado com sucesso', texto: novoTexto };
        }catch(error){
            console.error('Não foi possível editar o comentário:', error);
            throw error;
        }
    }

    async responderComentario(userId, postId, texto, comentarioPaiId){
        try{
            const respostaRef = await addDoc(collection(db, 'comentarios'), {
                user: userId,
                postId: postId,
                texto: texto,
                comentarioPaiId: comentarioPaiId,
                tipo: 'resposta',
                dataCriacao: new Date()
            });
            await this._ajustarContagemPost(postId, 1);
            const { username, url_perfil } = await this._buscarPerfilUsuario(userId);
            return {
                id: respostaRef.id,
                user: userId,
                postId,
                texto,
                comentarioPaiId,
                tipo: 'resposta',
                username,
                url_perfil,
                dataCriacao: new Date().toISOString(),
            };
        }catch(error){
            console.error('Não foi possível criar a resposta:', error);
            throw error;
        }
    }

}

module.exports = new Comentario();
