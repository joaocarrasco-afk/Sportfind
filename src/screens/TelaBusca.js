import { Ionicons } from '@expo/vector-icons';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenSafe from '../components/ScreenSafe';
import styles from '../../style';
import { colors } from '../../style/tokens';
import InfraestruturaChips from '../components/InfraestruturaChips';
import ModalFiltros from '../components/ModalFiltros';
import { useAppState } from '../state/AppStateContext';

export default function TelaBusca({ navigation }) {
  const {
    search,
    setSearch,
    filteredPlaces,
    setSelectedPlaceId,
    isFilterVisible,
    setFilterVisible,
    sportFilters,
    infraFilters,
    accessFilter,
    applyFilters,
    resetFilters,
  } = useAppState();

  return (
    <ScreenSafe style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.searchBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar local esportivo..."
          value={search}
          onChangeText={setSearch}
          autoFocus
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
          <Ionicons name="options-outline" size={22} color={colors.purple} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>
        {search === '' ? 'Recente' : `${filteredPlaces.length} resultado(s)`}
      </Text>

      <FlatList
        data={filteredPlaces}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.userSearchEmpty}>
            <Ionicons name="location-outline" size={40} color={colors.purpleLight} />
            <Text style={styles.userSearchEmptyText}>Nenhum local encontrado.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setSelectedPlaceId(item.id);
              navigation.navigate('TelaLocal', { placeId: item.id });
            }}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardInfo}>
                {item.distance} • {item.access}
              </Text>
              <InfraestruturaChips ids={item.infraestrutura} compact maxItens={2} />
            </View>
          </TouchableOpacity>
        )}
      />

      <ModalFiltros
        visivel={isFilterVisible}
        fechar={() => setFilterVisible(false)}
        sportFilters={sportFilters}
        infraFilters={infraFilters}
        filtroAcesso={accessFilter}
        onAplicar={applyFilters}
        onLimparTodos={resetFilters}
      />
    </ScreenSafe>
  );
}
