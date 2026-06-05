import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ScreenSafe from '../components/ScreenSafe';
import { useCallback, useEffect, useMemo, useState } from 'react';
import FeedPostCard from '../components/FeedPostCard';
import { useAppState } from '../state/AppStateContext';
import styles from '../../style';
import { colors } from '../../style/tokens';
import { montarPublicacoesDemo } from '../domain/feed/feedDemo';
import { abrirPerfilUsuario } from '../navigation/perfilNavigation';

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
          dataCriacao: feed.dataCriacao ?? '',
          likes: feed.likes ?? 0,
          comentarios: feed.comentarios ?? 0,
          maxParticipantes: feed.maxParticipantes ?? null,
          participantes: feed.participantes ?? [],
        };
      }
      return {
        id: feed.id ?? feed._id ?? `api-${index}`,
        kind: feed.type === 'local' ? 'local' : 'imagem',
        url: feed.url,
        username: feed.username ?? 'Usuário',
        dataCriacao: feed.dataCriacao ?? '',
        likes: feed.likes ?? 0,
        comentarios: feed.comentarios ?? 0,
        descricao: feed.descricao ?? '',
      };
    })
    .filter((post) => post.id != null);
}

export default function TelaFeed() {
  const navigation = useNavigation();
  const [publicacoes, setPublicacoes] = useState(() => montarPublicacoesDemo());
  const [ocultos, setOcultos] = useState(() => new Set());
  const [carregando, setCarregando] = useState(true);
  const [chipAtivo, setChipAtivo] = useState('todos');
  const {
    authUid,
    postsPartidasFeed,
    partidas,
    seguindo,
    alternarSeguir,
    participarPartida,
    desistirPartida,
  } = useAppState();

  const participarEAbrirDetalhes = useCallback(
    (partidaId) => {
      participarPartida?.(partidaId);
      navigation.navigate('TelaPartidaDetalhes', { partidaId });
    },
    [navigation, participarPartida],
  );

  const carregarPublicacoes = useCallback(async () => {
    setCarregando(true);
    const demo = montarPublicacoesDemo();
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/feed`, {
        method: 'GET',
        headers: authUid ? { 'X-User-Id': String(authUid) } : undefined,
      });
      const data = await res.json();
      const daApi = normalizarPostsApi(data);
      const base = daApi.length > 0 ? daApi : demo;
      const idsPartidas = new Set(postsPartidasFeed.map((p) => p.id));
      const semDuplicata = base.filter((p) => !idsPartidas.has(p.id));
      setPublicacoes([...postsPartidasFeed, ...semDuplicata]);
    } catch {
      setPublicacoes(demo);
    } finally {
      setCarregando(false);
    }
  }, [authUid, postsPartidasFeed]);

  const mesclarPartidas = useCallback(
    (lista) => {
      const ids = new Set(postsPartidasFeed.map((p) => p.id));
      const filtrada = lista.filter((p) => !ids.has(p.id));
      return [...postsPartidasFeed, ...filtrada];
    },
    [postsPartidasFeed],
  );

  useFocusEffect(
    useCallback(() => {
      carregarPublicacoes();
    }, [carregarPublicacoes]),
  );

  useEffect(() => {
    setPublicacoes((prev) => mesclarPartidas(prev));
  }, [partidas, postsPartidasFeed, mesclarPartidas]);

  const publicacoesFiltradas = useMemo(() => {
    let lista = publicacoes.filter((p) => !ocultos.has(p.id));
    if (chipAtivo === 'partidas') lista = lista.filter((p) => p.kind === 'partida');
    if (chipAtivo === 'locais') lista = lista.filter((p) => p.kind === 'local');
    if (chipAtivo === 'fotos') lista = lista.filter((p) => p.kind === 'imagem');
    return lista;
  }, [publicacoes, chipAtivo, ocultos]);

  function obterParticipantesPost(postId) {
    const partida = partidas.find((p) => p.id === postId);
    return partida?.participantes ?? [];
  }

  function postComParticipantes(item) {
    if (item.kind !== 'partida') return item;
    return { ...item, participantes: obterParticipantesPost(item.id) ?? item.participantes };
  }

  function ocultarPost(id) {
    setOcultos((prev) => new Set([...prev, id]));
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
          onPress={() => navigation.navigate('TelaMensagens')}
        >
          <Ionicons name="chatbubble-outline" size={20} color={colors.purple} />
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
          onPress={() => navigation.navigate('TelaBuscaFeed')}
        >
          <Ionicons name="search" size={20} color={colors.purple} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenSafe style={styles.screen}>
      <FlatList
        data={publicacoesFiltradas}
        keyExtractor={(item) => String(item.id)}
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
        renderItem={({ item }) => {
          const post = postComParticipantes(item);
          return (
            <FeedPostCard
              item={post}
              onOcultar={ocultarPost}
              seguindo={seguindo.has(post.username)}
              onSeguir={alternarSeguir}
              onPressAutor={(nome) => abrirPerfilUsuario(navigation, { username: nome })}
              onParticipar={participarEAbrirDetalhes}
              onDesistir={desistirPartida}
            />
          );
        }}
      />
    </ScreenSafe>
  );
}
