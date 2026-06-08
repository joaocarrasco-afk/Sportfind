import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PerfilPostModal from '../components/PerfilPostModal';
import ScreenSafe from '../components/ScreenSafe';
import { useAppState } from '../state/AppStateContext';
import styles from '../../style';
import { colors } from '../../style/tokens';

const ABAS = [
  { id: 'pub', label: 'Publicações' },
  { id: 'trophy', label: 'Troféus' },
];

function normalizarPostsApi(data) {
  const lista = Array.isArray(data) ? data : [];
  return lista.map((post, index) => ({
    id: post.id ?? `post-${index}`,
    url: post.url,
    descricao: post.descricao ?? '',
    dataCriacao: post.dataCriacao ?? '',
    likes: post.likes ?? 0,
    comentarios: post.comentarios ?? 0,
    tipo: post.type === 'video' ? 'video' : 'imagem',
  }));
}

function normalizarPerfilApi(userId, data) {
  return {
    id: userId,
    username: data?.username ?? 'Usuário',
    cidade: data?.cidade ?? '',
    bio: data?.bio ?? '',
    tags: Array.isArray(data?.tags) ? data.tags : [],
    seguidoresIds: data?.seguidores_id ?? [],
    seguindoIds: data?.seguindo_id ?? [],
    url: data?.url ?? null,
  };
}



