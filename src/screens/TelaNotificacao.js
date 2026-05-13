import { FlatList, Image, SafeAreaView, Text, View } from 'react-native';
import styles from '../../style';
import { PLACES } from '../domain/places';

const pAtrasado = PLACES.find((p) => p.id === 2) ?? PLACES[0];
const pPerto1 = PLACES.find((p) => p.id === 5) ?? PLACES[0];
const pPerto2 = PLACES.find((p) => p.id === 3) ?? PLACES[0];

const NOTIFICACOES_DEMO = [
  {
    id: 'n-1',
    type: 'atrasado',
    place: pAtrasado,
    message: 'Você está atrasado para chegar no local a tempo.',
  },
  {
    id: 'n-2',
    type: 'perto',
    place: pPerto1,
    message: 'Tem partida perto de você hoje.',
  },
  {
    id: 'n-3',
    type: 'perto',
    place: pPerto2,
    message: 'A partida está rolando agora na sua região.',
  },
];

export default function TelaNotificacao() {
  const notificacoes = NOTIFICACOES_DEMO;

  return (
    <SafeAreaView style={styles.notificationScreen}>
      {notificacoes.length === 0 ? (
        <View style={styles.notificationEmpty}>
          <Text style={styles.notificationEmptyText}>Sem notificações.</Text>
        </View>
      ) : (
        <FlatList
          data={notificacoes}
          keyExtractor={(n) => n.id}
          contentContainerStyle={styles.notificationList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const title = item.type === 'atrasado' ? 'Atrasado para o local' : 'Partida perto de você';
            return (
              <View style={styles.notificationCard}>
                <View style={styles.notificationCardInner}>
                  <Image source={{ uri: item.place.image }} style={styles.notificationThumb} resizeMode="cover" />
                  <View style={styles.notificationTextBlock}>
                    <Text style={styles.notificationTextTitle}>{title}</Text>
                    <Text style={styles.notificationTextSubtitle}>{item.message}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

