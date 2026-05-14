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
                return { mensagem:"Criada com sucesso", userIds};
            }
        }catch(error){
            console.error(`Não foi possível acessar o chat: ${error.message}`);
        }
    }

    
    async criarChatGrupo(idAdm, userIds, nome_grupo){
        try{

            const membrosIds = [ idAdm, ...userIds];
            const rota = await addDoc(collection(db, 'chat'), {
                tipo_chat: "GRUPO",
                nome_grupo: nome_grupo,
                membros_grupo: membrosIds,
                admin_grupo: idAdm
                 
            });
            return { mensagem:"Criada com sucesso", rotaId: rota.id };
            
        }catch(error){
            console.error(`Não foi possível cria o grupo: ${error.message}`);
        }

        

    }

    async adicionarMembroGrupo(idChat, idUsuario){
        try{
            if(idChat == null){
                return "Não foi possível encontrar o chat";
            }
            const refChat = doc(db, "chat", idChat);
            const chatDoc =  await getDoc(refChat);
            const chatData = chatDoc.data();
            const membros = chatData.membros_grupo;
            membros.push(idUsuario);
            await updateDoc(refChat, { membros_grupo: membros });
        }catch(error){
            console.error(`Não foi possível adicionar o membro ao grupo: ${error.message}`);
        }
    }






}

module.exports = new Chat();