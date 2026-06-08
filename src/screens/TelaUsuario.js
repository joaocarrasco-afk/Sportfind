import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenSafe from '../components/ScreenSafe';
import styles from '../../style';
import { colors, spacing } from '../../style/tokens';
import PerfilPostAcoesSheet from '../components/PerfilPostAcoesSheet';
import PerfilPostModal from '../components/PerfilPostModal';
import { useAppState } from '../state/AppStateContext';
import * as ImagePicker from 'expo-image-picker';


function formatarDataCriacao(dataCriacao) {
  if (!dataCriacao) return '';
  if (typeof dataCriacao === 'string') return dataCriacao;
  if (typeof dataCriacao.toDate === 'function') return dataCriacao.toDate().toISOString();
  return String(dataCriacao);
}

async function buscarUsuariosPorIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const resultados = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/usuario/perfil/${encodeURIComponent(id)}`, {
        method: 'GET',
      });
      if (!res.ok) return null;

      let data = null;
      try {
        data = await res.json();
      } catch {
        return null;
      }

      return {
        id,
        username: data?.username ?? 'Usuário',
        url: data?.url ?? null,
      };
    }),
  );

  return resultados.filter(Boolean);
}

async function buscarPostsPorIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const resultados = await Promise.all(
    ids.map(async (postId) => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/feed/post/usuario/${encodeURIComponent(postId)}`, {
        method: 'GET',
      });
      if (!res.ok) return null;

      let post = null;
      try {
        post = await res.json();
      } catch {
        return null;
      }

      if (!post || post.error) return null;

      return {
        id: postId,
        url: post.url,
        descricao: post.descricao ?? '',
        dataCriacao: formatarDataCriacao(post.dataCriacao),
        likes: post.likes ?? 0,
        comentarios: post.comentarios ?? 0,
        tipo: post.type === 'video' ? 'video' : 'imagem',
        editavel: false,
      };
    }),
  );

  return resultados.filter(Boolean);
}


const ABAS = [
  { id: 'pub', label: 'Publicações' },
  { id: 'trophy', label: 'Troféus' },
  { id: 'liked', label: 'Curtidos' },
];



