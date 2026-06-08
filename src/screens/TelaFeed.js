import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Alert, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ScreenSafe from '../components/ScreenSafe';
import { useCallback, useMemo, useState } from 'react';
import FeedPostCard from '../components/FeedPostCard';
import { useAppState } from '../state/AppStateContext';
import styles from '../../style';
import { colors } from '../../style/tokens';
import { usernameParaUserId } from '../domain/users';
import { abrirPerfilUsuario } from '../navigation/perfilNavigation';
import { listarEventos, normalizarEventosParaFeed, participarEvento } from '../utils/eventoApi';

const CHIPS = [
  { id: 'todos', label: 'Todos' },
  { id: 'partidas', label: 'Partidas' },
  { id: 'locais', label: 'Locais' },
  { id: 'fotos', label: 'Fotos' },
];


function normalizarPostsApi(data) {
  const lista = Array.isArray(data) ? data : (data?.feeds ?? data?.data ?? []);
  if (!Array.isArray(lista)) return [];

  return lista
    .map((feed, index) => {
      if (feed.type === 'partida' || feed.kind === 'partida') {
        return {
          id: feed.id ?? feed._id ?? `api-${index}`,
          kind: 'partida',
          nomePartida: feed.nomePartida ?? feed.nome ?? '',
          esporte: feed.esporte ?? '',
          horario: feed.horario ?? feed.dataCriacao ?? '',
          local: feed.local ?? null,
          username: feed.username ?? 'Usuário',
          userId: feed.user ?? feed.userId ?? null,
          dataCriacao: feed.dataCriacao ?? '',
          likes: feed.likes ?? 0,
          comentarios: feed.comentarios ?? 0,
          maxParticipantes: feed.maxParticipantes ?? null,
          participantes: feed.participantes ?? [],
          url_perfil: feed.url_perfil ?? null,
        };
      }
      return {
        id: feed.id ?? feed._id ?? `api-${index}`,
        kind: feed.type === 'local' ? 'local' : 'imagem',
        url: feed.url,
        username: feed.username ?? 'Usuário',
        userId: feed.user ?? feed.userId ?? null,
        dataCriacao: feed.dataCriacao ?? '',
        likes: feed.likes ?? 0,
        comentarios: feed.comentarios ?? 0,
        descricao: feed.descricao ?? '',
        url_perfil: feed.url_perfil ?? null,
      };
    })
    .filter((post) => post.id != null);
}

