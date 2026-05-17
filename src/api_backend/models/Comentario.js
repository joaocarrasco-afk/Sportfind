const {db} = require('../factory/config');
const {addDoc, doc, getDoc, collection, query, getDocs, where, updateDoc, deleteDoc} = require('firebase/firestore');

class Comentario{

    async criarComentario(userId, postId, texto){
        try{
            const comentarioRef = await addDoc(collection(db, 'comentarios'), {
                id: userId,
                postId: postId,
                texto: texto,
                tipo: 'comentario',
                dataCriacao: new Date()
            });
            return { id: comentarioRef.id, userId, postId, texto };
        }catch(error){
            console.error('Não foi possível criar o comentário:', error);
        }
    }

    async mostrarComentarios(postId){
        try{
            const comentariosRef = query(collection(db, 'comentarios'), where('postId', '==', postId), where('tipo', '==', 'comentario'));
            const comentariosSnapshot = await getDocs(comentariosRef);
            const comentarios = await Promise.all(comentariosSnapshot.docs.map(async d => {
                const comentarioData = d.data();
                const userRef = doc(db, 'usuario', comentarioData.id);
                const userDoc = await getDoc(userRef);
                const username = userDoc.exists() ? userDoc.data().username : 'Usuário Desconecido';
                return { id: d.id, ...comentarioData, username, dataCriacao: comentarioData.dataCriacao.toDate().toISOString() };
            }));
            
            return comentarios;
        }catch(error){
            console.error('Não foi possível mostrar os comentários:', error);
        }
    }

    async mostrarRespostas(comentarioPaiId){
        try{
            const respostasRef = query(collection(db, 'comentarios'), where('comentarioPaiId', '==', comentarioPaiId), where('tipo', '==', 'resposta'));
            const respostasSnapshot = await getDocs(respostasRef);
            const respostas = await Promise.all(respostasSnapshot.docs.map(async d => {
                const respostaData = d.data();
                const userRef = doc(db, 'usuario', respostaData.id);
                const userDoc = await getDoc(userRef);
                const username = userDoc.exists() ? userDoc.data().username : 'Usuário Desconecido';
                return { id: doc.id, ...respostaData, username, dataCriacao: respostaData.dataCriacao.toDate().toISOString() };
            }));
            
            return respostas;
        }catch(error){
            console.error('Não foi possível mostrar as respostas:', error);
        }
    }

    async deletarComentario(comentarioId, userId){
        try{
            const comentarioRef = doc(db, 'comentarios', comentarioId);
            const comentarioDoc = await getDoc(comentarioRef);
            if(!comentarioDoc.exists()) return { error: 'Comentário não encontrado' };
            if(comentarioDoc.data().id !== userId) return { error: 'Usuário não autorizado a deletar este comentário' };
            await deleteDoc(comentarioRef);
            return { message: 'Comentário deletado com sucesso' };
        }catch(error){
            console.error('Não foi possível deletar o comentário:', error);
        }
    }

    async editarComentario(comentarioId, userId, novoTexto){
        try{
            const comentarioRef = doc(db, 'comentarios', comentarioId);
            const comentarioDoc = await getDoc(comentarioRef);
            if(!comentarioDoc.exists()) return { error: 'Comentário não encontrado' };
            if(comentarioDoc.data().id !== userId) return { error: 'Usuário não autorizado a editar este comentário' };
            await updateDoc(comentarioRef, { texto: novoTexto });
            return { message: 'Comentário editado com sucesso' };
        }catch(error){
            console.error('Não foi possível editar o comentário:', error);
        }
    }

    async responderComentario(userId, postId, texto, comentarioPaiId){
        try{
            const respostaRef = await addDoc(collection(db, 'comentarios'), {
                id: userId,
                postId: postId,
                texto: texto,
                comentarioPaiId: comentarioPaiId,
                tipo: 'resposta',
                dataCriacao: new Date()
            });
            return { id: respostaRef.id, userId, postId, texto, comentarioPaiId };
        }catch(error){
            console.error('Não foi possível criar a resposta:', error);
        }
    }

}

module.exports = new Comentario();