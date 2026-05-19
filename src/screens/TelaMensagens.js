import { Ionicons } from '@expo/vector-icons';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../style';
import { colors } from '../../style/tokens';

const CONVERSAS_DEMO = [
  { id: '1', nome: 'Marina', ultima: 'Bora marcar um jogo?', hora: '14:30' },
  { id: '2', nome: 'João', ultima: 'Confirmado para sábado!', hora: 'Ontem' },
  { id: '3', nome: 'Equipe Sportfind', ultima: 'Nova partida perto de você.', hora: 'Seg' },
];

export default function TelaMensagens() {
  const navigation = useNavigation();
  const conversas = CONVERSAS_DEMO;

  return (
    <SafeAreaView style={styles.messageScreen}>
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
            <TouchableOpacity style={styles.messageCard} activeOpacity={0.85}>
              <View style={styles.messageAvatar}>
                <Text style={styles.messageAvatarText}>{item.nome.charAt(0)}</Text>
              </View>
              <View style={styles.messageCardBody}>
                <Text style={styles.messageCardNome}>{item.nome}</Text>
                <Text style={styles.messageCardPreview} numberOfLines={1}>
                  {item.ultima}
                </Text>
              </View>
              <Text style={styles.messageCardHora}>{item.hora}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
