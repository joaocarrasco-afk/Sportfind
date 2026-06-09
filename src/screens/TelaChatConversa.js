import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthKeyboardScreen from '../components/AuthKeyboardScreen';
import { abrirPerfilUsuario } from '../navigation/perfilNavigation';
import { useAppState } from '../state/AppStateContext';
import { enviarMensagem, escutarMensagens, formatarHoraMensagem, carregarPerfilUsuario } from '../utils/chatApi';
import styles from '../../style';
import { colors } from '../../style/tokens';

export default function TelaChatConversa() {
  const navigation = useNavigation();
  const route = useRoute();
  const { conversaId, nome, userId, url: urlInicial } = route.params ?? {};
  const { authUid } = useAppState();

  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(urlInicial ?? null);
  const [tecladoAltura, setTecladoAltura] = useState(0);
  const listaRef = useRef(null);

  const iniciais = useMemo(() => (nome ?? '?').charAt(0), [nome]);

  useEffect(() => {
    if (!userId) return undefined;

    let ativo = true;
    carregarPerfilUsuario(userId).then((perfil) => {
      if (ativo) setFotoPerfil(perfil?.url ?? null);
    });

    return () => {
      ativo = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!conversaId) {
      setCarregando(false);
      return undefined;
    }

    setCarregando(true);
    const cancelar = escutarMensagens(conversaId, (lista) => {
      setMensagens(
        lista.map((msg) => ({
          ...msg,
          minha: msg.idUsuario === authUid,
        })),
      );
      setCarregando(false);
    });

    return () => cancelar();
  }, [conversaId, authUid]);

  useEffect(() => {
    if (mensagens.length === 0) return;
    listaRef.current?.scrollToEnd({ animated: true });
  }, [mensagens]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (event) => {
      if (Platform.OS === 'android') {
        setTecladoAltura(event.endCoordinates.height);
      }
      setTimeout(() => listaRef.current?.scrollToEnd({ animated: true }), 50);
    });
    const onHide = Keyboard.addListener(hideEvent, () => {
      if (Platform.OS === 'android') {
        setTecladoAltura(0);
      }
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  function focarInput() {
    setTimeout(() => listaRef.current?.scrollToEnd({ animated: true }), 50);
  }

  async function enviar() {
    const t = texto.trim();
    if (!t || !conversaId || !authUid || enviando) return;

    setEnviando(true);
    setTexto('');
    try {
      await enviarMensagem(conversaId, authUid, t);
    } catch {
      setTexto(t);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthKeyboardScreen
      aboveTabBar
      layout="flex"
      style={styles.chatScreen}
      header={
        <View style={styles.chatHeader}>
          <TouchableOpacity
            style={styles.messageBackBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-back" size={22} color={colors.purple} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chatHeaderCenter}
            activeOpacity={0.75}
            onPress={() => abrirPerfilUsuario(navigation, { userId, username: nome })}
          >
            {fotoPerfil ? (
              <Image source={{ uri: fotoPerfil }} style={styles.messageAvatar} />
            ) : (
              <View style={styles.messageAvatar}>
                <Text style={styles.messageAvatarText}>{iniciais}</Text>
              </View>
            )}
            <Text style={[styles.chatHeaderNome, styles.messageCardNomeLink]} numberOfLines={1}>
              {nome ?? 'Conversa'}
            </Text>
          </TouchableOpacity>
          <View style={styles.messageHeaderSpacer} />
        </View>
      }
    >
      <View style={{ flex: 1, paddingBottom: Platform.OS === 'android' ? tecladoAltura : 0 }}>
        {carregando ? (
          <View style={styles.messageEmpty}>
            <ActivityIndicator size="large" color={colors.purple} />
          </View>
        ) : (
          <FlatList
            ref={listaRef}
            style={{ flex: 1 }}
            data={mensagens}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            onContentSizeChange={() => listaRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <View style={styles.messageEmpty}>
                <Text style={styles.messageEmptyText}>Nenhuma mensagem ainda. Diga olá!</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View
                style={[
                  styles.chatBubbleRow,
                  item.minha ? styles.chatBubbleRowMine : styles.chatBubbleRowOther,
                ]}
              >
                <View
                  style={[
                    styles.chatBubble,
                    item.minha ? styles.chatBubbleMine : styles.chatBubbleOther,
                  ]}
                >
                  <Text
                    style={[
                      styles.chatBubbleText,
                      item.minha ? styles.chatBubbleTextMine : styles.chatBubbleTextOther,
                    ]}
                  >
                    {item.texto}
                  </Text>
                  <Text
                    style={[
                      styles.chatBubbleText,
                      item.minha ? styles.chatBubbleTextMine : styles.chatBubbleTextOther,
                      { fontSize: 10, opacity: 0.7, marginTop: 4 },
                    ]}
                  >
                    {formatarHoraMensagem(item.timestamp)}
                  </Text>
                </View>
              </View>
            )}
          />
        )}

        <View style={styles.chatInputRow}>
          <TextInput
            style={styles.chatInput}
            placeholder="Escreva uma mensagem..."
            placeholderTextColor={colors.textSecondary}
            value={texto}
            onChangeText={setTexto}
            onFocus={focarInput}
            onSubmitEditing={enviar}
            returnKeyType="send"
            editable={Boolean(conversaId && authUid) && !enviando}
          />
          <TouchableOpacity
            style={styles.chatSendBtn}
            onPress={enviar}
            activeOpacity={0.85}
            disabled={!texto.trim() || enviando}
          >
            {enviando ? (
              <ActivityIndicator size="small" color={colors.textOnPurple} />
            ) : (
              <Ionicons name="send" size={20} color={colors.textOnPurple} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </AuthKeyboardScreen>
  );
}
