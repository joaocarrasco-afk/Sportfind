import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import styles from '../../style';
import { colors } from '../../style/tokens';
import { rotuloEsporte } from '../domain/feed/posts';
import { useComentarios } from '../hooks/useComentarios';
import { useAppState } from '../state/AppStateContext';
import ComentariosLista, { ComentarioInputBar } from './ComentariosLista';

const MAX_COMENTARIOS_MOBILE = 3;

function montarLegenda(post) {
  if (!post) return '';
  if (post.tipo === 'partida') {
    const linhas = [
      post.nomePartida,
      `${rotuloEsporte(post.esporte)} · ${post.horario ?? ''}`,
      post.descricao,
    ].filter(Boolean);
    return linhas.join('\n');
  }
  return post.descricao ?? '';
}

function BlocoLegenda({ username, legenda }) {
  if (!legenda) return null;
  return (
    <View style={styles.instaPostLegendaRow}>
      <View style={styles.instaPostComentarioAvatar}>
        <Ionicons name="person" size={14} color={colors.purple} />
      </View>
      <Text style={styles.instaPostComentarioTexto}>
        <Text style={styles.instaPostComentarioAutor}>{username} </Text>
        {legenda}
      </Text>
    </View>
  );
}

export default function PerfilPostModal({
  visible,
  post,
  username = 'você',
  isOwnProfile = true,
  onClose,
  onEdit,
  onDelete,
  onLongPressPost,
}) {
  const { authUid } = useAppState();
  const { width, height } = useWindowDimensions();
  const layoutLadoALado = width >= 720;
  const isMobile = !layoutLadoALado;

  const [menuAberto, setMenuAberto] = useState(false);
  const [curtido, setCurtido] = useState(false);
  const [curtidas, setCurtidas] = useState(24);
  const [salvo, setSalvo] = useState(false);
  const [mostrarTodosComentarios, setMostrarTodosComentarios] = useState(false);

  const {
    lista,
    total: totalComentarios,
    carregando,
    enviando,
    respondendoA,
    setRespondendoA,
    limparResposta,
    editando,
    texto,
    setTexto,
    textoEdicao,
    setTextoEdicao,
    enviar,
    salvarEdicao,
    cancelarEdicao,
    opcoesComentario,
  } = useComentarios(post?.id, {
    userId: authUid,
    username,
    enabled: visible && !!post?.id,
    contagemInicial: post?.comentarios ?? 0,
  });

  const legenda = useMemo(() => montarLegenda(post), [post]);
  const maxVisiveis =
    isMobile && !mostrarTodosComentarios ? MAX_COMENTARIOS_MOBILE : undefined;

  const cardHeight = Math.min(height * 0.92, layoutLadoALado ? 580 : height * 0.9);
  const ladoWidth = layoutLadoALado ? Math.min(360, width * 0.38) : width;
  const larguraImagemMobile = width * 0.95;

  useEffect(() => {
    if (!visible) {
      setMenuAberto(false);
      setMostrarTodosComentarios(false);
      return;
    }
    setCurtido(false);
    setCurtidas(post?.likes ?? 12 + (post?.id?.length ?? 0) * 3);
    setSalvo(false);
  }, [visible, post?.id, post?.likes]);

  if (!post) return null;

  function fecharMenu() {
    setMenuAberto(false);
  }

  function acaoMenu(tipo) {
    fecharMenu();
    if (tipo === 'editar') onEdit?.(post);
    if (tipo === 'excluir') onDelete?.(post);
  }

  const header = (
    <View style={styles.instaPostHeader}>
      <View style={styles.instaPostHeaderUser}>
        <View style={styles.instaPostHeaderAvatar}>
          <Ionicons name="person" size={18} color={colors.purple} />
        </View>
        <Text style={styles.instaPostHeaderNome} numberOfLines={1}>
          {username}
        </Text>
      </View>
      <View style={styles.instaPostHeaderMenuWrap}>
        <TouchableOpacity onPress={() => setMenuAberto((v) => !v)} hitSlop={12}>
          <Ionicons name="ellipsis-horizontal" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        {menuAberto && isOwnProfile ? (
          <View style={styles.instaPostMenuDropdown}>
            <TouchableOpacity style={styles.instaPostMenuItem} onPress={() => acaoMenu('editar')}>
              <Text style={styles.instaPostMenuItemText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.instaPostMenuItem} onPress={() => acaoMenu('excluir')}>
              <Text style={[styles.instaPostMenuItemText, styles.instaPostMenuItemDanger]}>
                Excluir
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.instaPostMenuItem, styles.instaPostMenuItemLast]}
              onPress={fecharMenu}
            >
              <Text style={styles.instaPostMenuItemText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );

  const footer = (
    <View style={styles.instaPostFooter}>
      <View style={styles.instaPostAcoes}>
        <TouchableOpacity
          onPress={() => {
            setCurtido((v) => {
              setCurtidas((n) => (v ? n - 1 : n + 1));
              return !v;
            });
          }}
          hitSlop={8}
        >
          <Ionicons
            name={curtido ? 'heart' : 'heart-outline'}
            size={24}
            color={curtido ? '#ed4956' : colors.textPrimary}
          />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={8}>
          <Ionicons name="chatbubble-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={8}>
          <Ionicons name="paper-plane-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => setSalvo((v) => !v)} hitSlop={8}>
          <Ionicons
            name={salvo ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.instaPostCurtidas}>
        {curtidas} curtida{curtidas !== 1 ? 's' : ''}
      </Text>
      {totalComentarios > 0 ? (
        <Text style={styles.instaPostData}>
          {totalComentarios} comentário{totalComentarios !== 1 ? 's' : ''}
        </Text>
      ) : null}
      <Text style={styles.instaPostData}>{post.dataCriacao}</Text>

      <ComentarioInputBar
        variant="perfil"
        texto={texto}
        onChangeText={setTexto}
        onEnviar={enviar}
        enviando={enviando}
        respondendoA={respondendoA}
        onCancelarResposta={limparResposta}
        placeholder="Adicione um comentário..."
      />
    </View>
  );

  const mediaInner = post.url ? (
    <Image
      source={{ uri: post.url }}
      style={[styles.instaPostMediaImage, StyleSheet.absoluteFillObject]}
      resizeMode="cover"
    />
  ) : (
    <View style={[StyleSheet.absoluteFillObject, styles.instaPostMediaPlaceholder]}>
      <Ionicons
        name={post.tipo === 'partida' ? 'football' : 'image-outline'}
        size={72}
        color={colors.purple}
      />
    </View>
  );

  const mediaStyle = [
    styles.instaPostMedia,
    isMobile && styles.instaPostMediaMobile,
    isMobile && { width: larguraImagemMobile, height: larguraImagemMobile },
    layoutLadoALado && { height: cardHeight, minWidth: 280 },
  ];

  const media =
    isOwnProfile && onLongPressPost ? (
      <Pressable
        style={mediaStyle}
        onLongPress={() => onLongPressPost(post)}
        delayLongPress={450}
      >
        {mediaInner}
      </Pressable>
    ) : (
      <View style={mediaStyle}>{mediaInner}</View>
    );

  const conteudoTexto = (
    <>
      <BlocoLegenda username={username} legenda={legenda} />
      <ComentariosLista
        lista={lista}
        carregando={carregando}
        variant="perfil"
        userId={authUid}
        editando={editando}
        textoEdicao={textoEdicao}
        onChangeTextoEdicao={setTextoEdicao}
        onSalvarEdicao={salvarEdicao}
        onCancelarEdicao={cancelarEdicao}
        onResponder={setRespondendoA}
        onOpcoes={opcoesComentario}
        maxVisiveis={maxVisiveis}
      />
      {isMobile && lista.length > MAX_COMENTARIOS_MOBILE && !mostrarTodosComentarios ? (
        <TouchableOpacity onPress={() => setMostrarTodosComentarios(true)}>
          <Text style={styles.instaPostVerMaisComentarios}>
            Ver todos os {totalComentarios} comentários
          </Text>
        </TouchableOpacity>
      ) : null}
    </>
  );

  const painelDesktop = (
    <View style={[styles.instaPostPainel, { width: ladoWidth, height: cardHeight }]}>
      {header}
      <ScrollView
        style={styles.instaPostComentariosScroll}
        contentContainerStyle={styles.instaPostComentariosContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {conteudoTexto}
      </ScrollView>
      {footer}
    </View>
  );

  const painelMobile = (
    <View style={[styles.instaPostPainel, styles.instaPostPainelMobile, { width: larguraImagemMobile }]}>
      {header}
      <View style={styles.instaPostComentariosContent}>{conteudoTexto}</View>
      {footer}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.instaPostOverlay}>
        <Pressable style={styles.instaPostBackdrop} onPress={onClose} />
        <TouchableOpacity
          style={styles.instaPostCloseBtn}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={28} color={colors.white} />
        </TouchableOpacity>

        <ScrollView
          style={isMobile ? styles.instaPostScrollMobile : undefined}
          contentContainerStyle={isMobile ? styles.instaPostScrollMobileContent : undefined}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.instaPostCard,
              {
                flexDirection: layoutLadoALado ? 'row' : 'column',
                maxWidth: layoutLadoALado ? width * 0.92 : larguraImagemMobile,
                width: layoutLadoALado ? undefined : larguraImagemMobile,
              },
            ]}
          >
            {media}
            {isMobile ? painelMobile : painelDesktop}
          </View>
        </ScrollView>

        {menuAberto ? (
          <Pressable style={styles.instaPostMenuBackdrop} onPress={fecharMenu} />
        ) : null}
      </View>
    </Modal>
  );
}
