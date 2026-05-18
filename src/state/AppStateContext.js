import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FILTER_ALL, filterPlaces, PLACES } from '../domain/places';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [authUid, setAuthUid] = useState(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [sportFilters, setSportFilters] = useState([]);
  const [accessFilter, setAccessFilter] = useState(FILTER_ALL);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filteredPlaces = useMemo(
    () =>
      filterPlaces({
        places: PLACES,
        sportFilters,
        accessFilter,
        search,
      }),
    [sportFilters, accessFilter, search],
  );

  const selectedPlace = useMemo(() => {
    if (!Number.isInteger(selectedPlaceId) || selectedPlaceId <= 0) return null;
    return PLACES.find((place) => place.id === selectedPlaceId) ?? null;
  }, [selectedPlaceId]);

  const selectedPlaceVisible = useMemo(() => {
    if (!selectedPlace?.name) return null;
    if (!filteredPlaces.some((p) => p.id === selectedPlace.id)) return null;
    return selectedPlace;
  }, [selectedPlace, filteredPlaces]);

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
    places: PLACES,
    filteredPlaces,
    selectedPlace: selectedPlaceVisible,
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
