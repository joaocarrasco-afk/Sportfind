import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenSafe from '../components/ScreenSafe';
import { buscarUsuarios } from '../domain/users';
import { abrirPerfilUsuario } from '../navigation/perfilNavigation';
import { useAppState } from '../state/AppStateContext';
import styles from '../../style';
import { colors, spacing } from '../../style/tokens';

export default function TelaBuscaFeed({ navigation }) {
  const { authUid } = useAppState();
  const [termo, setTermo] = useState('');

  const resultados = useMemo(() => buscarUsuarios(termo), [termo]);

  function abrirPerfil(usuario) {
    abrirPerfilUsuario(navigation, { userId: usuario.id, authUid });
  }

  return (
    <ScreenSafe style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.searchBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.purple} />
        </TouchableOpacity>
        <TextInput
          style={[
            styles.searchInput,
            { borderTopRightRadius: spacing.sm, borderBottomRightRadius: spacing.sm },
          ]}
          placeholder="Buscar pessoas..."
          placeholderTextColor={colors.textSecondary}
          value={termo}
          onChangeText={setTermo}
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <Text style={styles.sectionLabel}>
        {termo.trim() === '' ? 'Sugestões' : `${resultados.length} pessoa(s)`}
      </Text>

      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.userSearchList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.userSearchEmpty}>
            <Ionicons name="person-outline" size={40} color={colors.purpleLight} />
            <Text style={styles.userSearchEmptyText}>Nenhuma pessoa encontrada.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userSearchCard}
            activeOpacity={0.85}
            onPress={() => abrirPerfil(item)}
          >
            <View style={styles.userSearchAvatar}>
              <Text style={styles.userSearchAvatarText}>{item.username.charAt(0)}</Text>
            </View>
            <View style={styles.userSearchCardBody}>
              <Text style={styles.userSearchNome}>{item.username}</Text>
              <Text style={styles.userSearchMeta} numberOfLines={1}>
                {item.cidade}
                {item.tags?.length ? ` · ${item.tags.slice(0, 2).join(', ')}` : ''}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.purple} />
          </TouchableOpacity>
        )}
      />
    </ScreenSafe>
  );
}
