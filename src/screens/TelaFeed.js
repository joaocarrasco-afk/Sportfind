import { useState } from 'react';
import { FlatList, Image, ScrollView, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import styles from '../../style';
import { FILTER_ALL, PLACE_TYPE_FILTERS, PLACES } from '../domain/places';

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
  return PLACES.map((place, indice) => ({
    id: String(place.id),
    local: place,
    autor: AUTORES[indice % AUTORES.length],
    tempo: TEMPOS[indice % TEMPOS.length],
    curtidas: 12 + ((place.id * 7) % 80),
    comentarios: 1 + ((place.id * 3) % 12),
  }));
}

const PUBLICACOES = montarPublicacoes();

export default function TelaFeed() {
  const [filtroTipo, setFiltroTipo] = useState(FILTER_ALL);

  const publicacoes =
    filtroTipo === FILTER_ALL
      ? PUBLICACOES
      : PUBLICACOES.filter((p) => p.local.type === filtroTipo);

  const tituloSecao = filtroTipo === FILTER_ALL ? 'Para você' : rotuloTipo(filtroTipo);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.feedHeaderRow}>
        <View style={styles.feedHeaderText}>
          <Text style={styles.feedTitle}>Feed</Text>
          <Text style={styles.feedSubtitle}>Locais em destaque perto de você e da comunidade</Text>
        </View>
        <TouchableOpacity style={styles.feedHeaderIconBtn} activeOpacity={0.75} onPress={() => {}}>
          <Text style={styles.feedHeaderIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.feedChipsScroll}
        contentContainerStyle={styles.feedChipsContent}
      >
        {PLACE_TYPE_FILTERS.map((tipo) => {
          const ativo = filtroTipo === tipo;
          return (
            <TouchableOpacity
              key={tipo}
              style={[styles.optionChip, ativo && styles.optionChipActive]}
              onPress={() => setFiltroTipo(tipo)}
              activeOpacity={0.8}
            >
              <Text style={[styles.optionChipText, ativo && styles.feedChipLabelActive]}>{rotuloTipo(tipo)}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionLabel}>{tituloSecao}</Text>

      <FlatList
        data={publicacoes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.feedCard}>
            <View style={styles.feedCardHeader}>
              <View style={styles.feedCardAvatar}>
                <Text style={styles.feedCardAvatarEmoji}>{item.autor.emoji}</Text>
              </View>
              <View style={styles.feedCardHeaderMain}>
                <Text style={styles.feedCardAuthor}>{item.autor.nome}</Text>
                <Text style={styles.feedCardTime}>{item.tempo}</Text>
              </View>
              <Text style={styles.feedCardMenu}>⋯</Text>
            </View>

            <Image source={{ uri: item.local.image }} style={styles.feedCardImage} resizeMode="cover" />

            <View style={styles.feedCardBody}>
              <View style={styles.feedCardPlaceRow}>
                <Text style={styles.feedCardPlaceEmoji}>{item.local.emoji}</Text>
                <Text style={styles.feedCardPlaceName}>{item.local.name}</Text>
              </View>
              <Text style={styles.feedCardBodyText}>
                {rotuloTipo(item.local.type)}  •  {item.local.distance}  •  {rotuloAcesso(item.local.access)}
              </Text>
              <Text style={styles.feedCardBodyText} numberOfLines={3}>
                {item.local.description}
              </Text>
            </View>

            <View style={styles.feedCardActions}>
              <TouchableOpacity style={styles.feedActionBtn} activeOpacity={0.7}>
                <Text style={styles.feedActionIcon}>♡</Text>
                <Text style={styles.feedActionLabel}>{item.curtidas}</Text>
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
