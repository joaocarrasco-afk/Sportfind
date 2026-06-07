const {db} = require('../factory/config');
const {addDoc, doc, getDoc, collection, query, getDocs, where, updateDoc, deleteDoc} = require('firebase/firestore');
const cloudinary = require('../factory/cloudinary');
const CloudinaryMedia = require('./cloudinaryMedia');

class Feed{

    async criarPost({userId, descricao = '', fileBuffer, tipo}) {
        try {
            const pasta = 'feed';
            const media = await CloudinaryMedia.salvarMedia(fileBuffer, tipo, pasta);
            const docRef = await addDoc(collection(db, 'feed'), {
                user: userId,
                url:media.url,
                publicId: media.publicId,
                type: media.type,      
                descricao,  
                dataCriacao: new Date(),
                likes: 0,
                comentarios: 0
            });
            return { id: docRef.id, url: media.url, type: media.type, descricao, userId };
        } catch (error) {
            console.error('Não foi possível criar o post:', error);
        }



    }

    async mostrarFeed() {
        try {
            const feedRef = collection(db, 'feed');
            const feedSnapshot = await getDocs(feedRef);
            const feed = feedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const sortedFeed = feed.sort((a, b) => b.dataCriacao.toDate() - a.dataCriacao.toDate());
            const feedWithFormattedDates = sortedFeed.map(post => ({              
                ...post,
                dataCriacao: post.dataCriacao.toDate().toISOString()
            }));
            const feedWithUsernames = await Promise.all(feedWithFormattedDates.map(async post => {
                const userRef = doc(db, 'usuario', post.user);
                const userDoc = await getDoc(userRef);
                const username = userDoc.exists() ? userDoc.data().username : 'Usuário Desconecido';
                const url_perfil = userDoc.exists() ? userDoc.data().url : null;
                return {...post, username, url_perfil };
            }));
            return feedWithUsernames;
        }catch(error){
            console.error(`Não foi possível mostrar o feed: ${error.message}`);
        }
    }

    async mostrarPostUsuario(userId) {
        try {
            const postRef = query(collection(db, 'feed'), where('user', '==', userId));
            const postSnapshot = await getDocs(postRef);
            const mostrarPost = postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const sortedPosts = mostrarPost.sort((a, b) => b.dataCriacao.toDate() - a.dataCriacao.toDate());
            const feedWithFormattedDates = sortedPosts.map(post => ({
                ...post,
                dataCriacao: post.dataCriacao.toDate().toISOString()
            }));

            
            return feedWithFormattedDates ;
        } catch (error) {
            console.error('Não foi possível mostrar os posts:', error);
        }
    }

    async post(postId) {
        try {
            const postRef = doc(db, 'feed', postId);
            const postDoc = await getDoc(postRef);
            if (!postDoc.exists()) return { error: 'Post não encontrado' };
            const postData = postDoc.data();
            const userRef = doc(db, 'usuario', postData.user);
            const userDoc = await getDoc(userRef);
            const username = userDoc.exists() ? userDoc.data().username : 'Usuário Desconecido';
            const url_perfil = userDoc.exists() ? userDoc.data().url : null;
            return { ...postData, username, url_perfil };
        } catch (error) {
            console.error('Não foi possível mostrar o post:', error);
        }
    }

    async deletarPost(postId, userId) {
        try {
            const postRef = doc(db, 'feed', postId);
            const postDoc = await getDoc(postRef);
            if (!postDoc.exists()) return { error: 'Post não encontrado' };
            const data = postDoc.data();
            if (data.user !== userId) return { error: 'Ação não autorizada' };
            if (data.type === 'video'){
                await cloudinary.uploader.destroy(data.publicId, { resource_type: 'video' });
            }
            await cloudinary.uploader.destroy(data.publicId);
            await deleteDoc(postRef);
            return { message: 'Post deletado com sucesso' };
        } catch (error) {
            console.error('Não foi possível deletar o post:', error);
        }
    }

    async editarPost(postId, descricao, userId) {
        try {
            const postRef = doc(db, 'feed', postId);
            const postDoc = await getDoc(postRef);
            if (!postDoc.exists()) return { error: 'Post não encontrado' };
            if (postDoc.data().user !== userId) return { error: 'Ação não autorizada' };
            await updateDoc(postRef, { descricao });
            return { message: 'Post editado com sucesso' };
        } catch (error) {
            console.error('Não foi possível editar o post:', error);
        }
    }
        
    async likePost(postId, userIdCurtiu) {
        try {
            //atualizar os likes do post
            const postRef = doc(db, 'feed', postId);
            const postDoc = await getDoc(postRef);
            if (!postDoc.exists()) return { error: 'Post não encontrado' };
            const likes = postDoc.data().likes;
            await updateDoc(postRef, { likes: likes + 1 });

            //adiciona o id do post na lista de likes do usuário que curtiu
            const userRefCurtiu = doc(db, 'usuario', userIdCurtiu);
            const userDocCurtiu = await getDoc(userRefCurtiu);
            await updateDoc(userRefCurtiu, { likes_id: [...userDocCurtiu.data().likes_id, postId] });

            //atualizar os likes do usuário que fez o post
            const userRef = doc(db, 'usuario', postDoc.data().user);
            const userDoc = await getDoc(userRef);
            await updateDoc(userRef, { likes: userDoc.data().likes + 1 });
            return { message: 'Post curtido com sucesso' };
        } catch (error) {
            console.error('Não foi possível curtir o post:', error);
        }
    }

    async tirarLikePost(postId, userIdCurtiu) {
        try {
            //tirar o like do post
            const postRef = doc(db, 'feed', postId);
            const postDoc = await getDoc(postRef);
            if (!postDoc.exists()) return { error: 'Post não encontrado' };
            const likes = postDoc.data().likes;
            await updateDoc(postRef, { likes: likes - 1 });
            //tirar o like do usuário que curtiu
            const userRefCurtiu = doc(db, 'usuario', userIdCurtiu);
            const userDocCurtiu = await getDoc(userRefCurtiu);
            await updateDoc(userRefCurtiu, { likes_id: userDocCurtiu.data().likes_id.filter(id => id !== postId) });
            //atualizar os likes do usuário que fez o post
            const userRef = doc(db, 'usuario', postDoc.data().user);
            const userDoc = await getDoc(userRef);
            await updateDoc(userRef, { likes: userDoc.data().likes - 1 });
            return { message: 'Like removido com sucesso' };
        } catch (error) {
            console.error('Não foi possível tirar o like do post:', error);
        }
    }

}

module.exports = new Feed();