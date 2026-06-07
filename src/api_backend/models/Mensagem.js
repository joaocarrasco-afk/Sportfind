const {db, auth, realdb} = require('../factory/config');
const {addDoc, doc, getDoc, collection, query, getDocs, where, updateDoc, deleteDoc} = require('firebase/firestore');
const {ref, set, onValue, push, get, update, remove} = require('firebase/database');


class Mensagem{
    async enviarMensagem(idChat, idUsuario, mensagem){
        try{
            const novaMensagemRef = push(ref(realdb, `chat/${idChat}/mensagens`));
            const novaMensagem = {
                idUsuario,
                mensagem,
                timestamp: Date.now()
            };
            await set(novaMensagemRef, novaMensagem);
            return { mensagem: "Mensagem enviada com sucesso" };

        }catch(error){
            console.error(`Não foi possível enviar a mensagem: ${error.message}`);
        }
    }

    mostrarMensagens(idChat, callback) {
        try {
            const mensagensRef = ref(realdb, `chat/${idChat}/mensagens`);
            return onValue(mensagensRef, (snapshot) => {
                const mensagensData = snapshot.val() || {};
                const mensagens = Object.entries(mensagensData).map(([id, msg]) => ({
                    id,
                    ...msg,
                }));
                callback(mensagens);
            });
        } catch (error) {
            console.error(`Não foi possível listar as mensagens: ${error.message}`);
            return () => {};
        }
    }

    async editarMensagem(idChat, idMensagem, novaMensagem){
        try{
            const mensagemRef = ref(realdb, `chat/${idChat}/mensagens/${idMensagem}`);
            await update(mensagemRef, { mensagem: novaMensagem });
            return { mensagem: "Mensagem editada com sucesso" };
        }catch(error){
            console.error(`Não foi possível editar a mensagem: ${error.message}`);
        }
    }

    async deletarMensagem(idChat, idMensagem){
        try{
            const mensagemRef = ref(realdb, `chat/${idChat}/mensagens/${idMensagem}`);
            await remove(mensagemRef);
            return { mensagem: "Mensagem deletada com sucesso" };
        }catch(error){
            console.error(`Não foi possível deletar a mensagem: ${error.message}`);
        }
    }
    



}

module.exports = new Mensagem();