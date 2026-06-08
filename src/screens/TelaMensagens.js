import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenSafe from '../components/ScreenSafe';
import { abrirPerfilUsuario } from '../navigation/perfilNavigation';
import { useAppState } from '../state/AppStateContext';
import { buscarOuCriarChatPV, listarContatosMensagens } from '../utils/chatApi';
import styles from '../../style';
import { colors } from '../../style/tokens';

export default function TelaMensagens() {
  const navigation = useNavigation();
  const { authUid, seguindo } = useAppState();
  const [contatos, setContatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [abrindoId, setAbrindoId] = useState(null);

  const carregarContatos = useCallback(async () => {
    if (!authUid) {
      setContatos([]);
      setCarregando(false);
      return;
    }

    setCarregando(true);
    try {
      const lista = await listarContatosMensagens(authUid, seguindo);
      setContatos(lista);
    } catch {
      setContatos([]);
    } finally {
      setCarregando(false);
    }
  }, [authUid, seguindo]);

  useFocusEffect(
    useCallback(() => {
      carregarContatos();
    }, [carregarContatos]),
  );

  async function abrirConversa(item) {
    if (!authUid || abrindoId) return;

    setAbrindoId(item.id);
    try {
      const { chatId } = await buscarOuCriarChatPV(authUid, item.id);
      navigation.navigate('TelaChatConversa', {
        conversaId: chatId,
        nome: item.username,
        userId: item.id,
        url: item.url,
      });
    } catch {
      /* falha silenciosa — usuário pode tentar de novo */
    } finally {
      setAbrindoId(null);
    }
  }

  function abrirPerfil(item) {
    abrirPerfilUsuario(navigation, { userId: item.id, username: item.username });
  }

  return (
    <ScreenSafe style={styles.messageScreen} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.messageHeader}>
        <TouchableOpacity
          style={styles.messageBackBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={22} color={colors.purple} />
        </TouchableOpacity>
        <Text style={styles.messageHeaderTitle}>Mensagens</Text>
        <View style={styles.messageHeaderSpacer} />
      </View>

      {carregando ? (
        <View style={styles.messageEmpty}>
          <ActivityIndicator size="large" color={colors.purple} />
        </View>
      ) : !authUid ? (
        <View style={styles.messageEmpty}>
          <Ionicons name="person-outline" size={48} color={colors.purpleLight} />
          <Text style={styles.messageEmptyText}>Faça login para enviar mensagens.</Text>
        </View>
      ) : contatos.length === 0 ? (
        <View style={styles.messageEmpty}>
          <Ionicons name="chatbubbles-outline" size={48} color={colors.purpleLight} />
          <Text style={styles.messageEmptyText}>
            Siga pessoas ou inicie uma conversa para aparecer aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={contatos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const abrindo = abrindoId === item.id;
            return (
              <TouchableOpacity
                style={styles.messageCard}
                activeOpacity={0.85}
                disabled={abrindo}
                onPress={() => abrirConversa(item)}
              >
                {item.url ? (
                  <Image source={{ uri: item.url }} style={styles.messageAvatar} />
                ) : (
                  <View style={styles.messageAvatar}>
                    <Text style={styles.messageAvatarText}>{item.username.charAt(0)}</Text>
                  </View>
                )}
                <View style={styles.messageCardBody}>
                  <TouchableOpacity onPress={() => abrirPerfil(item)} activeOpacity={0.7}>
                    <Text style={[styles.messageCardNome, styles.messageCardNomeLink]}>
                      {item.username}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.messageCardPreview} numberOfLines={1}>
                    Toque para conversar
                  </Text>
                </View>
                {abrindo ? (
                  <ActivityIndicator size="small" color={colors.purple} />
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={colors.purpleLight} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </ScreenSafe>
  );
}
