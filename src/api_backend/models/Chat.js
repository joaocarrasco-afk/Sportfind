const {db, auth} = require('../factory/config');
const {addDoc, doc, getDoc, collection, query, getDocs, where, updateDoc} = require('firebase/firestore');


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
                admin_grupo: [idAdm],
                descricao: ""
                
                 
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
            membros.push(...idUsuario);
            await updateDoc(refChat, {membros_grupo: membros} );
            return {mensagem: "Membro adicionado com sucesso", membros: chatData.membros_grupo};
        }catch(error){
            console.error(`Não foi possível adicionar o membro ao grupo: ${error.message}`);
        }
    }

    async editarChatGrupo(idChat, campos){
        try{
            if(idChat == null){
                return "Não foi possível encontrar o chat";
            }
            const refChat = doc(db, "chat", idChat);
            const chatDoc =  await getDoc(refChat);
            const chatData = chatDoc.data();
            
            const payload = {};
            const {nome_grupo, descricao} = campos;
            

            if (nome_grupo !== chatData.nome_grupo){ 
                payload.nome_grupo = nome_grupo.trim();
            }else{
                payload.nome_grupo = campos.nome_grupo;
            }
            if (descricao !== chatData.descricao){ 
                payload.descricao = descricao.trim();
            }else{
                payload.descricao = campos.descricao;
            }   
            
            await updateDoc(refChat, payload);
            const atualizado = await getDoc(refChat);
            return atualizado.data();         
        }catch(error){
            console.error(`Não foi possível editar o grupo: ${error.message}`);
        }
    }

    async informacoesGrupo(idChat){
        try{
            const refChat = doc(db, "chat", idChat);
            const chatDoc =  await getDoc(refChat);
            const chatData = chatDoc.data();
            return chatData;
        }catch(error){
            console.error(`Não foi possível mostrar as informaçoes do grupo: ${error.message}`);
        }

    }

    async sairGrupo(idChat, idUsuario){
        try{
            const refChat = doc(db, "chat", idChat);
            const chatDoc =  await getDoc(refChat);
            const chatData = chatDoc.data();
            const membros = chatData.membros_grupo;
            membros.splice(membros.indexOf(idUsuario), 1);
            await updateDoc(refChat, {membros_grupo: membros} );
            return {mensagem: "Saiu com sucesso", membros: chatData.membros_grupo};
        }catch(error){
            console.error(`Não foi possível sair do grupo: ${error.message}`);
        }

    }

    async promoverAdm(idChat, idUsuario){
        try{
            const refChat = doc(db, "chat", idChat);
            const chatDoc =  await getDoc(refChat);
            const chatData = chatDoc.data();
            const admin = chatData.admin_grupo;
            admin.push(...idUsuario);
            await updateDoc(refChat, {admin_grupo: admin} );
            return {mensagem: "Promovido com sucesso", membros: chatData.admin_grupo};
        }catch(error){
            console.error(`Não foi possível promover o membro: ${error.message}`);
        }
    }

    async listarChat(idUsuario){
        try{
            const refChat = query(collection(db, "chat"), where('membros_grupo', 'array-contains', idUsuario));
            const chatDoc =  await getDocs(refChat);
            const chatData = chatDoc.docs.map((doc) => doc.data());
            return chatData;
        }catch(error){
            console.error(`Não foi possível listar o chat: ${error.message}`);
        }

    }







}

module.exports = new Chat();