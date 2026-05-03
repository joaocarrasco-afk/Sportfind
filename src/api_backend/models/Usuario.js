const { db, auth } = require('../factory/config');
const {setDoc, doc, getDoc} = require('firebase/firestore');
const {createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} = require('firebase/auth');
const { json } = require('express');

class Usuario{
    // Cria o usuário no Firebase Auth e salva dados complementares no Firestore
    async criarUsuario(nome, email, senha, username, data_nascimento){
        try {
         
                // Cria credencial por e-mail e senha
                const emailCredential = await createUserWithEmailAndPassword(auth, email, senha);
                const uid = emailCredential.user.uid;
            
            // Persiste os dados adicionais do usuário na coleção "usuario"
            await setDoc(doc(db, 'usuario', uid), {
                nome: nome,
                username: username,
                data_nascimento: data_nascimento
            });
            return { uid, nome };
        } catch (error) {
            console.error(`Erro ao criar usuário: ${error.message}`);
        }
    }

    
    async dadosPerfil(id) {
        try {
            const snap = await getDoc(doc(db, 'usuario', id));
            // if (!snap.exists) {
            //     return null;
            // }
            return snap.data();
        } catch (error) {
            throw new Error(`Erro ao coletar os dados: ${error.message}`);
        }
    }
    


    // Realiza autenticação do usuário com e-mail e senha
    async login(email, senha){
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, senha);
            // Retorna o identificador único do usuário autenticado
            return {
                uid: userCredential.user.uid
            };
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
            throw new Error(`Erro ao enviar o link de redefinição de senha: ${error.message}`);
        }
        
    }
}

module.exports = new Usuario();