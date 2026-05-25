import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo } from 'react';
import {
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import styles from '../../style';
import InfraestruturaChips from '../components/InfraestruturaChips';
import ModalFiltros from '../components/ModalFiltros';
import { htmlMapa } from '../utils/htmlMapa';
import { useAppState } from '../state/AppStateContext';
import { parseMapMessage } from '../features/map/mapBridge';
import { colors } from '../../style/tokens';
import { FILTER_ALL, rotuloInfraestrutura } from '../domain/places';

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
    infraFilters,
    toggleSportFilter,
    toggleInfraFilter,
    applyFilters,
    accessFilter,
    setAccessFilter,
    resetFilters,
    selectedPlace,
    setSelectedPlaceId,
  } = useAppState();

  const temFiltros =
    sportFilters.length > 0 || infraFilters.length > 0 || accessFilter !== FILTER_ALL;
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

  const abrirDetalheLocal = useCallback(() => {
    if (!selectedPlace?.id) return;
    setSelectedPlaceId(selectedPlace.id);
    navigation.navigate('TelaLocal', { placeId: selectedPlace.id });
  }, [navigation, selectedPlace, setSelectedPlaceId]);

  useEffect(() => {
    if (Platform.OS !== 'web') return undefined;

    const handler = (event) => {
      if (event?.data == null) return;
      const raw =
        typeof event.data === 'string'
          ? event.data
          : typeof event.data === 'object'
            ? JSON.stringify(event.data)
            : String(event.data);
      handleMapMessage(raw);
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

      <SafeAreaView style={styles.mapTopOverlayAbsolute} pointerEvents="box-none">
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
              {infraFilters.map((infraId) => (
                <TouchableOpacity
                  key={infraId}
                  style={styles.mapActiveFilterChip}
                  onPress={() => toggleInfraFilter(infraId)}
                >
                  <Text style={styles.mapActiveFilterChipText}>
                    {rotuloInfraestrutura(infraId)}
                  </Text>
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
      </SafeAreaView>

      {mostrarCard ? (
        <SafeAreaView style={styles.mapBottomCardOverlay}>
          <View style={styles.selectedPlaceCardWrap}>
            <Pressable
              style={({ pressed }) => [
                styles.selectedPlaceCard,
                pressed && { opacity: 0.92 },
              ]}
              onPress={abrirDetalheLocal}
              android_ripple={{ color: colors.purpleLight }}
            >
              <Image source={{ uri: selectedPlace.image }} style={styles.selectedPlaceImage} />
              <View style={styles.selectedPlaceCardBody}>
                <Text style={styles.selectedPlaceTitle} numberOfLines={1}>
                  {selectedPlace.name}
                </Text>
                <Text style={styles.selectedPlaceInfo} numberOfLines={1}>
                  {selectedPlace.distance} • {selectedPlace.access}
                </Text>
                <InfraestruturaChips
                  ids={selectedPlace.infraestrutura}
                  compact
                  maxItens={3}
                />
                <Text style={styles.selectedPlaceCta}>Toque para ver mais →</Text>
              </View>
            </Pressable>
            <TouchableOpacity
              onPress={() => setSelectedPlaceId(null)}
              style={styles.selectedPlaceCloseBtnFloating}
              hitSlop={12}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : null}

      <ModalFiltros
        visivel={isFilterVisible}
        fechar={() => setFilterVisible(false)}
        sportFilters={sportFilters}
        infraFilters={infraFilters}
        filtroAcesso={accessFilter}
        onAplicar={applyFilters}
        onLimparTodos={resetFilters}
      />
    </View>
  );
}
