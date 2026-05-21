import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  FILTER_ALL,
  filterPlaces,
  formatPartidaData,
  INITIAL_PLACES,
  resolvePlaceSportMeta,
} from '../domain/places';

const AppStateContext = createContext(null);

const DEFAULT_PLACE_IMAGE =
  'https://images.unsplash.com/photo-1556300673-04df21735615?w=800&auto=format&fit=crop&q=80';
const MAP_CENTER = { lat: -23.5445, lng: -46.3106 };

export function AppStateProvider({ children }) {
  const [authUid, setAuthUid] = useState(null);
  const [places, setPlaces] = useState(INITIAL_PLACES);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [sportFilters, setSportFilters] = useState([]);
  const [accessFilter, setAccessFilter] = useState(FILTER_ALL);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [partidas, setPartidas] = useState([]);

  useEffect(() => {
    setPlaces((prev) => {
      const seedIds = new Set(INITIAL_PLACES.map((p) => p.id));
      const extras = prev.filter((p) => !seedIds.has(p.id));
      return [...INITIAL_PLACES, ...extras];
    });
  }, [INITIAL_PLACES]);

  const filteredPlaces = useMemo(
    () =>
      filterPlaces({
        places,
        sportFilters,
        accessFilter,
        search,
      }),
    [places, sportFilters, accessFilter, search],
  );

  const selectedPlace = useMemo(() => {
    if (!Number.isInteger(selectedPlaceId) || selectedPlaceId <= 0) return null;
    return places.find((place) => place.id === selectedPlaceId) ?? null;
  }, [selectedPlaceId, places]);

  function addPlace(dados) {
    const esportes = dados.sports ?? [];
    const meta = resolvePlaceSportMeta(esportes);
    const maxId = places.reduce((max, p) => Math.max(max, p.id), 0);
    const offset = (maxId % 10) * 0.0008;

    const novo = {
      id: maxId + 1,
      name: dados.name.trim(),
      address: dados.address.trim(),
      type: meta.type,
      emoji: meta.emoji,
      sports: meta.sports,
      access: dados.access,
      lat: dados.lat ?? MAP_CENTER.lat + offset,
      lng: dados.lng ?? MAP_CENTER.lng + offset,
      color: '#9756CA',
      image: dados.image ?? DEFAULT_PLACE_IMAGE,
      distance: '—',
      description: dados.description?.trim() || dados.address.trim(),
    };

    setPlaces((prev) => [...prev, novo]);
    return novo;
  }

  function addPartida({ nome, esporte, data, placeId }) {
    const place = places.find((p) => p.id === placeId);
    if (!place) return null;

    const id = `partida-${Date.now()}`;
    const dataLabel = formatPartidaData(data);
    const partida = {
      id,
      nome: nome.trim(),
      esporte,
      data,
      dataLabel,
      placeId,
      place,
    };

    setPartidas((prev) => [partida, ...prev]);
    return partida;
  }

  const selectedPlaceForDetail = useMemo(() => {
    if (!Number.isInteger(selectedPlaceId) || selectedPlaceId <= 0) return null;
    return places.find((place) => place.id === selectedPlaceId) ?? null;
  }, [selectedPlaceId, places]);

  useEffect(() => {
    if (
      selectedPlaceId != null &&
      !filteredPlaces.some((place) => place.id === selectedPlaceId)
    ) {
      setSelectedPlaceId(null);
    }
  }, [filteredPlaces, selectedPlaceId]);

  const toggleSportFilter = (sport) => {
    setSportFilters((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport],
    );
  };

  const applyFilters = (sports, access) => {
    setSportFilters(sports);
    setAccessFilter(access);
  };

  const resetFilters = () => {
    setSportFilters([]);
    setAccessFilter(FILTER_ALL);
  };

  const value = {
    authUid,
    setAuthUid,
    places,
    filteredPlaces,
    addPlace,
    partidas,
    addPartida,
    selectedPlace: selectedPlaceForDetail,
    selectedPlaceId,
    setSelectedPlaceId,
    sportFilters,
    toggleSportFilter,
    applyFilters,
    accessFilter,
    setAccessFilter,
    isFilterVisible,
    setFilterVisible,
    search,
    setSearch,
    resetFilters,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
