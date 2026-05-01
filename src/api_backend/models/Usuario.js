const { db, auth } = require('../factory/config');
const {setDoc, doc} = require('firebase/firestore');
const {createUserWithEmailAndPassword, signInWithEmailAndPassword, createUserWithPhoneNumber} = require('firebase/auth');

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
            // Retorna os dados mínimos após o cadastro
            return {
                nome
            };
        } catch (error) {
            console.error('Erro ao criar usuário:', error.message);
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
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    }
}

module.exports = new Usuario();