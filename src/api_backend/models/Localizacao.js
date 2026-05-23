const { add } = require('firebase/firestore/pipelines');
const { db } = require('../factory/config');
const {setDoc, doc, getDoc, updateDoc, where, query, collection, getDocs, addDoc} = require('firebase/firestore');
const CloudinaryMedia = require('./cloudinaryMedia');
const e = require('express');

class Localizacao{
// id: 1,
//     name: 'Basquete Max Feffer',
//     type: 'Basquete',
//     distance: '0.3 km',
//     access: 'Publico',
//     emoji: '🏀',
//     lat: -23.5445,
//     lng: -46.3106,
//     color: '#9756CA',
//     image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
//     description:
//       'Quadra de basquete publica no Parque Max Feffer. Aberta todos os dias das 6h as 22h.',


    async criarLocalizacao({name, type, access, emoji, lat, lng, color, description, infraestrutura, fileBuffer, endereco: {rua, numero, bairro, cidade, estado, cep}}){
     
        try{
            const pasta = 'localizacao';
            const tipo = 'image';
            const media = await CloudinaryMedia.salvarMedia(fileBuffer, tipo, pasta);
            const localizacao = await addDoc(collection(db, 'localizacao'), {
                name: name,
                type: type,
                distance: 0,
                access: access,
                emoji: emoji,
                lat: lat,
                lng: lng,
                publicId: media.publicId,
                color: color,
                imageurl: media.url,
                description: description,
                createdAt: new Date(),
                permission: Boolean([false]),
                infraestrutura: [...infraestrutura],
                endereco: {
                    rua: rua,
                    numero: numero,
                    bairro: bairro,
                    cidade: cidade,
                    estado: estado,
                    cep: cep
                }
                
            });
            return { mensagem:"Criada com sucesso", localizacaoId: localizacao.id };
        }catch(error){
            console.error(`Não foi possível criar a localização: ${error.message}`);
        }
    }

    async mostrarLocalizacao(id){
        try{
            const ref = doc(db, 'localizacao', id);
            const snap = await getDoc(ref);
            if (!snap.exists) {
                return 'Não existe esse local';
            }
            return snap.data();
        }catch(error){
            console.error(`Não foi possível mostrar a localização: ${error.message}`);
        }
    }

    async listarLocalizacoes(){
        try{
            const ref = collection(db, 'localizacao');
            const snap = await getDocs(ref);
            const localizacoes = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return localizacoes;
        }catch(error){
            console.error(`Não foi possível listar as localizações: ${error.message}`);
        }
    }

    async atualizarLocalizacao(id, campos) {
        try {
            const ref = doc(db, 'localizacao', id);   
            await updateDoc(ref, campos);
            return { mensagem: 'Localização atualizada com sucesso' };
        } catch (error) {
            console.error(`Não foi possível atualizar a localização: ${error.message}`);
        }
    }

}

module.exports = new Localizacao();