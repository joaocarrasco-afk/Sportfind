import { Ionicons } from '@expo/vector-icons';
import { FlatList, Image, Text, View } from 'react-native';
import ScreenSafe from '../components/ScreenSafe';
import styles from '../../style';
import { colors } from '../../style/tokens';

export default function TelaNotificacao() {
  const notificacoes = [];

  return (
    <ScreenSafe style={styles.notificationScreen}>
      {notificacoes.length === 0 ? (
        <>
          <View style={styles.notificationEmpty}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.purpleLight} />
            <Text style={styles.notificationEmptyText}>Sem notificações no momento.</Text>
          </View>
        </>
      ) : (
        <FlatList
          data={notificacoes}
          keyExtractor={(n) => n.id}
          contentContainerStyle={styles.notificationList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const title =
              item.type === 'atrasado' ? 'Atrasado para o local' : 'Partida perto de você';
            const badgeStyle =
              item.type === 'atrasado'
                ? styles.notificationBadgeLate
                : styles.notificationBadgeNear;
            return (
              <View style={styles.notificationCard}>
                <View style={[styles.notificationBadge, badgeStyle]} />
                <View style={styles.notificationCardInner}>
                  <Image
                    source={{ uri: item.place.image }}
                    style={styles.notificationThumb}
                    resizeMode="cover"
                  />
                  <View style={styles.notificationTextBlock}>
                    <Text style={styles.notificationTextTitle}>{title}</Text>
                    <Text style={styles.notificationTextSubtitle}>{item.message}</Text>
                  </View>
                  <View style={styles.notificationChevron}>
                    <Ionicons name="chevron-forward" size={18} color={colors.purple} />
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
    </ScreenSafe>
  );
}
