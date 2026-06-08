import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../../style';
import { colors, spacing } from '../../style/tokens';
import { emojiEsporte, rotuloEsporte } from '../domain/feed/posts';
import { useComentarios } from '../hooks/useComentarios';
import { useAppState } from '../state/AppStateContext';
import ComentariosLista, { ComentarioInputBar } from './ComentariosLista';

function rotuloTipo(tipo) {
  return tipo === 'Tenis' ? 'Tênis' : tipo;
}

function rotuloAcesso(acesso) {
  return acesso === 'Publico' ? 'Público' : acesso;
}

export default function FeedPostCard({
  item,
  onOcultar,
  seguindo = false,
  onSeguir,
  onPressAutor,
  onParticipar,
  onDesistir,
  onPressPartida,
  onLikeChange,
}) {
  const { authUid, username, curtidos, alternarCurtida } = useAppState();
  const curtido = curtidos.has(item.id);
  const [likes, setLikes] = useState(item.likes ?? 0);
  const [comentariosAberto, setComentariosAberto] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [curtidas, setCurtidas] = useState(item.likes ?? 0);


  const {
    lista,
    total: comentarios,
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
  } = useComentarios(item.id, {
    userId: authUid,
    username,
    enabled: comentariosAberto,
    contagemInicial: item.comentarios ?? 0,
  });

  const participando = authUid
    ? item.participantes?.includes(authUid)
    : item.participantes?.includes('voce');
  const totalParticipantes = item.participantes?.length ?? 0;
  const maxParticipantes = item.maxParticipantes;
  const vagasCheias =
    maxParticipantes != null && totalParticipantes >= maxParticipantes && !participando;

  const autor = item.username ?? 'Usuário';
  const ehProprioPost = Boolean(item.userId && authUid && item.userId === authUid);
  const mostrarSeguir = Boolean(onSeguir && authUid && autor !== 'Você' && !ehProprioPost);

  useEffect(() => {
    setLikes(item.likes ?? 0);
  }, [item.likes, item.id]);

  async function alternarCurtidaPost() {


    const eraCurtido = curtidos.has(item.id);
    const resultado = await alternarCurtida(item.id);
    if (!resultado.ok) return;

    const novosLikes = eraCurtido ? Math.max(0, curtidas - 1) : curtidas + 1;
    setCurtidas(novosLikes);
    onLikeChange?.(item.id, { curtido: resultado.curtido, likes: novosLikes }, post);
  }

  async function compartilhar() {
    const titulo = item.username ?? 'Sportfind';
    let mensagem = item.descricao ?? '';
    if (item.kind === 'partida') {
      mensagem = `${item.nomePartida} — ${rotuloEsporte(item.esporte)} em ${item.local?.name ?? 'local'} (${item.horario})`;
    } else if (item.local) {
      mensagem = `Confira ${item.local.name} no Sportfind!`;
    } else {
      mensagem = mensagem || 'Veja no Sportfind!';
    }
    try {
      await Share.share({
        message: `${titulo}: ${mensagem}`,
        title: 'Sportfind',
      });
    } catch {
      /* usuário cancelou */
    }
  }

  function acaoMenu(acao) {
    setMenuAberto(false);
    if (acao === 'ocultar') {
      onOcultar?.(item.id);
      return;
    }
    Alert.alert('Sportfind', `Ação "${acao}" em breve.`);
  }

  function acaoParticipar() {
    if (participando) {
      onDesistir?.(item.id);
      return;
    }
    if (vagasCheias) {
      Alert.alert('Partida cheia', 'Não há mais vagas para esta partida.');
      return;
    }
    onParticipar?.(item.id);
  }

  return (
    <View style={styles.feedCard}>
      <View style={styles.feedCardHeader}>
        <View style={styles.feedCardAvatar}>
          {item.url_perfil ? (
            <Image
              source={{ uri: item.url_perfil }}
              style={styles.feedCardAvatarImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={22} color={colors.purple} />
          )}
        </View>
        <View style={styles.feedCardHeaderMain}>
          <View style={styles.feedCardHeaderRow}>
            <TouchableOpacity
              onPress={() => onPressAutor?.(autor)}
              disabled={!onPressAutor}
              activeOpacity={0.7}
              style={{ flexShrink: 1 }}
            >
              <Text
                style={[
                  styles.feedCardAuthor,
                  onPressAutor && styles.feedCardAuthorLink,
                ]}
                numberOfLines={1}
              >
                {autor}
              </Text>
            </TouchableOpacity>
            {mostrarSeguir ? (
              <TouchableOpacity
                style={[styles.feedFollowBtn, seguindo && styles.feedFollowBtnActive]}
                onPress={() => onSeguir?.({ userId: item.userId, username: autor })}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.feedFollowBtnText,
                    seguindo && styles.feedFollowBtnTextActive,
                  ]}
                >
                  {seguindo ? 'Seguindo' : 'Seguir'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <Text style={styles.feedCardTime}>{item.dataCriacao ?? ''}</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuAberto(true)} hitSlop={8}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {item.kind === 'partida' ? (
        <>
          <TouchableOpacity
            style={styles.feedPartidaCard}
            onPress={() => onPressPartida?.(item.id)}
            activeOpacity={0.85}
          >
            <Text style={styles.feedPartidaTitle}>{item.nomePartida}</Text>
            <View style={styles.feedPartidaMetaRow}>
              <Text style={{ fontSize: 18 }}>{emojiEsporte(item.esporte)}</Text>
              <Text style={styles.feedPartidaMetaText}>
                {rotuloEsporte(item.esporte)} • {item.horario}
              </Text>
            </View>
            {item.local ? (
              <View style={styles.feedPartidaLocalRow}>
                <Text style={{ fontSize: 16 }}>{item.local.emoji ?? '📍'}</Text>
                <Text style={styles.feedPartidaMetaText} numberOfLines={2}>
                  {item.local.name}
                  {item.local.address ? ` — ${item.local.address}` : ''}
                </Text>
              </View>
            ) : null}
            {maxParticipantes != null ? (
              <Text style={styles.feedPartidaVagas}>
                {totalParticipantes}/{maxParticipantes} participantes
              </Text>
            ) : null}
          </TouchableOpacity>
          {!ehProprioPost ? (
            <TouchableOpacity
              style={[
                styles.feedPartidaParticiparBtn,
                participando && styles.feedPartidaParticiparBtnOutline,
                vagasCheias && !participando && { opacity: 0.45 },
              ]}
              onPress={acaoParticipar}
              disabled={vagasCheias && !participando}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.feedPartidaParticiparText,
                  participando && styles.feedPartidaParticiparTextOutline,
                ]}
              >
                {participando ? 'Participando ✓' : 'Participar'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </>
      ) : (
        <>
          {item.descricao ? (
            <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.sm }}>
              <Text style={styles.feedCardCaptionPlaceholderText}>{item.descricao}</Text>
            </View>
          ) : null}

          {item.kind === 'local' && item.local ? (
            <Image
              source={{ uri: item.local.image }}
              style={styles.feedCardImage}
              resizeMode="cover"
            />
          ) : item.url ? (
            <Image source={{ uri: item.url }} style={styles.feedCardImage} resizeMode="cover" />
          ) : null}

          <View style={styles.feedCardBody}>
            {item.kind === 'local' && item.local ? (
              <>
                <View style={styles.feedCardPlaceRow}>
                  <Text style={styles.feedCardPlaceEmoji}>{item.local.emoji}</Text>
                  <Text style={styles.feedCardPlaceName}>{item.local.name}</Text>
                </View>
                <Text style={styles.feedCardBodyText}>
                  {rotuloTipo(item.local.type)} • {item.local.distance} •{' '}
                  {rotuloAcesso(item.local.access)}
                </Text>
              </>
            ) : null}
          </View>
        </>
      )}

      <View style={styles.feedCardActions}>
        <TouchableOpacity style={styles.feedActionBtn} activeOpacity={0.7} onPress={alternarCurtidaPost}>
          <Ionicons
            name={curtido ? 'heart' : 'heart-outline'}
            size={18}
            color={curtido ? colors.purple : colors.purple}
          />
          <Text style={curtido ? styles.feedActionLabelActive : styles.feedActionLabel}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.feedActionBtn}
          activeOpacity={0.7}
          onPress={() => setComentariosAberto(true)}
        >
          <Ionicons name="chatbubble-outline" size={18} color={colors.purple} />
          <Text style={styles.feedActionLabel}>{comentarios}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.feedActionBtn} activeOpacity={0.7} onPress={compartilhar}>
          <Ionicons name="share-outline" size={18} color={colors.purple} />
          <Text style={styles.feedActionLabel}>Compartilhar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={comentariosAberto}
        transparent
        animationType="slide"
        onRequestClose={() => setComentariosAberto(false)}
      >
        <View style={styles.feedModalRoot}>
          <TouchableOpacity
            style={styles.feedModalBackdrop}
            activeOpacity={1}
            onPress={() => setComentariosAberto(false)}
          />
          <View style={styles.feedModalSheet}>
            <View style={styles.feedModalHandle} />
            <Text style={styles.feedModalTitle}>Comentários</Text>
            <ScrollView style={styles.feedCommentList} keyboardShouldPersistTaps="handled">
              <ComentariosLista
                lista={lista}
                carregando={carregando}
                variant="feed"
                userId={authUid}
                editando={editando}
                textoEdicao={textoEdicao}
                onChangeTextoEdicao={setTextoEdicao}
                onSalvarEdicao={salvarEdicao}
                onCancelarEdicao={cancelarEdicao}
                onResponder={setRespondendoA}
                onOpcoes={opcoesComentario}
              />
            </ScrollView>
            <ComentarioInputBar
              variant="feed"
              texto={texto}
              onChangeText={setTexto}
              onEnviar={enviar}
              enviando={enviando}
              respondendoA={respondendoA}
              onCancelarResposta={limparResposta}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={menuAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuAberto(false)}
      >
        <View style={styles.feedModalRoot}>
          <TouchableOpacity
            style={styles.feedModalBackdrop}
            activeOpacity={1}
            onPress={() => setMenuAberto(false)}
          />
          <View style={[styles.feedModalSheet, { borderRadius: 16, margin: spacing.lg }]}>
            <Text style={styles.feedModalTitle}>Opções</Text>
            <TouchableOpacity style={styles.feedMenuOption} onPress={() => acaoMenu('salvar')}>
              <Text style={styles.feedMenuOptionText}>Salvar publicação</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.feedMenuOption} onPress={() => acaoMenu('denunciar')}>
              <Text style={[styles.feedMenuOptionText, styles.feedMenuOptionDanger]}>
                Denunciar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.feedMenuOption} onPress={() => acaoMenu('ocultar')}>
              <Text style={styles.feedMenuOptionText}>Ocultar do feed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.feedMenuOption, { borderBottomWidth: 0 }]}
              onPress={() => setMenuAberto(false)}
            >
              <Text style={[styles.feedMenuOptionText, { color: colors.purple, fontWeight: '600' }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
