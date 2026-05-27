import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import ScreenSafe from '../components/ScreenSafe';
import {
  listarSeguidoresDoAtual,
  listarSeguindoDoAtual,
} from '../domain/users';
import { abrirPerfilUsuario } from '../navigation/perfilNavigation';
import styles from '../../style';
import { colors } from '../../style/tokens';

export default function TelaListaConexoes({ navigation }) {
  const route = useRoute();
  const tipo = route.params?.tipo === 'seguindo' ? 'seguindo' : 'seguidores';

  const titulo = tipo === 'seguindo' ? 'Seguindo' : 'Seguidores';
  const lista = tipo === 'seguindo' ? listarSeguindoDoAtual() : listarSeguidoresDoAtual();

  return (
    <ScreenSafe style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.conexoesHeader}>
        <TouchableOpacity
          style={styles.messageBackBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={22} color={colors.purple} />
        </TouchableOpacity>
        <Text style={styles.conexoesHeaderTitle}>{titulo}</Text>
        <View style={styles.messageHeaderSpacer} />
      </View>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.userSearchList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.userSearchEmpty}>
            <Ionicons name="people-outline" size={40} color={colors.purpleLight} />
            <Text style={styles.userSearchEmptyText}>Nenhuma pessoa nesta lista.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userSearchCard}
            activeOpacity={0.85}
            onPress={() => abrirPerfilUsuario(navigation, { userId: item.id })}
          >
            <View style={styles.userSearchAvatar}>
              <Text style={styles.userSearchAvatarText}>{item.username.charAt(0)}</Text>
            </View>
            <View style={styles.userSearchCardBody}>
              <Text style={styles.userSearchNome}>{item.username}</Text>
              <Text style={styles.userSearchMeta} numberOfLines={1}>
                {item.cidade}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.purple} />
          </TouchableOpacity>
        )}
      />
    </ScreenSafe>
  );
}
