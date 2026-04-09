import { Platform, Text, TouchableOpacity, View, Image, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import styles from '../../style';
import ModalFiltros from '../components/ModalFiltros';
import { htmlMapa } from '../utils/htmlMapa';
import { useAppState } from '../state/AppStateContext';
import { parseMapMessage } from '../features/map/mapBridge';

export default function TelaMapa({ navigation }) {
  const {
    filteredPlaces,
    setFilterVisible,
    isFilterVisible,
    typeFilter,
    accessFilter,
    setTypeFilter,
    setAccessFilter,
    resetFilters,
    selectedPlace,
    setSelectedPlaceId,
  } = useAppState();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {Platform.OS === 'web' ? (
        <View style={{ flex: 1 }}>
          <iframe
            title="Mapa"
            style={{ border: 0, width: '100%', height: '100%' }}
            srcDoc={htmlMapa(filteredPlaces)}
          />
        </View>
      ) : (
        <WebView
          style={{ flex: 1 }}
          source={{ html: htmlMapa(filteredPlaces) }}
          onMessage={(event) => {
            const placeId = parseMapMessage(event.nativeEvent.data);
            if (Number.isFinite(placeId)) {
              setSelectedPlaceId(placeId);
            }
          }}
          javaScriptEnabled
          originWhitelist={['*']}
        />
      )}

      <TouchableOpacity style={styles.floatingButtonLeft} onPress={() => navigation.navigate('TelaBusca')}>
        <Text style={{ fontSize: 22 }}>🔍</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.floatingButtonRight} onPress={() => setFilterVisible(true)}>
        <Text style={{ fontSize: 22 }}>⚙️</Text>
      </TouchableOpacity>

      {(typeFilter !== 'Todos' || accessFilter !== 'Todos') && (
        <TouchableOpacity
          style={styles.filterTag}
          onPress={resetFilters}
        >
          <Text style={styles.filterTagText}>
            {[typeFilter !== 'Todos' && typeFilter, accessFilter !== 'Todos' && accessFilter]
              .filter(Boolean)
              .join(' · ')}{' '}
            ×
          </Text>
        </TouchableOpacity>
      )}

      {selectedPlace && (
        <TouchableOpacity
          style={styles.selectedPlaceCard}
          onPress={() => navigation.navigate('TelaLocal')}
        >
          <Image source={{ uri: selectedPlace.image }} style={styles.selectedPlaceImage} />
          <View style={{ flex: 1, padding: 12 }}>
            <Text style={styles.selectedPlaceTitle}>{selectedPlace.name}</Text>
            <Text style={styles.selectedPlaceInfo}>
              {selectedPlace.distance}  •  {selectedPlace.access}
            </Text>
            <Text style={{ fontSize: 11, color: '#6393F2', marginTop: 4 }}>Toque para ver mais →</Text>
          </View>
          <TouchableOpacity onPress={() => setSelectedPlaceId(null)} style={{ padding: 12 }}>
            <Text style={{ fontSize: 20, color: '#555' }}>×</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      <ModalFiltros
        visivel={isFilterVisible}
        fechar={() => setFilterVisible(false)}
        filtroTipo={typeFilter}
        filtroAcesso={accessFilter}
        setFiltroTipo={setTypeFilter}
        setFiltroAcesso={setAccessFilter}
      />
    </SafeAreaView>
  );
}
