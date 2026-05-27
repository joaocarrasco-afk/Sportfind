import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  SectionList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenSafe from '../components/ScreenSafe';
import {
  FILTROS_BUSCA_FEED,
  buscarNoFeed,
  subtituloPostBusca,
  tituloPostBusca,
} from '../domain/feed/buscaFeed';
import { montarPublicacoesDemo } from '../domain/feed/feedDemo';
import { emojiEsporte, rotuloEsporte } from '../domain/feed/posts';
import { abrirPerfilUsuario } from '../navigation/perfilNavigation';
import { useAppState } from '../state/AppStateContext';
import styles from '../../style';
import { colors } from '../../style/tokens';

function montarCatalogoFeed(postsPartidasFeed) {
  const demo = montarPublicacoesDemo();
  const ids = new Set(postsPartidasFeed.map((p) => p.id));
  const semDup = demo.filter((p) => !ids.has(p.id));
  return [...postsPartidasFeed, ...semDup];
}

function chaveItem(item) {
  if (item.tipo === 'pessoa') return `u-${item.dados.id}`;
  if (item.tipo === 'evento') return `e-${item.dados.id}`;
  return `p-${item.dados.id}`;
}

export default function TelaBuscaFeed({ navigation }) {
  const { postsPartidasFeed } = useAppState();
  const [termo, setTermo] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [postPreview, setPostPreview] = useState(null);

  const catalogo = useMemo(
    () => montarCatalogoFeed(postsPartidasFeed),
    [postsPartidasFeed],
  );

  const resultados = useMemo(() => buscarNoFeed(catalogo, termo), [catalogo, termo]);

  const secoes = useMemo(() => {
    const { pessoas, eventos, posts } = resultados;

    if (filtro === 'pessoas') {
      return [{ title: '', data: pessoas.map((dados) => ({ tipo: 'pessoa', dados })) }];
    }
    if (filtro === 'eventos') {
      return [{ title: '', data: eventos.map((dados) => ({ tipo: 'evento', dados })) }];
    }
    if (filtro === 'posts') {
      return [{ title: '', data: posts.map((dados) => ({ tipo: 'post', dados })) }];
    }

    const out = [];
    if (pessoas.length) {
      out.push({
        title: 'Pessoas',
        data: pessoas.map((dados) => ({ tipo: 'pessoa', dados })),
      });
    }
    if (eventos.length) {
      out.push({
        title: 'Eventos',
        data: eventos.map((dados) => ({ tipo: 'evento', dados })),
      });
    }
    if (posts.length) {
      out.push({
        title: 'Posts',
        data: posts.map((dados) => ({ tipo: 'post', dados })),
      });
    }
    return out;
  }, [resultados, filtro]);

  const totalResultados =
    resultados.pessoas.length + resultados.eventos.length + resultados.posts.length;

  function abrirPessoa(usuario) {
    abrirPerfilUsuario(navigation, { userId: usuario.id });
  }

  function abrirEvento(post) {
    navigation.navigate('TelaPartidaDetalhes', { partidaId: post.id });
  }

  function abrirPost(post) {
    if (post.kind === 'local' && post.local?.id) {
      navigation.navigate('TelaLocal', { placeId: post.local.id });
      return;
    }
    setPostPreview(post);
  }

  function renderPessoa(usuario) {
    return (
      <TouchableOpacity
        style={styles.userSearchCard}
        activeOpacity={0.85}
        onPress={() => abrirPessoa(usuario)}
      >
        <View style={styles.userSearchAvatar}>
          <Text style={styles.userSearchAvatarText}>{usuario.username.charAt(0)}</Text>
        </View>
        <View style={styles.userSearchCardBody}>
          <Text style={styles.userSearchNome}>{usuario.username}</Text>
          <Text style={styles.userSearchMeta} numberOfLines={1}>
            {usuario.cidade} · {usuario.tags.slice(0, 2).join(', ')}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.purple} />
      </TouchableOpacity>
    );
  }

  function renderEvento(post) {
    return (
      <TouchableOpacity
        style={styles.feedBuscaCard}
        activeOpacity={0.85}
        onPress={() => abrirEvento(post)}
      >
        <View style={styles.feedBuscaIconWrap}>
          <Text style={styles.feedBuscaEmoji}>{emojiEsporte(post.esporte)}</Text>
        </View>
        <View style={styles.userSearchCardBody}>
          <Text style={styles.userSearchNome}>{tituloPostBusca(post)}</Text>
          <Text style={styles.userSearchMeta} numberOfLines={2}>
            {rotuloEsporte(post.esporte)} · {post.horario}
            {post.local?.name ? ` · ${post.local.name}` : ''}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.purple} />
      </TouchableOpacity>
    );
  }

  function renderPostFeed(post) {
    const thumb = post.url ?? post.local?.image;
    return (
      <TouchableOpacity
        style={styles.feedBuscaCard}
        activeOpacity={0.85}
        onPress={() => abrirPost(post)}
      >
        {thumb ? (
          <Image source={{ uri: thumb }} style={styles.feedBuscaThumb} resizeMode="cover" />
        ) : (
          <View style={styles.feedBuscaIconWrap}>
            <Ionicons name="image-outline" size={22} color={colors.purple} />
          </View>
        )}
        <View style={styles.userSearchCardBody}>
          <Text style={styles.userSearchNome} numberOfLines={2}>
            {tituloPostBusca(post)}
          </Text>
          <Text style={styles.userSearchMeta} numberOfLines={2}>
            {subtituloPostBusca(post)}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.purple} />
      </TouchableOpacity>
    );
  }

  function renderItem({ item }) {
    if (item.tipo === 'pessoa') return renderPessoa(item.dados);
    if (item.tipo === 'evento') return renderEvento(item.dados);
    return renderPostFeed(item.dados);
  }

  const listaVazia = (
    <View style={styles.userSearchEmpty}>
      <Ionicons name="search-outline" size={40} color={colors.purpleLight} />
      <Text style={styles.userSearchEmptyText}>
        {termo.trim() === ''
          ? 'Digite para buscar posts, eventos ou pessoas.'
          : 'Nenhum resultado encontrado.'}
      </Text>
    </View>
  );

  return (
    <ScreenSafe style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.searchBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.purple} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar posts, eventos e pessoas..."
          placeholderTextColor={colors.textSecondary}
          value={termo}
          onChangeText={setTermo}
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.feedBuscaChipsScroll}
        contentContainerStyle={styles.feedBuscaChipsContent}
      >
        {FILTROS_BUSCA_FEED.map((chip) => {
          const ativo = filtro === chip.id;
          return (
            <TouchableOpacity
              key={chip.id}
              style={[styles.feedChip, ativo && styles.feedChipActive]}
              onPress={() => setFiltro(chip.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.feedChipLabel, ativo && styles.feedChipLabelActive]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionLabel}>
        {termo.trim() === '' && filtro === 'todos'
          ? 'Sugestões'
          : `${totalResultados} resultado(s)`}
      </Text>

      <SectionList
        sections={secoes}
        keyExtractor={chaveItem}
        renderSectionHeader={({ section: { title } }) =>
          title ? <Text style={styles.feedBuscaSectionTitle}>{title}</Text> : null
        }
        renderItem={renderItem}
        contentContainerStyle={[styles.userSearchList, secoes.length === 0 && { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={listaVazia}
      />

      <Modal
        visible={postPreview != null}
        transparent
        animationType="fade"
        onRequestClose={() => setPostPreview(null)}
      >
        <Pressable style={styles.feedBuscaModalRoot} onPress={() => setPostPreview(null)}>
          <Pressable style={styles.feedBuscaModalCard} onPress={(e) => e.stopPropagation()}>
            {postPreview?.url ? (
              <Image source={{ uri: postPreview.url }} style={styles.feedBuscaModalImage} />
            ) : null}
            <Text style={styles.feedBuscaModalTitle}>{postPreview && tituloPostBusca(postPreview)}</Text>
            {postPreview?.descricao ? (
              <Text style={styles.feedBuscaModalDesc}>{postPreview.descricao}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.feedBuscaModalBtn}
              onPress={() => {
                const post = postPreview;
                setPostPreview(null);
                navigation.navigate('TelaFeed');
              }}
            >
              <Text style={styles.feedBuscaModalBtnText}>Ver no feed</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenSafe>
  );
}
