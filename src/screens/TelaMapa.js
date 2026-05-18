import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo } from 'react';
import { Platform, Text, TouchableOpacity, View, Image, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../../style';
import ModalFiltros from '../components/ModalFiltros';
import { htmlMapa } from '../utils/htmlMapa';
import { useAppState } from '../state/AppStateContext';
import { parseMapMessage } from '../features/map/mapBridge';
import { colors } from '../../style/tokens';
import { FILTER_ALL } from '../domain/places';

function rotuloAcesso(acesso) {
  if (acesso === FILTER_ALL) return null;
  return acesso === 'Publico' ? 'Público' : acesso;
}

export default function TelaMapa({ navigation }) {
  const {
    filteredPlaces,
    setFilterVisible,
    isFilterVisible,
    sportFilters,
    toggleSportFilter,
    applyFilters,
    accessFilter,
    setAccessFilter,
    resetFilters,
    selectedPlace,
    setSelectedPlaceId,
  } = useAppState();

  const temFiltros = sportFilters.length > 0 || accessFilter !== FILTER_ALL;
  const acessoLabel = rotuloAcesso(accessFilter);

  const mapHtml = useMemo(() => htmlMapa(filteredPlaces), [filteredPlaces]);

  const handleMapMessage = useCallback(
    (raw) => {
      const placeId = parseMapMessage(raw);
      if (Number.isInteger(placeId) && placeId > 0) {
        setSelectedPlaceId(placeId);
      }
    },
    [setSelectedPlaceId],
  );

  useFocusEffect(
    useCallback(() => {
      return () => setSelectedPlaceId(null);
    }, [setSelectedPlaceId]),
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return undefined;

    const handler = (event) => {
      if (event?.data != null) handleMapMessage(event.data);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [handleMapMessage]);

  const mostrarCard = Boolean(selectedPlace?.id && selectedPlace?.name);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={{ flex: 1 }} collapsable={false}>
        {Platform.OS === 'web' ? (
          <iframe
            title="Mapa Sportfind"
            style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
            srcDoc={mapHtml}
          />
        ) : (
          <WebView
            style={{ flex: 1, opacity: 0.99 }}
            source={{ html: mapHtml }}
            onMessage={(event) => handleMapMessage(event.nativeEvent.data)}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['*']}
            scrollEnabled={false}
            bounces={false}
          />
        )}
      </View>

      <SafeAreaView style={styles.mapOverlaySafe} pointerEvents="box-none">
        <View style={styles.mapTopOverlay} pointerEvents="box-none">
          <View style={styles.mapSearchRow} pointerEvents="box-none">
            <TouchableOpacity
              style={styles.mapSearchBar}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('TelaBusca')}
            >
              <Ionicons name="search" size={20} color={colors.purple} />
              <Text style={styles.mapSearchPlaceholder}>Buscar locais esportivos...</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.mapFilterButton, temFiltros && styles.mapFilterButtonActive]}
              onPress={() => setFilterVisible(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="options-outline" size={22} color={colors.purple} />
            </TouchableOpacity>
          </View>

          {temFiltros ? (
            <View style={styles.mapChipsRow} pointerEvents="box-none">
              <TouchableOpacity style={styles.mapClearAllChip} onPress={resetFilters}>
                <Text style={styles.mapClearAllChipText}>Limpar todos</Text>
              </TouchableOpacity>
              {sportFilters.map((esporte) => (
                <TouchableOpacity
                  key={esporte}
                  style={styles.mapActiveFilterChip}
                  onPress={() => toggleSportFilter(esporte)}
                >
                  <Text style={styles.mapActiveFilterChipText}>{esporte}</Text>
                  <Ionicons name="close-circle" size={16} color={colors.textOnPurple} />
                </TouchableOpacity>
              ))}
              {acessoLabel ? (
                <TouchableOpacity
                  style={styles.mapActiveFilterChip}
                  onPress={() => setAccessFilter(FILTER_ALL)}
                >
                  <Text style={styles.mapActiveFilterChipText}>{acessoLabel}</Text>
                  <Ionicons name="close-circle" size={16} color={colors.textOnPurple} />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
        </View>

        {mostrarCard ? (
          <View style={styles.selectedPlaceCardWrap}>
            <TouchableOpacity
              style={styles.selectedPlaceCard}
              activeOpacity={0.95}
              onPress={() => navigation.navigate('TelaLocal')}
            >
              <Image source={{ uri: selectedPlace.image }} style={styles.selectedPlaceImage} />
              <View style={styles.selectedPlaceCardBody}>
                <Text style={styles.selectedPlaceTitle} numberOfLines={1}>
                  {selectedPlace.name}
                </Text>
                <Text style={styles.selectedPlaceInfo} numberOfLines={1}>
                  {selectedPlace.distance} • {selectedPlace.access}
                </Text>
                <Text style={styles.selectedPlaceCta}>Toque para ver mais →</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedPlaceId(null)}
                style={styles.selectedPlaceCloseBtn}
                hitSlop={12}
              >
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ) : null}
      </SafeAreaView>

      <ModalFiltros
        visivel={isFilterVisible}
        fechar={() => setFilterVisible(false)}
        sportFilters={sportFilters}
        filtroAcesso={accessFilter}
        onAplicar={applyFilters}
        onLimparTodos={resetFilters}
      />
    </View>
  );
}