export default function TelaPerfilUsuario({ navigation }) {
  const route = useRoute();
  const userId = route.params?.userId;
  const { seguindo, alternarSeguir, authUid } = useAppState();
  const [aba, setAba] = useState('pub');
  const [postSelecionado, setPostSelecionado] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [publicacoes, setPublicacoes] = useState([]);
  const [carregando, setCarregando] = useState(Boolean(userId));
  const fotoPerfil = usuario?.url ?? null;
  const jaSeguindo = usuario ? seguindo.has(usuario.id) : false;

  const alternarSeguirPerfil = useCallback(async () => {
    if (!usuario?.id) return;

    const eraSeguindo = seguindo.has(usuario.id);
    const ok = await alternarSeguir({ userId: usuario.id, username: usuario.username });
    if (!ok || !usuario || !authUid) return;

    setUsuario((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        seguidoresIds: eraSeguindo
          ? prev.seguidoresIds.filter((id) => id !== authUid)
          : [...prev.seguidoresIds, authUid],
      };
    });
  }, [usuario, seguindo, alternarSeguir, authUid]);

  const handleLikeChange = useCallback((postId, { likes }) => {
    setPublicacoes((prev) => prev.map((p) => (p.id === postId ? { ...p, likes } : p)));
    setPostSelecionado((prev) => (prev?.id === postId ? { ...prev, likes } : prev));
  }, []);

  const carregarPerfilApi = useCallback(async () => {
    if (!userId) {
      setCarregando(false);
      return;
    }

    setCarregando(true);
    try {
      const [resPerfil, resPosts] = await Promise.all([
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/usuario/perfil/${encodeURIComponent(userId)}`, {
          method: 'GET',
        }),
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/feed/post/${encodeURIComponent(userId)}`, {
          method: 'GET',
        }),
      ]);

      if (resPerfil.ok) {
        const data = await resPerfil.json();
        setUsuario(normalizarPerfilApi(userId, data));
      } else {
        setUsuario(null);
      }

      if (resPosts.ok) {
        const posts = await resPosts.json();
        setPublicacoes(normalizarPostsApi(posts));
      } else {
        setPublicacoes([]);
      }
    } catch {
      setUsuario(null);
      setPublicacoes([]);
    } finally {
      setCarregando(false);
    }
  }, [userId]);

  useEffect(() => {
    carregarPerfilApi();
  }, [carregarPerfilApi]);

  if (carregando) {
    return (
      <ScreenSafe style={styles.usuarioScreen} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.conexoesHeader}>
          <TouchableOpacity style={styles.messageBackBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.purple} />
          </TouchableOpacity>
          <Text style={styles.conexoesHeaderTitle}>Perfil</Text>
          <View style={styles.messageHeaderSpacer} />
        </View>
        <View style={styles.userSearchEmpty}>
          <ActivityIndicator size="large" color={colors.purple} />
        </View>
      </ScreenSafe>
    );
  }

  if (!usuario) {
    return (
      <ScreenSafe style={styles.usuarioScreen} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.conexoesHeader}>
          <TouchableOpacity style={styles.messageBackBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.purple} />
          </TouchableOpacity>
          <Text style={styles.conexoesHeaderTitle}>Perfil</Text>
          <View style={styles.messageHeaderSpacer} />
        </View>
        <View style={styles.userSearchEmpty}>
          <Text style={styles.userSearchEmptyText}>Usuário não encontrado.</Text>
        </View>
      </ScreenSafe>
    );
  }

  function renderCelulaGrid(post) {
    const ehPartida = post.tipo === 'partida';
    const temImagem = Boolean(post.url);

    return (
      <Pressable
        key={post.id}
        style={styles.usuarioFeedCell}
        onPress={() => setPostSelecionado(post)}
      >
        <View
          style={[
            styles.usuarioFeedCellInner,
            ehPartida && !temImagem && styles.usuarioFeedCellPartida,
          ]}
        >
          {temImagem ? (
            <Image source={{ uri: post.url }} style={styles.usuarioFeedCellImage} resizeMode="cover" />
          ) : (
            <Ionicons
              name={ehPartida ? 'football' : 'image-outline'}
              size={32}
              color={ehPartida ? colors.purple : colors.purpleLight}
            />
          )}
          {ehPartida ? (
            <View style={styles.usuarioFeedCellBadge}>
              <Text style={styles.usuarioFeedCellBadgeText}>Partida</Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    );
  }

  return (
    <ScreenSafe style={styles.usuarioScreen} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.perfilOutroTopBar}>
        <TouchableOpacity style={styles.messageBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.purple} />
        </TouchableOpacity>
        <Text style={styles.perfilOutroTopTitle} numberOfLines={1}>
          {usuario.username} {/*nome do usuario*/}
        </Text>
        <View style={styles.messageHeaderSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.usuarioAvatarWrap}>
          <View style={styles.usuarioAvatar}>
            {fotoPerfil ? (
              <Image source={{ uri: fotoPerfil }} style={styles.usuarioAvatarImage} resizeMode="cover" />
            ) : (
              <Text style={styles.perfilOutroAvatarLetter}>{usuario.username.charAt(0)}</Text>
            )}
          </View>
        </View>

        <Text style={styles.usuarioName}>{usuario.username}</Text>
        {usuario.cidade ? (
          <View style={styles.usuarioLocationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.usuarioLocationText, { marginLeft: 4 }]}>{usuario.cidade}</Text>
          </View>
        ) : null}

        {usuario.bio ? <Text style={styles.perfilOutroBio}>{usuario.bio}</Text> : null}

        {usuario.tags.length > 0 ? (
          <View style={styles.usuarioTagsRow}>
            {usuario.tags.map((t) => (
              <View key={t} style={styles.usuarioTagPill}>
                <Text style={styles.usuarioTagText}>{t}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.usuarioStatsRow}>
          <View style={styles.usuarioStatBlock}>
            <Text style={styles.usuarioStatValue}>{usuario.seguidoresIds.length}</Text>
            <Text style={styles.usuarioStatLabel}>Seguidores</Text>
          </View>
          <View style={styles.usuarioStatBlock}>
            <Text style={styles.usuarioStatValue}>{usuario.seguindoIds.length}</Text>
            <Text style={styles.usuarioStatLabel}>Seguindo</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.perfilOutroFollowBtn, jaSeguindo && styles.perfilOutroFollowBtnActive]}
          onPress={alternarSeguirPerfil}
          activeOpacity={0.85}
          disabled={!authUid || authUid === usuario.id}
        >
          <Text
            style={[
              styles.perfilOutroFollowBtnText,
              jaSeguindo && styles.perfilOutroFollowBtnTextActive,
            ]}
          >
            {jaSeguindo ? 'Seguindo' : 'Seguir'}
          </Text>
        </TouchableOpacity>

        <View style={styles.usuarioTabBar}>
          {ABAS.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.usuarioTabBtn, aba === t.id && styles.usuarioTabBtnActive]}
              onPress={() => setAba(t.id)}
            >
              <Text style={[styles.usuarioTabText, aba === t.id && styles.usuarioTabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.usuarioFeedSection}>
          {aba === 'pub' ? (
            publicacoes.length > 0 ? (
              <View style={styles.usuarioFeedGrid}>{publicacoes.map(renderCelulaGrid)}</View>
            ) : (
              <View style={styles.usuarioEmptyTab}>
                <Ionicons name="images-outline" size={36} color={colors.purpleLight} />
                <Text style={styles.usuarioEmptyTabText}>Nenhuma publicação ainda.</Text>
              </View>
            )
          ) : (
            <View style={styles.usuarioEmptyTab}>
              <Ionicons name="trophy-outline" size={36} color={colors.purpleLight} />
              <Text style={styles.usuarioEmptyTabText}>Troféus aparecerão aqui.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <PerfilPostModal
        visible={postSelecionado != null}
        post={postSelecionado}
        username={usuario.username}
        isOwnProfile={false}
        onClose={() => setPostSelecionado(null)}
        onLikeChange={handleLikeChange}
      />
    </ScreenSafe>
  );
}
