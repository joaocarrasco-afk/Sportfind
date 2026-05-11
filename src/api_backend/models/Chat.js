const {db, auth} = require('../factory/config');
const {addDoc, doc, getDoc, collection, query, getDocs, where} = require('firebase/firestore');


class Chat{

    
    async rotaDoChatPV(id, username){
        try{
            const ref = query(collection(db,"usuario"), where('username', '==', username));
            const consultar = await getDocs(ref);
            const documen = consultar.docs[0];

            const userIds = [id, documen.id];

            const refRota = query(collection(db,"chat_rota"), where('usuario_id', 'array-contains-any', userIds), where('tipo_chat', '==', 'PV'));
            const consultarRota = await getDocs(refRota);            
            
            if(!consultarRota.empty){
                return "Já tem uma rota";
            }else{
                const rota = await addDoc(collection(db, "chat"), {
                    tipo_chat: "PV",
                    usuario_id: userIds
                });
                return "Criada com sucesso";
            }
        }catch(error){
            console.error(`Não foi possível acessar o chat: ${error.message}`);
        }
    }






}

module.exports = new Chat();