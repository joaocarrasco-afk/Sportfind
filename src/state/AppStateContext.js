import { createContext, useContext, useMemo, useState } from 'react';
import { FILTER_ALL, filterPlaces, PLACES } from '../domain/places';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  /** UID do usuário após login/cadastro — usado em chamadas como GET /usuario/perfil/:id */
  const [authUid, setAuthUid] = useState(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [typeFilter, setTypeFilter] = useState(FILTER_ALL);
  const [accessFilter, setAccessFilter] = useState(FILTER_ALL);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filteredPlaces = useMemo(
    () =>
      filterPlaces({
        places: PLACES,
        typeFilter,
        accessFilter,
        search,
      }),
    [typeFilter, accessFilter, search],
  );

  const selectedPlace = useMemo(
    () => PLACES.find((place) => place.id === selectedPlaceId) ?? null,
    [selectedPlaceId],
  );

  const resetFilters = () => {
    setTypeFilter(FILTER_ALL);
    setAccessFilter(FILTER_ALL);
  };

  const value = {
    authUid,
    setAuthUid,
    places: PLACES,
    filteredPlaces,
    selectedPlace,
    selectedPlaceId,
    setSelectedPlaceId,
    typeFilter,
    setTypeFilter,
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
