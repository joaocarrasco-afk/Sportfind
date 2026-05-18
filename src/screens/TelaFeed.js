import { Ionicons } from '@expo/vector-icons';
import { FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import FeedPostCard from '../components/FeedPostCard';
import { useAppState } from '../state/AppStateContext';
import styles from '../../style';
import { colors } from '../../style/tokens';
import { PLACES } from '../domain/places';

const AUTORES = [
  { nome: 'Marina', emoji: '🧗' },
  { nome: 'Equipe Sportfind', emoji: '⭐' },
  { nome: 'João', emoji: '🚴' },
  { nome: 'Ana', emoji: '🏃' },
  { nome: 'Comunidade', emoji: '📍' },
];

const TEMPOS = ['Há 2 h', 'Ontem', 'Há 3 h', 'Há 1 dia', 'Há 5 h'];

const CHIPS = [
  { id: 'todos', label: 'Todos' },
  { id: 'locais', label: 'Locais' },
  { id: 'fotos', label: 'Fotos' },
];

function montarPublicacoesDemo() {
  const postsLocais = PLACES.map((place, indice) => ({
    id: `local-${place.id}`,
    kind: 'local',
    local: place,
    username: AUTORES[indice % AUTORES.length].nome,
    dataCriacao: TEMPOS[indice % TEMPOS.length],
    likes: 12 + ((place.id * 7) % 80),
    comentarios: 1 + ((place.id * 3) % 12),
    descricao: place.description,
  }));

  const imagemDemo = [
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop&q=80',
  ];

  const postsImagem = [
    {
      id: 'img-1',
      kind: 'imagem',
      url: imagemDemo[0],
      username: AUTORES[0].nome,
      dataCriacao: TEMPOS[2],
      likes: 48,
      comentarios: 7,
      descricao: 'Melhor jogo do mês!',
    },
    {
      id: 'img-2',
      kind: 'imagem',
      url: imagemDemo[1],
      username: AUTORES[2].nome,
      dataCriacao: TEMPOS[4],
      likes: 21,
      comentarios: 2,
      descricao: 'Pelada no fim de semana.',
    },
  ];

  return [...postsLocais, ...postsImagem];
}

const API_URL = 'http://10.100.1.177:3000';

function normalizarPostsApi(data) {
  const lista = Array.isArray(data) ? data : (data?.feeds ?? data?.data ?? []);
  if (!Array.isArray(lista)) return [];

  return lista
    .map((feed, index) => ({
      id: feed.id ?? feed._id ?? `api-${index}`,
      kind: feed.type === 'local' ? 'local' : 'imagem',
      url: feed.url,
      username: feed.username ?? 'Usuário',
      dataCriacao: feed.dataCriacao ?? '',
      likes: feed.likes ?? 0,
      comentarios: feed.comentarios ?? 0,
      descricao: feed.descricao ?? '',
    }))
    .filter((post) => post.id != null);
}

export default function TelaFeed() {
  const [publicacoes, setPublicacoes] = useState(() => montarPublicacoesDemo());
  const [ocultos, setOcultos] = useState(() => new Set());
  const [carregando, setCarregando] = useState(true);
  const [chipAtivo, setChipAtivo] = useState('todos');
  const { authUid } = useAppState();

  useEffect(() => {
    let cancelado = false;

    async function carregarPublicacoes() {
      setCarregando(true);
      const demo = montarPublicacoesDemo();
      try {
        const res = await fetch(`${API_URL}/feed`, { method: 'GET' });
        const data = await res.json();
        const daApi = normalizarPostsApi(data);
        if (cancelado) return;
        setPublicacoes(daApi.length > 0 ? daApi : demo);
      } catch {
        if (!cancelado) setPublicacoes(demo);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregarPublicacoes();

    return () => {
      cancelado = true;
    };
  }, [authUid]);

  const publicacoesFiltradas = useMemo(() => {
    let lista = publicacoes.filter((p) => !ocultos.has(p.id));
    if (chipAtivo === 'locais') lista = lista.filter((p) => p.kind === 'local');
    if (chipAtivo === 'fotos') lista = lista.filter((p) => p.kind === 'imagem');
    return lista;
  }, [publicacoes, chipAtivo, ocultos]);

  function ocultarPost(id) {
    setOcultos((prev) => new Set([...prev, id]));
  }

  function restaurarFeed() {
    setOcultos(new Set());
  }

  const ListHeader = (
    <>
      <View style={styles.feedHeaderRow}>
        <View style={styles.feedHeaderText}>
          <Text style={styles.feedTitle}>Feed</Text>
          <Text style={styles.feedSubtitle}>Atividade da comunidade Sportfind</Text>
        </View>
        <TouchableOpacity style={styles.feedHeaderIconBtn} activeOpacity={0.75} onPress={() => {}}>
          <Ionicons name="search" size={20} color={colors.purple} />
        </TouchableOpacity>
      </View>

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
    </>
  );

  return (
    <SafeAreaView style={styles.screen}>
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
        renderItem={({ item }) => <FeedPostCard item={item} onOcultar={ocultarPost} />}
      />
    </SafeAreaView>
  );
}
