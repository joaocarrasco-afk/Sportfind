import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useState, useEffect, useMemo } from 'react';
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
import { contagemConexoesAtual } from '../domain/users';
import * as ImagePicker from 'expo-image-picker';


const ABAS = [
  { id: 'pub', label: 'Publicações' },
  { id: 'trophy', label: 'Troféus' },
  { id: 'liked', label: 'Curtidos' },
];



const IMAGENS_DEMO = [
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551958219-ac0fb825e0f7?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
];

const DEMO_PUBLICACOES = [
  ...IMAGENS_DEMO.slice(0, 6).map((url, i) => ({
    id: `demo-pub-${i + 1}`,
    tipo: 'imagem',
    url,
    descricao: ['Treino na quadra', 'Pelada de sábado', 'Corrida no parque', 'Basquete com a galera', 'Skate no fim de tarde', 'Futebol no campinho'][i],
    dataCriacao: `Há ${i + 1} dia${i > 0 ? 's' : ''}`,
    editavel: false,
  })),
  {
    id: 'demo-pub-7',
    tipo: 'partida',
    url: IMAGENS_DEMO[6],
    nomePartida: 'Pelada do bairro',
    esporte: 'Futebol',
    horario: 'Sáb., 10:00',
    descricao: 'Partida aberta — venha jogar!',
    dataCriacao: 'Há 1 semana',
    editavel: false,
  },
  {
    id: 'demo-pub-8',
    tipo: 'imagem',
    url: IMAGENS_DEMO[7],
    descricao: 'Melhor jogo da semana!',
    dataCriacao: 'Há 2 semanas',
    editavel: false,
  },
  {
    id: 'demo-pub-9',
    tipo: 'partida',
    nomePartida: 'Treino de tênis',
    esporte: 'Tenis',
    horario: 'Dom., 08:00',
    descricao: 'Vagas limitadas',
    dataCriacao: 'Há 3 semanas',
    editavel: false,
  },
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
  const [username, setUsernameLocal] = useState('Explorador Sportfind');

  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotoPerfilPendente, setFotoPerfilPendente] = useState(null);
  const [salvandoFoto, setSalvandoFoto] = useState(false);
  const nomeExibido = usernameCtx !== 'Você' ? usernameCtx : username;
  const { seguidores: totalSeguidores, seguindo: totalSeguindo } = contagemConexoesAtual();

  useEffect(() => {
    let cancelado = false;

    async function carregarPerfil() {
      if (!authUid) {
        setCarregando(false);
        return;
      }

      setCarregando(true);
      try {
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
      } catch {
        if (!cancelado) {
          Alert.alert('Perfil', 'Erro de rede ao carregar o perfil.');
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregarPerfil();
    return () => {
      cancelado = true;
    };
  }, [authUid, setUsername]);

  const publicacoesExibidas = useMemo(() => {
    const proprias = postsPerfil.map((p) => ({ ...p, editavel: true }));
    if (proprias.length > 0) return proprias;
    return DEMO_PUBLICACOES;
  }, [postsPerfil]);

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
      aspect: [1, 1],   // quadrado — ideal para avatar
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
    if (!post.editavel) {
      Alert.alert('Demonstração', 'Este é um exemplo fixo. Suas publicações reais podem ser editadas.');
      return;
    }
    setTextoEdicao(post.descricao ?? '');
    setEditandoPost(post);
  }

  function salvarEdicao() {
    if (!editandoPost) return;
    atualizarPostPerfil(editandoPost.id, { descricao: textoEdicao });
    setEditandoPost(null);
    setTextoEdicao('');
  }

  function confirmarExclusao(post) {
    if (!post.editavel) {
      Alert.alert('Demonstração', 'Este é um exemplo fixo. Suas publicações reais podem ser excluídas.');
      return;
    }
    Alert.alert('Excluir publicação', 'Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => removerPostPerfil(post.id),
      },
    ]);
  }

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
        <View style={styles.usuarioLocationRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.usuarioLocationText, { marginLeft: 4 }]}>São Paulo, Brasil</Text>
        </View>

        <View style={styles.usuarioTagsRow}>
          {['Skate', 'Basquete', 'Futebol'].map((t) => (
            <View key={t} style={styles.usuarioTagPill}>
              <Text style={styles.usuarioTagText}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={styles.usuarioStatsRow}>
          <TouchableOpacity
            style={styles.usuarioStatBlockPressable}
            activeOpacity={0.75}
            onPress={() => navigation.navigate('TelaListaConexoes', { tipo: 'seguidores' })}
          >
            <Text style={styles.usuarioStatValue}>{totalSeguidores}</Text>
            <Text style={styles.usuarioStatLabel}>Seguidores</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.usuarioStatBlockPressable}
            activeOpacity={0.75}
            onPress={() => navigation.navigate('TelaListaConexoes', { tipo: 'seguindo' })}
          >
            <Text style={styles.usuarioStatValue}>{totalSeguindo}</Text>
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
            <>
              <View style={styles.usuarioFeedGrid}>
                {publicacoesExibidas.map(renderCelulaGrid)}
              </View>
              <Text style={styles.usuarioFeedCaption}>
                {postsPerfil.length > 0
                  ? 'Toque para abrir · segure para editar ou excluir.'
                  : 'Toque para ver · segure o post para editar ou excluir.'}
              </Text>
            </>
          ) : (
            <View style={styles.usuarioEmptyTab}>
              <Ionicons
                name={aba === 'trophy' ? 'trophy-outline' : 'heart-outline'}
                size={36}
                color={colors.purpleLight}
              />
              <Text style={styles.usuarioEmptyTabText}>
                {aba === 'trophy' ? 'Troféus aparecerão aqui.' : 'Posts curtidos aparecerão aqui.'}
              </Text>
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
