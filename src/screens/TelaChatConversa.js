import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenSafe from '../components/ScreenSafe';
import styles from '../../style';
import { colors } from '../../style/tokens';
import { abrirPerfilUsuario } from '../navigation/perfilNavigation';

const MENSAGENS_DEMO = {
  '1': [
    { id: 'm1', autor: 'Marina', texto: 'Bora marcar um jogo?', minha: false },
    { id: 'm2', autor: 'Você', texto: 'Fechado! Que horas?', minha: true },
    { id: 'm3', autor: 'Marina', texto: '15h na quadra do parque?', minha: false },
  ],
  '2': [
    { id: 'm1', autor: 'João', texto: 'Confirmado para sábado!', minha: false },
    { id: 'm2', autor: 'Você', texto: 'Estarei lá.', minha: true },
  ],
  '3': [
    { id: 'm1', autor: 'Equipe Sportfind', texto: 'Nova partida perto de você.', minha: false },
    { id: 'm2', autor: 'Você', texto: 'Obrigado pelo aviso!', minha: true },
  ],
};

export default function TelaChatConversa() {
  const navigation = useNavigation();
  const route = useRoute();
  const { conversaId, nome, userId } = route.params ?? {};

  const iniciais = useMemo(
    () => (MENSAGENS_DEMO[conversaId] ? [...(MENSAGENS_DEMO[conversaId] ?? [])] : []),
    [conversaId],
  );

  const [mensagens, setMensagens] = useState(iniciais);
  const [texto, setTexto] = useState('');

  function enviar() {
    const t = texto.trim();
    if (!t) return;
    setMensagens((prev) => [
      ...prev,
      { id: `local-${Date.now()}`, autor: 'Você', texto: t, minha: true },
    ]);
    setTexto('');
  }

  return (
    <ScreenSafe style={styles.chatScreen} edges={['top', 'left', 'right', 'bottom']}>
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
          <View style={styles.messageAvatar}>
            <Text style={styles.messageAvatarText}>{(nome ?? '?').charAt(0)}</Text>
          </View>
          <Text style={[styles.chatHeaderNome, styles.messageCardNomeLink]} numberOfLines={1}>
            {nome ?? 'Conversa'}
          </Text>
        </TouchableOpacity>
        <View style={styles.messageHeaderSpacer} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <FlatList
          data={mensagens}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={[
                styles.chatBubbleRow,
                item.minha ? styles.chatBubbleRowMine : styles.chatBubbleRowOther,
              ]}
            >
              <View
                style={[styles.chatBubble, item.minha ? styles.chatBubbleMine : styles.chatBubbleOther]}
              >
                <Text
                  style={[
                    styles.chatBubbleText,
                    item.minha ? styles.chatBubbleTextMine : styles.chatBubbleTextOther,
                  ]}
                >
                  {item.texto}
                </Text>
              </View>
            </View>
          )}
        />

        <View style={styles.chatInputRow}>
          <TextInput
            style={styles.chatInput}
            placeholder="Escreva uma mensagem..."
            placeholderTextColor={colors.textSecondary}
            value={texto}
            onChangeText={setTexto}
            onSubmitEditing={enviar}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.chatSendBtn} onPress={enviar} activeOpacity={0.85}>
            <Ionicons name="send" size={20} color={colors.textOnPurple} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenSafe>
  );
}
