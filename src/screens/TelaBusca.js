import { FlatList, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../../style';
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
    accessFilter,
    applyFilters,
    resetFilters,
  } = useAppState();

  return (
    <SafeAreaView style={styles.screen}>
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
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>
        {search === '' ? 'Recente' : `${filteredPlaces.length} resultado(s)`}
      </Text>

      <FlatList
        data={filteredPlaces}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setSelectedPlaceId(item.id);
              navigation.navigate('TelaLocal');
            }}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardInfo}>
                {item.distance} • {item.access}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <ModalFiltros
        visivel={isFilterVisible}
        fechar={() => setFilterVisible(false)}
        sportFilters={sportFilters}
        filtroAcesso={accessFilter}
        onAplicar={applyFilters}
        onLimparTodos={resetFilters}
      />
    </SafeAreaView>
  );
}
