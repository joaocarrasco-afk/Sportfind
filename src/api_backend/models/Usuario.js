const { db, auth } = require('../factory/config');
const {setDoc, doc, getDoc, updateDoc, where, query, collection, getDocs} = require('firebase/firestore');
const {createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} = require('firebase/auth'); 
const CloudinaryMedia = require('./cloudinaryMedia');
class Usuario{
//ok
    async consultarUsername(username){
        try{
        const ref =  query(collection(db, 'usuario'), where("username", "==", username));
        const consulta = await getDocs(ref);
        return consulta;
        }catch(error){
            console.error(`Erro ao buscar o usuário: ${error.message}`);
            throw error;
        }
    }
//ok
    async criarUsuario(nome, email, senha, username, data_nascimento){
        try {
            const snap = await this.consultarUsername(username);

            if(!snap.empty){
                return 'Já existe um usuário com esse username!';
            }else{ 
                const emailCredential = await createUserWithEmailAndPassword(auth, email, senha);
                const uid = emailCredential.user.uid;
                await setDoc(doc(db, 'usuario',  uid), {
                    nome: nome,
                    username: username,
                    data_nascimento: data_nascimento,
                    altura:0.00,
                    bio: "",
                    trofeus_quantidades: 0,
                    seguindo: 0,
                    seguidores: 0,
                    likes: 0,
                    privacidade: Boolean([]),
                    email: email,
                    seguindo_id: [],
                    seguidores_id: []
                });
                return {uid};
                
            }       
        } catch (error) {
            switch(error.code){
                case "auth/invalid-email":
                    return "E-mail inválido";
                case "auth/email-already-in-use":
                    return "Esse e-mail já está em uso. Por favor, tente outro.";
                case "auth/weak-password":
                    return "Senha fraca. Use pelo menos 6 caracteres, incluindo letras, númerose um caracter maiusculo.";
                case "auth/password-does-not-meet-requirements":
                    return "Senha fraca. Use pelo menos 6 caracteres, incluindo letras, números e um caracter maiusculo.";
                default:
                    console.error(`Erro ao criar usuário: ${error.message}`);
                    return 'Não foi possível criar o usuário.';
            }
        }
    }
   //okk por enquanto
    async dadosPerfil(id) {
        try {
            const snap = await getDoc(doc(db, 'usuario', id));
            if (!snap.exists) {
                return null;
            }
            return snap.data();
        } catch (error) {
            throw new Error(`Erro ao coletar os dados: ${error.message}`);
        }
    }
//okk
    async login(email, senha){
        try {
            const username = email;
            const snap = await this.consultarUsername(username);
            if(!snap.empty){
                const doc = snap.docs[0];
                const dados = doc.data();
                const userCredential = await signInWithEmailAndPassword(auth, dados.email, senha);
                return {
                    uid: userCredential.user.uid
                };
            }else{
                const userCredential = await signInWithEmailAndPassword(auth, email, senha);
                return {
                    uid: userCredential.user.uid
                };
            }
        } catch(error){
            throw new Error(`Erro ao fazer login: ${error.message}`);     
        }
    }

    // Manda o link de redefinir a senha para o e-mail
    async linkRedefinirSenha(email) {
        try{
            await sendPasswordResetEmail(auth, email);
            return {
                message: 'Link de redefinição de senha enviado'
            }

        }catch(error){
            if(error.code == auth/invalid-email){
                return "E-mail inválido";
            }
            throw new Error(`Erro ao enviar o link de redefinição de senha: ${error.message}`);
        }
        
    }

   
    async atualizarDados(id, campos) {
        const ref = doc(db, 'usuario', id);
        const snap = await getDoc(ref);
        if (!snap.exists) {
            return null;
        }

        const payload = {};
        const { nome, username, telefone} = campos;

        if (nome !== snap.nome){ 
            payload.nome = nome.trim();
        }else{
            payload.nome = campos.nome;
        }
        if (username !== snap.username){
             payload.username = username.trim();
        }else{
            payload.username = campos.username;
        }
        if (telefone !== snap.telefone){ 
            payload.telefone = telefone.trim();
        }else{
            payload.telefone = campos.telefone;
        }
      



        await updateDoc(ref, payload);
        const atualizado = await getDoc(ref);
        return atualizado.data();
    }

    async editarFoto(id, fileBuffer) {
        try{
            const pasta = 'usuario';
            const tipo = 'image';
            const media = await CloudinaryMedia.salvarMedia(fileBuffer, tipo, pasta);
            const ref = doc(db, 'usuario', id);
            await updateDoc(ref, {publicId: media.publicId, url: media.url});
            return {publicId: media.publicId, url: media.url};
        }catch(error){
            console.error(`Erro ao editar a foto: ${error.message}`);
            throw error;
        }
    }

    async seguirUsuario(user_id, seguindo_id ){
        try{
            
            const ref_user = doc(db, 'usuario', user_id);
            const snap_user = await getDoc(ref_user);
            const quantidadeSeguindo = snap_user.data().seguindo;
            await updateDoc(ref_user, {seguindo_id: [...snap_user.data().seguindo_id, seguindo_id], seguindo: quantidadeSeguindo + 1 });

            const ref_seguindo = doc(db, 'usuario', seguindo_id);
            const snap_seguindo = await getDoc(ref_seguindo);
            const quantidadeSeguidores = snap_seguindo.data().seguidores;
            await updateDoc(ref_seguindo, {
                seguidores_id: [...snap_seguindo.data().seguidores_id, user_id], 
                seguidores: quantidadeSeguidores + 1
            })

            return {message: 'Usuário seguido com sucesso'};
            
        }catch(error){
            console.error(`Erro ao seguir: ${error.message}`);
            throw error;
        }
    }

    async deixarSeguirUsuario(user_id, seguindo_id ){
        try{
            const ref_user = doc(db, 'usuario', user_id);
            const snap_user = await getDoc(ref_user);
            const quantidadeSeguindo = snap_user.data().seguindo;
            const seguindo_id_atualizado = snap_user.data().seguindo_id.filter(id => id !== seguindo_id);
            await updateDoc(ref_user, {
                seguindo_id: seguindo_id_atualizado, 
                seguindo: quantidadeSeguindo - 1 
            });

            const ref_seguindo = doc(db, 'usuario', seguindo_id);
            const snap_seguindo = await getDoc(ref_seguindo);
            const quantidadeSeguidores = snap_seguindo.data().seguidores;
            const seguidores_id_atualizado = snap_seguindo.data().seguidores_id.filter(id => id !== user_id);
            await updateDoc(ref_seguindo, {
                seguidores_id: seguidores_id_atualizado, 
                seguidores: quantidadeSeguidores - 1
            })
            return {message: 'Usuário deixou de seguir com sucesso'};       
        }catch(error){
            console.error(`Erro ao deixar de seguir: ${error.message}`);
            throw error;
        }
    }
}
module.exports = new Usuario();