export default function TelaFeed() {
  const navigation = useNavigation();
  const [publicacoes, setPublicacoes] = useState([]);
  const [ocultos, setOcultos] = useState(() => new Set());
  const [carregando, setCarregando] = useState(true);
  const [chipAtivo, setChipAtivo] = useState('todos');
  const { authUid, seguindo, curtidos, alternarSeguir } = useAppState();

  const atualizarParticipantes = useCallback((partidaId, participantes) => {
    setPublicacoes((prev) =>
      prev.map((p) => (p.id === partidaId ? { ...p, participantes } : p)),
    );
  }, []);

  const participarEAbrirDetalhes = useCallback(
    async (partidaId) => {
      if (!authUid) {
        Alert.alert('Login necessário', 'Faça login para participar da partida.');
        return;
      }

      const post = publicacoes.find((p) => p.id === partidaId);
      if (post?.participantes?.includes(authUid)) {
        navigation.navigate('TelaPartidaDetalhes', { partidaId });
        return;
      }

      try {
        const resultado = await participarEvento(partidaId, authUid);
        const participantes =
          resultado.participantes ?? [...(post?.participantes ?? []), authUid];
        atualizarParticipantes(partidaId, participantes);
        navigation.navigate('TelaPartidaDetalhes', { partidaId });
      } catch (error) {
        Alert.alert('Erro', error?.message ?? 'Não foi possível participar da partida.');
      }
    },
    [authUid, publicacoes, navigation, atualizarParticipantes],
  );

  const desistirDaPartida = useCallback(
    (partidaId) => {
      if (!authUid) return;
      setPublicacoes((prev) =>
        prev.map((p) =>
          p.id === partidaId
            ? {
                ...p,
                participantes: (p.participantes ?? []).filter(
                  (id) => id !== authUid && id !== 'voce',
                ),
              }
            : p,
        ),
      );
    },
    [authUid],
  );

  const carregarPublicacoes = useCallback(async () => {
    setCarregando(true);
    try {
      const [feedRes, eventos] = await Promise.all([
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/feed`, {
          method: 'GET',
          headers: authUid ? { 'X-User-Id': String(authUid) } : undefined,
        }),
        listarEventos().catch(() => []),
      ]);

      const feedData = feedRes.ok ? await feedRes.json() : [];
      const postsFeed = normalizarPostsApi(feedData).filter((p) => p.kind !== 'partida');
      const postsPartidas = normalizarEventosParaFeed(eventos);
      const idsPartidas = new Set(postsPartidas.map((p) => p.id));
      const semDuplicata = postsFeed.filter((p) => !idsPartidas.has(p.id));
      setPublicacoes([...postsPartidas, ...semDuplicata]);
    } catch {
      setPublicacoes([]);
    } finally {
      setCarregando(false);
    }
  }, [authUid]);

  useFocusEffect(
    useCallback(() => {
      carregarPublicacoes();
    }, [carregarPublicacoes]),
  );

  const publicacoesFiltradas = useMemo(() => {
    let lista = publicacoes.filter((p) => !ocultos.has(p.id));
    if (chipAtivo === 'partidas') lista = lista.filter((p) => p.kind === 'partida');
    if (chipAtivo === 'locais') lista = lista.filter((p) => p.kind === 'local');
    if (chipAtivo === 'fotos') lista = lista.filter((p) => p.kind === 'imagem');
    return lista;
  }, [publicacoes, chipAtivo, ocultos]);

  function idSeguirPost(post) {
    return post.userId ?? usernameParaUserId(post.username);
  }

  function postJaSeguido(post) {
    const id = idSeguirPost(post);
    return id ? seguindo.has(id) : false;
  }

  function ocultarPost(id) {
    setOcultos((prev) => new Set([...prev, id]));
  }

  function atualizarLikesPost(postId, { likes }) {
    setPublicacoes((prev) => prev.map((p) => (p.id === postId ? { ...p, likes } : p)));
  }

  function restaurarFeed() {
    setOcultos(new Set());
  }

  const ListHeader = (
    <View style={styles.feedHeaderWrap}>
      <View style={styles.feedToolbarRow}>
        <TouchableOpacity
          style={[styles.feedHeaderIconBtn, styles.feedToolbarSideBtn]}
          activeOpacity={0.75}
          onPress={() => navigation.navigate('TelaBuscaFeed')}
        >
          <Ionicons name="search" size={20} color={colors.purple} />
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.feedChipsScroll}
          contentContainerStyle={styles.feedChipsContent}
        >
          {CHIPS.map((chip) => {
            const ativo = chipAtivo === chip.id;
            return (
              <TouchableOpacity
                key={chip.id}
                style={[styles.feedChip, ativo && styles.feedChipActive]}
                onPress={() => setChipAtivo(chip.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.feedChipLabel, ativo && styles.feedChipLabelActive]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={[styles.feedHeaderIconBtn, styles.feedToolbarSideBtn]}
          activeOpacity={0.75}
          onPress={() => navigation.navigate('TelaMensagens')}
        >
          <Ionicons name="chatbubble-outline" size={20} color={colors.purple} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenSafe style={styles.screen}>
      <FlatList
        data={publicacoesFiltradas}
        keyExtractor={(item) => String(item.id)}
        extraData={[seguindo, curtidos, publicacoes]}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.feedList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !carregando ? (
            <View style={styles.feedEmpty}>
              <Ionicons name="newspaper-outline" size={40} color={colors.purpleLight} />
              <Text style={styles.feedEmptyText}>
                {ocultos.size > 0
                  ? 'Você ocultou todas as publicações.'
                  : 'Nenhuma publicação ainda.'}
              </Text>
              {ocultos.size > 0 ? (
                <TouchableOpacity onPress={restaurarFeed} style={{ marginTop: 12 }}>
                  <Text style={{ color: colors.purple, fontWeight: '700' }}>Mostrar novamente</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <FeedPostCard
            item={item}
            onOcultar={ocultarPost}
            seguindo={postJaSeguido(item)}
            onSeguir={alternarSeguir}
            onLikeChange={atualizarLikesPost}
            onPressAutor={() =>
              abrirPerfilUsuario(navigation, {
                userId: item.userId,
                username: item.username,
                authUid,
              })
            }
            onParticipar={participarEAbrirDetalhes}
            onDesistir={desistirDaPartida}
            onPressPartida={(partidaId) =>
              navigation.navigate('TelaPartidaDetalhes', { partidaId })
            }
          />
        )}
      />
    </ScreenSafe>
  );
}
