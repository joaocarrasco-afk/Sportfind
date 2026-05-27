import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Platform, Pressable, Text, TouchableOpacity, View, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import styles from '../../style';
import InfraestruturaChips from '../components/InfraestruturaChips';
import ModalFiltros from '../components/ModalFiltros';
import { htmlMapa } from '../utils/htmlMapa';
import { useAppState } from '../state/AppStateContext';
import { parseMapMessage } from '../features/map/mapBridge';
import { colors, spacing } from '../../style/tokens';
import { FILTER_ALL, rotuloInfraestrutura } from '../domain/places';
import { useScreenInsets } from '../hooks/useScreenInsets';

const MAP_APP_MESSAGE_TYPE = 'sportfind:map:command';

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
    userLocation,
    refreshUserLocation,
  } = useAppState();

  const insets = useScreenInsets();
  const temFiltros =
    sportFilters.length > 0 || infraFilters.length > 0 || accessFilter !== FILTER_ALL;
  const acessoLabel = rotuloAcesso(accessFilter);

  const mapHtml = useMemo(
    () => htmlMapa(filteredPlaces, userLocation),
    [filteredPlaces, userLocation],
  );
  const webViewRef = useRef(null);
  const iframeRef = useRef(null);

  const handleMapMessage = useCallback(
    (raw) => {
      const placeId = parseMapMessage(raw);
      if (Number.isInteger(placeId) && placeId > 0) {
        setSelectedPlaceId(placeId);
      }
    },
    [setSelectedPlaceId],
  );

  const enviarComandoMapa = useCallback(
    (payload) => {
      const message = JSON.stringify(payload);
      if (Platform.OS === 'web') {
        try {
          iframeRef.current?.contentWindow?.postMessage(message, '*');
        } catch {
          // ignore
        }
        return;
      }
      const script = `try { window.postMessage(${JSON.stringify(message)}, '*'); } catch (e) {} true;`;
      webViewRef.current?.injectJavaScript?.(script);
    },
    [iframeRef, webViewRef],
  );

  const sincronizarLocalizacaoNoMapa = useCallback(
    (loc) => {
      if (!loc?.lat || !loc?.lng) return;
      enviarComandoMapa({
        type: MAP_APP_MESSAGE_TYPE,
        action: 'setUserLocation',
        lat: loc.lat,
        lng: loc.lng,
      });
    },
    [enviarComandoMapa],
  );

  const relocalizar = useCallback(async () => {
    const loc = userLocation ?? (await refreshUserLocation?.());
    if (!loc?.lat || !loc?.lng) return;
    sincronizarLocalizacaoNoMapa(loc);
    enviarComandoMapa({
      type: MAP_APP_MESSAGE_TYPE,
      action: 'center',
      lat: loc.lat,
      lng: loc.lng,
      zoom: 16,
    });
  }, [enviarComandoMapa, refreshUserLocation, sincronizarLocalizacaoNoMapa, userLocation]);

  useEffect(() => {
    refreshUserLocation?.();
  }, [refreshUserLocation]);

  useEffect(() => {
    if (userLocation?.lat != null && userLocation?.lng != null) {
      sincronizarLocalizacaoNoMapa(userLocation);
    }
  }, [userLocation, sincronizarLocalizacaoNoMapa]);

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
            ref={iframeRef}
          />
        ) : (
          <WebView
            ref={webViewRef}
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

      <View
        style={[styles.mapFabColumn, { bottom: spacing.xl + insets.bottom }]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={styles.mapFab}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('TelaPartidas')}
        >
          <Ionicons name="calendar-outline" size={24} color={colors.textOnPurple} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapFab} activeOpacity={0.9} onPress={relocalizar}>
          <Ionicons name="locate-outline" size={24} color={colors.textOnPurple} />
        </TouchableOpacity>
      </View>

      <View
        style={[styles.mapTopOverlayAbsolute, { paddingTop: insets.topWithPadding }]}
        pointerEvents="box-none"
      >
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
      </View>

      {mostrarCard ? (
        <View style={[styles.mapBottomCardOverlay, { paddingBottom: insets.bottomAboveTabBar }]}>
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
        </View>
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
