import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useAppState } from '../state/AppStateContext';
import styles from '../../style';
import { spacing } from '../../style/tokens';
import { PLACES } from '../domain/places';

const AUTORES = [
  { nome: 'Marina', emoji: '🧗' },
  { nome: 'Equipe Sportfind', emoji: '⭐' },
  { nome: 'João', emoji: '🚴' },
  { nome: 'Ana', emoji: '🏃' },
  { nome: 'Comunidade', emoji: '📍' },
];

const TEMPOS = ['Há 2 h', 'Ontem', 'Há 3 h', 'Há 1 dia', 'Há 5 h'];

function rotuloTipo(tipo) {
  return tipo === 'Tenis' ? 'Tênis' : tipo;
}

function rotuloAcesso(acesso) {
  return acesso === 'Publico' ? 'Público' : acesso;
}

function montarPublicacoes() {

  const postsLocais = PLACES.map((place, indice) => ({
    id: `local-${place.id}`,
    kind: 'local',
    local: place,
    autor: AUTORES[indice % AUTORES.length],
    tempo: TEMPOS[indice % TEMPOS.length],
    curtidas: 12 + ((place.id * 7) % 80),
    comentarios: 1 + ((place.id * 3) % 12),
  }));

  const imagemDemo = [
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop&q=80',
  ];

  const postsImagem = [
    {
      id: 'img-1',
      kind: 'imagem',
      image: imagemDemo[0],
      autor: AUTORES[0],
      tempo: TEMPOS[2],
      curtidas: 48,
      comentarios: 7,
    },
    {
      id: 'img-2',
      kind: 'imagem',
      image: imagemDemo[1],
      autor: AUTORES[2],
      tempo: TEMPOS[4],
      curtidas: 21,
      comentarios: 2,
    },
  ];

  return [...postsLocais, ...postsImagem];
}

const API_URL = 'http://192.168.15.85:3000';
const PUBLICACOES = montarPublicacoes();

export default function TelaFeed() {
  const [publicacoes, setPublicacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { authUid } = useAppState();

  useEffect(() => {
    let cancelado = false;

    async function carregarPublicacoes() {
      setCarregando(true);
      try {
        const res = await fetch(`${API_URL}/feed`, { method: 'GET' });
        const data = await res.json();
        const publicacoesFormatadas = data.map(feed => ({
          id: feed.id,
          type: feed.type,
          url: feed.url,
          username: feed.username,
          dataCriacao: feed.dataCriacao,
          likes: feed.likes,
          comentarios: feed.comentarios,
          descricao: feed.descricao,
          dataCriacao: feed.dataCriacao,
        }));
        if (cancelado) return;
        setPublicacoes(publicacoesFormatadas);
      } catch (error) {
        console.error(error);
      } finally {
        setCarregando(false);
      }
    }

    carregarPublicacoes();

    return () => {
      cancelado = true;
    };
  }, [authUid]);
  






  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.feedHeaderRow}>
        <TouchableOpacity style={styles.feedHeaderIconBtn} activeOpacity={0.75} onPress={() => {}}>
          <Text style={styles.feedHeaderIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={publicacoes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.feedCard}>
            <View style={styles.feedCardHeader}>
              <View style={styles.feedCardAvatar}>
                <Text style={styles.feedCardAvatarEmoji}>👤</Text>
              </View>
              <View style={styles.feedCardHeaderMain}>
                <Text style={styles.feedCardAuthor}>{item.username}</Text>
                <Text style={styles.feedCardTime}>{item.dataCriacao}</Text>
              </View>
              <Text style={styles.feedCardMenu}>⋯</Text>
            </View>

            <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.sm }}>
              <Text style={styles.feedCardCaptionPlaceholderText}>Melhor jogo do mês!</Text>
            </View>

            {item.kind === 'local' ? (
            <Image source={{ uri: item.local.image }} style={styles.feedCardImage} resizeMode="cover" />
            ) : (
              <Image source={{ uri: item.url }} style={styles.feedCardImage} resizeMode="cover" />
            )}

            <View style={styles.feedCardBody}>
              {item.kind === 'local' ? (
                <>
                  <View style={styles.feedCardPlaceRow}>
                    <Text style={styles.feedCardPlaceEmoji}>{item.local.emoji}</Text>
                    <Text style={styles.feedCardPlaceName}>{item.local.name}</Text>
                  </View>
                  <Text style={styles.feedCardBodyText}>
                    {rotuloTipo(item.local.type)}  •  {item.local.distance}  •  {rotuloAcesso(item.local.access)}
                  </Text>
                  <Text style={styles.feedCardBodyText} numberOfLines={3}>
                    {item.descricao}
                  </Text>
                </>
              ) : (
                <>

                </>
              )}
            </View>

            <View style={styles.feedCardActions}>
              <TouchableOpacity style={styles.feedActionBtn} activeOpacity={0.7}>
                <Text style={styles.feedActionIcon}>♡</Text>
                <Text style={styles.feedActionLabel}>{item.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.feedActionBtn} activeOpacity={0.7}>
                <Text style={styles.feedActionIcon}>💬</Text>
                <Text style={styles.feedActionLabel}>{item.comentarios}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.feedActionBtn} activeOpacity={0.7}>
                <Text style={styles.feedActionIcon}>↗</Text>
                <Text style={styles.feedActionLabel}>Compartilhar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