export default function TelaUsuario() {
  const navigation = useNavigation();
  const [aba, setAba] = useState('pub');
  const [cfgAberto, setCfgAberto] = useState(false);
  const [editandoPost, setEditandoPost] = useState(null);
  const [postSelecionado, setPostSelecionado] = useState(null);
  const [postAcoes, setPostAcoes] = useState(null);
  const [textoEdicao, setTextoEdicao] = useState('');
  const {
    authUid,
    setAuthUid,
    logout,
    username: usernameCtx,
    setUsername,
    postsPerfil,
    atualizarPostPerfil,
    removerPostPerfil,
  } = useAppState();
  const [carregando, setCarregando] = useState(!!authUid);
  const [username, setUsernameLocal] = useState('Usuário');
  const [cidade, setCidade] = useState('');
  const [tags, setTags] = useState([]);

  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotoPerfilPendente, setFotoPerfilPendente] = useState(null);
  const [salvandoFoto, setSalvandoFoto] = useState(false);
  const [dataPost, setDataPost] = useState([]);
  const nomeExibido = usernameCtx !== 'Você' ? usernameCtx : username;
  const [seguidores, setSeguidores] = useState(0);
  const [seguindo, setSeguindo] = useState(0);
  const [listaSeguidores, setListaSeguidores] = useState([]);
  const [listaSeguindo, setListaSeguindo] = useState([]);
  const [postsCurtidos, setPostsCurtidos] = useState([]);

  useEffect(() => {
    let cancelado = false;

    async function carregarPerfil() {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/usuario/perfil/${encodeURIComponent(authUid)}`, {
        method: 'GET',
      });
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (cancelado) return;

      if (!res.ok) {
        Alert.alert(
          'Perfil',
          data?.messagem || data?.mensagem || 'Não foi possível carregar o perfil.',
        );
        return;
      }

      if (data?.username != null) {
        setUsernameLocal(data.username);
        setUsername(data.username);
      }
      if (data?.url) {
        setFotoPerfil(data.url);
      }
      if (data?.cidade != null) {
        setCidade(data.cidade);
      }
      if (Array.isArray(data?.tags)) {
        setTags(data.tags);
      }
      setSeguindo(data?.seguindo ?? 0);
      setSeguidores(data?.seguidores ?? 0);

      const [usuariosSeguidores, usuariosSeguindo, curtidos] = await Promise.all([
        buscarUsuariosPorIds(data?.seguidores_id),
        buscarUsuariosPorIds(data?.seguindo_id),
        buscarPostsPorIds(data?.likes_id),
      ]);

      if (cancelado) return;

      setListaSeguidores(usuariosSeguidores);
      setListaSeguindo(usuariosSeguindo);
      setPostsCurtidos(curtidos);
    }

    async function carregarPosts() {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/feed/post/${encodeURIComponent(authUid)}`, {
        method: 'GET',
      });
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (cancelado) return;
      if (!res.ok) return;

      const lista = Array.isArray(data) ? data : [];
      const data_post = lista.map((post, index) => ({
        id: post.id ?? `post-${index}`,
        url: post.url,
        descricao: post.descricao ?? '',
        dataCriacao: post.dataCriacao ?? '',
        likes: post.likes ?? 0,
        comentarios: post.comentarios ?? 0,
        editavel: true,
      }));
      setDataPost(data_post);
    }

    async function carregarTudo() {
      if (!authUid) {
        setCarregando(false);
        setDataPost([]);
        setListaSeguidores([]);
        setListaSeguindo([]);
        setPostsCurtidos([]);
        setSeguidores(0);
        setSeguindo(0);
        return;
      }

      setCarregando(true);
      try {
        await Promise.all([carregarPerfil(), carregarPosts()]);
      } catch {
        if (!cancelado) {
          Alert.alert('Perfil', 'Erro de rede ao carregar o perfil.');
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregarTudo();
    return () => {
      cancelado = true;
    };
  }, [authUid, setUsername]);

  const publicacoesExibidas = useMemo(() => {
    const idsApi = new Set(dataPost.map((p) => p.id));
    const locais = postsPerfil
      .filter((p) => !idsApi.has(p.id))
      .map((p) => ({ ...p, editavel: true }));
    return [...locais, ...dataPost];
  }, [dataPost, postsPerfil]);

  function irConfig(rota) {
    setCfgAberto(false);
    navigation.navigate(rota);
  }

  function confirmarLogout() {
    setCfgAberto(false);
    Alert.alert('Sair da conta', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logout();
          setAuthUid(null);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'TelaLogin' }],
            }),
          );
        },
      },
    ]);
  }

  async function selecionarFotoPerfil() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],   
      quality: 0.85,
    });
    if (!resultado.canceled && resultado.assets?.[0]?.uri) {
      setFotoPerfilPendente(resultado.assets[0].uri);
    }
  }

  function cancelarFotoPerfil() {
    setFotoPerfilPendente(null);
  }

  async function salvarFotoPerfil() {
    if (!fotoPerfilPendente || !authUid || salvandoFoto) return;

    setSalvandoFoto(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: fotoPerfilPendente,
        type: 'image/jpeg',
        name: 'perfil.jpg',
      });

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/usuario/perfil/${encodeURIComponent(authUid)}`,
        {
          method: 'PUT',
          body: formData,
        },
      );

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        Alert.alert(
          'Foto de perfil',
          data?.mensagem || data?.messagem || 'Não foi possível salvar a foto.',
        );
        return;
      }

      setFotoPerfil(data?.url ?? fotoPerfilPendente);
      setFotoPerfilPendente(null);
      Alert.alert('Foto de perfil', 'Foto atualizada com sucesso.');
    } catch (error) {
      console.error('Erro ao adicionar uma foto de perfil', error);
      Alert.alert('Foto de perfil', 'Erro de rede ao salvar a foto.');
    } finally {
      setSalvandoFoto(false);
    }
  }

  function abrirEdicao(post) {
    if (!post.editavel) return;
    setTextoEdicao(post.descricao ?? '');
    setEditandoPost(post);
  }

  function salvarEdicao() {
    if (!editandoPost) return;
    const descricao = textoEdicao.trim();
    atualizarPostPerfil(editandoPost.id, { descricao });
    setDataPost((prev) =>
      prev.map((p) => (p.id === editandoPost.id ? { ...p, descricao } : p)),
    );
    setEditandoPost(null);
    setTextoEdicao('');
  }

  function confirmarExclusao(post) {
    if (!post.editavel) return;
    Alert.alert('Excluir publicação', 'Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          removerPostPerfil(post.id);
          setDataPost((prev) => prev.filter((p) => p.id !== post.id));
        },
      },
    ]);
  }

  const handleLikeChange = useCallback((postId, { curtido, likes }, postRef) => {
    setDataPost((prev) => prev.map((p) => (p.id === postId ? { ...p, likes } : p)));
    atualizarPostPerfil(postId, { likes });
    setPostSelecionado((prev) => (prev?.id === postId ? { ...prev, likes } : prev));
    setPostsCurtidos((prev) => {
      if (curtido) {
        const existente = prev.find((p) => p.id === postId);
        if (existente) {
          return prev.map((p) => (p.id === postId ? { ...p, likes } : p));
        }
        if (!postRef) return prev;
        return [{ ...postRef, likes }, ...prev];
      }
      return prev.filter((p) => p.id !== postId);
    });
  }, [atualizarPostPerfil]);

  function renderCelulaGrid(post) {
    const ehPartida = post.tipo === 'partida';
    const temImagem = Boolean(post.url);

    return (
      <Pressable
        key={post.id}
        style={styles.usuarioFeedCell}
        onPress={() => setPostSelecionado(post)}
        onLongPress={() => setPostAcoes(post)}
        delayLongPress={450}
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

  function fecharAcoesPost() {
    setPostAcoes(null);
  }

  function fecharDetalhe() {
    setPostSelecionado(null);
  }

  return (
    <ScreenSafe style={styles.usuarioScreen}>
      <ScrollView>
        <View style={styles.usuarioTopRow}>
          <TouchableOpacity style={styles.usuarioIconBtn} onPress={() => setCfgAberto(true)}>
            <Ionicons name="menu" size={24} color={colors.purple} />
          </TouchableOpacity>
        </View>

        <View style={styles.usuarioAvatarWrap}>
          <View>
            <View style={styles.usuarioAvatar}>
              {fotoPerfilPendente || fotoPerfil ? (
                <Image
                  source={{ uri: fotoPerfilPendente ?? fotoPerfil }}
                  style={styles.usuarioAvatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="paw" size={52} color={colors.purple} />
              )}
            </View>
            <TouchableOpacity style={styles.usuarioEditBadge} onPress={selecionarFotoPerfil}>
              <Ionicons name="pencil" size={16} color={colors.purple} />
            </TouchableOpacity>
          </View>
        </View>

        {fotoPerfilPendente ? (
          <View style={styles.usuarioFotoAcoesRow}>
            <TouchableOpacity
              style={styles.usuarioFotoSalvarBtn}
              onPress={salvarFotoPerfil}
              disabled={salvandoFoto}
              activeOpacity={0.8}
            >
              {salvandoFoto ? (
                <ActivityIndicator size="small" color={colors.textOnPurple} />
              ) : (
                <Text style={styles.usuarioFotoSalvarBtnText}>Salvar foto</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.usuarioFotoCancelarBtn}
              onPress={cancelarFotoPerfil}
              disabled={salvandoFoto}
              activeOpacity={0.8}
            >
              <Text style={styles.usuarioFotoCancelarBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <Text style={styles.usuarioName}>{carregando ? 'Carregando...' : nomeExibido}</Text>
        {cidade ? (
          <View style={styles.usuarioLocationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.usuarioLocationText, { marginLeft: 4 }]}>{cidade}</Text>
          </View>
        ) : null}

        {tags.length > 0 ? (
          <View style={styles.usuarioTagsRow}>
            {tags.map((t) => (
              <View key={t} style={styles.usuarioTagPill}>
                <Text style={styles.usuarioTagText}>{t}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.usuarioStatsRow}>
          <TouchableOpacity
            style={styles.usuarioStatBlockPressable}
            activeOpacity={0.75}
            onPress={() =>
              navigation.navigate('TelaListaConexoes', {
                tipo: 'seguidores',
                lista: listaSeguidores,
              })
            }
          >
            <Text style={styles.usuarioStatValue}>{seguidores}</Text>
            <Text style={styles.usuarioStatLabel}>Seguidores</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.usuarioStatBlockPressable}
            activeOpacity={0.75}
            onPress={() =>
              navigation.navigate('TelaListaConexoes', {
                tipo: 'seguindo',
                lista: listaSeguindo,
              })
            }
          >
            <Text style={styles.usuarioStatValue}>{seguindo}</Text>
            <Text style={styles.usuarioStatLabel}>Seguindo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.usuarioTrophyBox}>
          <Ionicons name="trophy" size={40} color={colors.purple} />
          <Text style={styles.usuarioTrophyLabel}>Troféus Sportfind</Text>
        </View>

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
            publicacoesExibidas.length > 0 ? (
              <>
                <View style={styles.usuarioFeedGrid}>
                  {publicacoesExibidas.map(renderCelulaGrid)}
                </View>
                <Text style={styles.usuarioFeedCaption}>
                  Toque para abrir · segure para editar ou excluir.
                </Text>
              </>
            ) : (
              <View style={styles.usuarioEmptyTab}>
                <Ionicons name="images-outline" size={36} color={colors.purpleLight} />
                <Text style={styles.usuarioEmptyTabText}>Nenhuma publicação ainda.</Text>
              </View>
            )
          ) : aba === 'liked' ? (
            postsCurtidos.length > 0 ? (
              <>
                <View style={styles.usuarioFeedGrid}>
                  {postsCurtidos.map(renderCelulaGrid)}
                </View>
                <Text style={styles.usuarioFeedCaption}>Toque para abrir o post curtido.</Text>
              </>
            ) : (
              <View style={styles.usuarioEmptyTab}>
                <Ionicons name="heart-outline" size={36} color={colors.purpleLight} />
                <Text style={styles.usuarioEmptyTabText}>Nenhum post curtido ainda.</Text>
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

      <Modal visible={cfgAberto} transparent animationType="fade" onRequestClose={() => setCfgAberto(false)}>
        <View style={styles.perfilModalRoot}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.perfilModalBackdrop}
            onPress={() => setCfgAberto(false)}
          />
          <View style={styles.perfilModalCard}>
            <Text style={styles.perfilModalTitle}>Configurações e preferências</Text>
            <Text style={styles.perfilModalSubtitle}>Escolha uma opção abaixo.</Text>

            <TouchableOpacity style={styles.perfilModalRow} onPress={() => irConfig('TelaConta')} activeOpacity={0.8}>
              <Text style={styles.perfilModalRowTitle}>Conta</Text>
              <Text style={styles.perfilModalRowHint}>Dados cadastrados, senha e exclusão</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.perfilModalRow}
              onPress={() => irConfig('TelaPreferencias')}
              activeOpacity={0.8}
            >
              <Text style={styles.perfilModalRowTitle}>Preferências</Text>
              <Text style={styles.perfilModalRowHint}>Notificações e tema</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.perfilModalRow}
              onPress={() => irConfig('TelaPrivacidade')}
              activeOpacity={0.8}
            >
              <Text style={styles.perfilModalRowTitle}>Privacidade</Text>
              <Text style={styles.perfilModalRowHint}>Política, termos e LGPD</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.perfilModalLogoutRow}
              onPress={confirmarLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.perfilModalLogoutTitle}>Sair da conta</Text>
              <Text style={styles.perfilModalLogoutHint}>Encerrar sessão neste dispositivo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.perfilModalCloseBtn} onPress={() => setCfgAberto(false)}>
              <Text style={styles.perfilModalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <PerfilPostAcoesSheet
        visible={postAcoes != null}
        onClose={fecharAcoesPost}
        onEdit={() => {
          const p = postAcoes;
          fecharAcoesPost();
          if (p) abrirEdicao(p);
        }}
        onDelete={() => {
          const p = postAcoes;
          fecharAcoesPost();
          if (p) confirmarExclusao(p);
        }}
      />

      <PerfilPostModal
        visible={postSelecionado != null}
        post={postSelecionado}
        username={nomeExibido}
        isOwnProfile
        onClose={fecharDetalhe}
        onEdit={(p) => {
          fecharDetalhe();
          abrirEdicao(p);
        }}
        onDelete={(p) => {
          fecharDetalhe();
          confirmarExclusao(p);
        }}
        onLongPressPost={(p) => {
          fecharDetalhe();
          setPostAcoes(p);
        }}
        onLikeChange={handleLikeChange}
      />

      <Modal
        visible={editandoPost != null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditandoPost(null)}
      >
        <View style={styles.perfilModalRoot}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.perfilModalBackdrop}
            onPress={() => setEditandoPost(null)}
          />
          <View style={styles.perfilModalCard}>
            <Text style={styles.perfilModalTitle}>Editar publicação</Text>
            <TextInput
              style={styles.createLocalInput}
              placeholder="Descrição da publicação"
              placeholderTextColor={colors.textSecondary}
              value={textoEdicao}
              onChangeText={setTextoEdicao}
              multiline
            />
            <TouchableOpacity style={styles.perfilModalCloseBtn} onPress={salvarEdicao}>
              <Text style={styles.perfilModalCloseText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: spacing.sm, alignSelf: 'center' }}
              onPress={() => setEditandoPost(null)}
            >
              <Text style={{ color: colors.textSecondary }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenSafe>
  );
}
