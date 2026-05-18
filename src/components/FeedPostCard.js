import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../../style';
import { colors, spacing } from '../../style/tokens';

const COMENTARIOS_DEMO = [
  { id: 'c1', autor: 'Marina', texto: 'Bora marcar um jogo!' },
  { id: 'c2', autor: 'João', texto: 'Esse lugar é incrível.' },
];

function rotuloTipo(tipo) {
  return tipo === 'Tenis' ? 'Tênis' : tipo;
}

function rotuloAcesso(acesso) {
  return acesso === 'Publico' ? 'Público' : acesso;
}

export default function FeedPostCard({ item, onOcultar }) {
  const [curtido, setCurtido] = useState(false);
  const [likes, setLikes] = useState(item.likes ?? 0);
  const [comentarios, setComentarios] = useState(item.comentarios ?? 0);
  const [listaComentarios, setListaComentarios] = useState(COMENTARIOS_DEMO);
  const [comentariosAberto, setComentariosAberto] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [textoComentario, setTextoComentario] = useState('');

  function alternarCurtida() {
    setCurtido((prev) => {
      setLikes((n) => (prev ? n - 1 : n + 1));
      return !prev;
    });
  }

  function enviarComentario() {
    const texto = textoComentario.trim();
    if (!texto) return;
    setListaComentarios((prev) => [
      ...prev,
      { id: `c-${Date.now()}`, autor: 'Você', texto },
    ]);
    setComentarios((n) => n + 1);
    setTextoComentario('');
  }

  async function compartilhar() {
    const titulo = item.username ?? 'Sportfind';
    const mensagem =
      item.descricao ??
      (item.local ? `Confira ${item.local.name} no Sportfind!` : 'Veja no Sportfind!');
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

  return (
    <View style={styles.feedCard}>
      <View style={styles.feedCardHeader}>
        <View style={styles.feedCardAvatar}>
          <Ionicons name="person" size={22} color={colors.purple} />
        </View>
        <View style={styles.feedCardHeaderMain}>
          <Text style={styles.feedCardAuthor}>{item.username ?? 'Usuário'}</Text>
          <Text style={styles.feedCardTime}>{item.dataCriacao ?? ''}</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuAberto(true)} hitSlop={8}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {item.descricao ? (
        <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.sm }}>
          <Text style={styles.feedCardCaptionPlaceholderText}>{item.descricao}</Text>
        </View>
      ) : null}

      {item.kind === 'local' && item.local ? (
        <Image source={{ uri: item.local.image }} style={styles.feedCardImage} resizeMode="cover" />
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

      <View style={styles.feedCardActions}>
        <TouchableOpacity style={styles.feedActionBtn} activeOpacity={0.7} onPress={alternarCurtida}>
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
              {listaComentarios.map((c) => (
                <View key={c.id} style={styles.feedCommentItem}>
                  <View style={styles.feedCommentAvatar}>
                    <Ionicons name="person" size={16} color={colors.purple} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.feedCommentAuthor}>{c.autor}</Text>
                    <Text style={styles.feedCommentText}>{c.texto}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={styles.feedCommentInputRow}>
              <TextInput
                style={styles.feedCommentInput}
                placeholder="Escreva um comentário..."
                placeholderTextColor={colors.textSecondary}
                value={textoComentario}
                onChangeText={setTextoComentario}
                onSubmitEditing={enviarComentario}
                returnKeyType="send"
              />
              <TouchableOpacity style={styles.feedCommentSendBtn} onPress={enviarComentario}>
                <Ionicons name="send" size={18} color={colors.textOnPurple} />
              </TouchableOpacity>
            </View>
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
