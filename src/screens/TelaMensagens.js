import { Ionicons } from '@expo/vector-icons';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import ScreenSafe from '../components/ScreenSafe';
import { useNavigation } from '@react-navigation/native';
import styles from '../../style';
import { colors } from '../../style/tokens';
import { abrirPerfilUsuario } from '../navigation/perfilNavigation';

const CONVERSAS_DEMO = [
  { id: '1', userId: 'u-marina', nome: 'Marina', ultima: 'Bora marcar um jogo?', hora: '14:30' },
  { id: '2', userId: 'u-joao', nome: 'João', ultima: 'Confirmado para sábado!', hora: 'Ontem' },
  {
    id: '3',
    userId: 'u-equipe',
    nome: 'Equipe Sportfind',
    ultima: 'Nova partida perto de você.',
    hora: 'Seg',
  },
];

export default function TelaMensagens() {
  const navigation = useNavigation();
  const conversas = CONVERSAS_DEMO;

  function abrirConversa(item) {
    navigation.navigate('TelaChatConversa', {
      conversaId: item.id,
      nome: item.nome,
      userId: item.userId,
    });
  }

  function abrirPerfil(item) {
    abrirPerfilUsuario(navigation, { userId: item.userId, username: item.nome });
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

      {conversas.length === 0 ? (
        <View style={styles.messageEmpty}>
          <Ionicons name="chatbubbles-outline" size={48} color={colors.purpleLight} />
          <Text style={styles.messageEmptyText}>Nenhuma conversa ainda.</Text>
        </View>
      ) : (
        <FlatList
          data={conversas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.messageCard}
              activeOpacity={0.85}
              onPress={() => abrirConversa(item)}
            >
              <View style={styles.messageAvatar}>
                <Text style={styles.messageAvatarText}>{item.nome.charAt(0)}</Text>
              </View>
              <View style={styles.messageCardBody}>
                <TouchableOpacity onPress={() => abrirPerfil(item)} activeOpacity={0.7}>
                  <Text style={[styles.messageCardNome, styles.messageCardNomeLink]}>
                    {item.nome}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.messageCardPreview} numberOfLines={1}>
                  {item.ultima}
                </Text>
              </View>
              <Text style={styles.messageCardHora}>{item.hora}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </ScreenSafe>
  );
}
