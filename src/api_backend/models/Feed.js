const {db} = require('../factory/config');
const {addDoc, doc, getDoc, collection, query, getDocs, where, updateDoc, deleteDoc} = require('firebase/firestore');
const cloudinary = require('../factory/cloudinary');
const CloudinaryMedia = require('./cloudinaryMedia');
class Feed{

    async criarPost({id, descricao = '', fileBuffer, tipo}) {
        try {
            const media = await CloudinaryMedia.salvarMedia(fileBuffer, tipo);
            const docRef = await addDoc(collection(db, 'feed'), {
                id,
                url:media.url,
                publicId: media.publicId,
                type: media.type,      
                descricao,  
                dataCriacao: new Date(),
                likes: 0,
                comentarios: 0
            });
            return { id: docRef.id, url: media.url, type: media.type, descricao };
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
                const userRef = doc(db, 'usuario', post.id);
                const userDoc = await getDoc(userRef);
                const username = userDoc.exists() ? userDoc.data().username : 'Usuário Desconecido';
                return { ...post, username };
            }));
            return feedWithUsernames;
        }catch(error){
            console.error(`Não foi possível mostrar o feed: ${error.message}`);
        }
    }

    async mostrarPostUsuario(userId) {
        try {
            const postRef = query(collection(db, 'feed'), where('id', '==', userId));
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
            const userRef = doc(db, 'usuario', postData.id);
            const userDoc = await getDoc(userRef);
            const username = userDoc.exists() ? userDoc.data().username : 'Usuário Desconecido';
            return { ...postData, username };
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
            if (data.id !== userId) return { error: 'Ação não autorizada' };
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
            if (postDoc.data().id !== userId) return { error: 'Ação não autorizada' };
            await updateDoc(postRef, { descricao });
            return { message: 'Post editado com sucesso' };
        } catch (error) {
            console.error('Não foi possível editar o post:', error);
        }
    }
        
    async likePost(postId) {
        try {
            const postRef = doc(db, 'feed', postId);
            const postDoc = await getDoc(postRef);
            if (!postDoc.exists()) return { error: 'Post não encontrado' };
            const quantidadeLikes = postDoc.data().likes;
            await updateDoc(postRef, { likes: quantidadeLikes + 1 });
            return { message: 'Post curtido com sucesso' };
        } catch (error) {
            console.error('Não foi possível curtir o post:', error);
        }
    }

    async tirarLikePost(postId) {
        try {
            const postRef = doc(db, 'feed', postId);
            const postDoc = await getDoc(postRef);
            if (!postDoc.exists()) return { error: 'Post não encontrado' };
            const quantidadeLikes = postDoc.data().likes;
            if (quantidadeLikes > 0) {
                await updateDoc(postRef, { likes: quantidadeLikes - 1 });
                return { message: 'Like removido com sucesso' };
            }
            return { message: 'Post já não possui likes' };
        } catch (error) {
            console.error('Não foi possível remover o like do post:', error);
        }
    }
    

}

module.exports = new Feed();