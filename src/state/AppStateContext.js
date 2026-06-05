import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as Location from 'expo-location';
import {
  FILTER_ALL,
  filterPlaces,
  findPlaceById,
  formatPartidaData,
  fromApiLocalizacao,
  INITIAL_PLACES,
  resolvePlaceSportMeta,
  samePlaceId,
  withPlaceDistances,
} from '../domain/places';
import { partidaParaFeedPost } from '../domain/feed/posts';

const AppStateContext = createContext(null);

const DEFAULT_PLACE_IMAGE =
  'https://images.unsplash.com/photo-1556300673-04df21735615?w=800&auto=format&fit=crop&q=80';
const MAP_CENTER = { lat: -23.5445, lng: -46.3106 };

export function AppStateProvider({ children }) {
  const [authUid, setAuthUid] = useState(null);
  const [username, setUsername] = useState('Você');
  const [userLocation, setUserLocation] = useState(null); // { lat, lng, accuracy?, timestamp? }
  const [places, setPlaces] = useState(INITIAL_PLACES);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [sportFilters, setSportFilters] = useState([]);
  const [infraFilters, setInfraFilters] = useState([]);
  const [accessFilter, setAccessFilter] = useState(FILTER_ALL);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [partidas, setPartidas] = useState([]);
  const [seguindo, setSeguindo] = useState(() => new Set());
  const [postsPerfil, setPostsPerfil] = useState([]);

  const refreshPlaces = useCallback(async () => {
    setPlacesLoading(true);
    try {
      const res = await fetch(`${process.env.API_URL}/localizacao`);
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data)) return;

      const fromApi = data
        .map((doc) => fromApiLocalizacao(doc))
        .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));

      setPlaces((prev) => {
        const locaisCriadosNoApp = prev.filter((p) => typeof p.id === 'number');
        return [...fromApi, ...locaisCriadosNoApp];
      });
    } catch {
      /* mantém locais em cache se a API estiver indisponível */
    } finally {
      setPlacesLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPlaces();
  }, [refreshPlaces]);

  useEffect(() => {
    if (!userLocation?.lat || !userLocation?.lng) return;
    setPlaces((prev) => withPlaceDistances(prev, userLocation));
  }, [userLocation?.lat, userLocation?.lng]);

  const refreshUserLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return null;

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (!pos?.coords) return null;

      const next = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy ?? null,
        timestamp: pos.timestamp ?? Date.now(),
      };
      setUserLocation(next);
      return next;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    // Melhor esforço: tenta obter a localização no boot (sem bloquear o app).
    refreshUserLocation();
  }, [refreshUserLocation]);

  const filteredPlaces = useMemo(
    () =>
      filterPlaces({
        places,
        sportFilters,
        infraFilters,
        accessFilter,
        search,
      }),
    [places, sportFilters, infraFilters, accessFilter, search],
  );

  const selectedPlace = useMemo(
    () => findPlaceById(places, selectedPlaceId),
    [selectedPlaceId, places],
  );

  function montarEnderecoCompleto(endereco) {
    if (!endereco) return '';
    const { rua, numero, bairro, cidade, estado, cep } = endereco;
    const partes = [
      [rua, numero].filter(Boolean).join(', '),
      bairro,
      [cidade, estado].filter(Boolean).join(' - '),
      cep ? `CEP ${cep}` : '',
    ].filter(Boolean);
    return partes.join(' • ');
  }

  function addPlace(dados) {
    const esportes = dados.sports ?? [];
    const meta = resolvePlaceSportMeta(esportes);
    const maxId = places.reduce((max, p) => Math.max(max, p.id), 0);
    const offset = (maxId % 10) * 0.0008;
    const enderecoTexto =
      dados.address?.trim() ||
      montarEnderecoCompleto(dados.endereco) ||
      'Endereço não informado';

    const novo = {
      id: maxId + 1,
      name: dados.name.trim(),
      address: enderecoTexto,
      endereco: dados.endereco,
      type: meta.type,
      emoji: meta.emoji,
      sports: meta.sports,
      access: dados.access,
      lat: dados.lat ?? MAP_CENTER.lat + offset,
      lng: dados.lng ?? MAP_CENTER.lng + offset,
      color: '#9756CA',
      image: dados.image ?? DEFAULT_PLACE_IMAGE,
      distance: '—',
      description: dados.description?.trim() || enderecoTexto,
      infraestrutura: dados.infraestrutura ?? [],
    };

    setPlaces((prev) => [...prev, novo]);
    return novo;
  }

  function addPartida({ nome, esporte, data, placeId, maxParticipantes, autorUsername }) {
    const place = findPlaceById(places, placeId);
    if (!place) return null;

    const id = `partida-${Date.now()}`;
    const dataLabel = formatPartidaData(data);
    const autor = autorUsername ?? username ?? 'Você';
    const partida = {
      id,
      nome: nome.trim(),
      esporte,
      data,
      dataLabel,
      placeId,
      place,
      maxParticipantes: maxParticipantes > 0 ? maxParticipantes : null,
      participantes: [],
      criadoEm: 'Agora',
      autorUsername: autor,
      likes: 0,
      comentarios: 0,
    };

    setPartidas((prev) => [partida, ...prev]);
    return partida;
  }

  const postsPartidasFeed = useMemo(
    () => partidas.map((p) => partidaParaFeedPost(p, p.autorUsername)),
    [partidas],
  );

  const participarPartida = useCallback((partidaId) => {
    setPartidas((prev) =>
      prev.map((p) => {
        if (p.id !== partidaId) return p;
        if (p.participantes.includes('voce')) return p;
        if (p.maxParticipantes != null && p.participantes.length >= p.maxParticipantes) {
          return p;
        }
        return { ...p, participantes: [...p.participantes, 'voce'] };
      }),
    );
  }, []);

  const desistirPartida = useCallback((partidaId) => {
    setPartidas((prev) =>
      prev.map((p) => {
        if (p.id !== partidaId) return p;
        return { ...p, participantes: p.participantes.filter((x) => x !== 'voce') };
      }),
    );
  }, []);

  const alternarSeguir = useCallback((autor) => {
    if (!autor) return;
    setSeguindo((prev) => {
      const next = new Set(prev);
      if (next.has(autor)) next.delete(autor);
      else next.add(autor);
      return next;
    });
  }, []);

  function addPostPerfil(post) {
    const novo = {
      id: `perfil-${Date.now()}`,
      tipo: post.tipo ?? 'imagem',
      url: post.url,
      descricao: post.descricao?.trim() ?? '',
      dataCriacao: 'Agora',
      ...post,
    };
    setPostsPerfil((prev) => [novo, ...prev]);
    return novo;
  }

  function atualizarPostPerfil(id, dados) {
    setPostsPerfil((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...dados, descricao: dados.descricao?.trim() ?? p.descricao } : p)),
    );
  }

  function removerPostPerfil(id) {
    setPostsPerfil((prev) => prev.filter((p) => p.id !== id));
  }

  function logout() {
    setAuthUid(null);
    setUsername('Você');
  }

  const selectedPlaceForDetail = useMemo(
    () => findPlaceById(places, selectedPlaceId),
    [selectedPlaceId, places],
  );

  useEffect(() => {
    if (
      selectedPlaceId != null &&
      !filteredPlaces.some((place) => samePlaceId(place.id, selectedPlaceId))
    ) {
      setSelectedPlaceId(null);
    }
  }, [filteredPlaces, selectedPlaceId]);

  const toggleSportFilter = (sport) => {
    setSportFilters((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport],
    );
  };

  const applyFilters = (sports, access, infra = []) => {
    setSportFilters(sports);
    setAccessFilter(access);
    setInfraFilters(infra);
  };

  const resetFilters = () => {
    setSportFilters([]);
    setInfraFilters([]);
    setAccessFilter(FILTER_ALL);
  };

  const toggleInfraFilter = (infraId) => {
    setInfraFilters((prev) =>
      prev.includes(infraId) ? prev.filter((id) => id !== infraId) : [...prev, infraId],
    );
  };

  const value = {
    authUid,
    setAuthUid,
    username,
    setUsername,
    userLocation,
    refreshUserLocation,
    places,
    placesLoading,
    refreshPlaces,
    filteredPlaces,
    addPlace,
    partidas,
    postsPartidasFeed,
    addPartida,
    participarPartida,
    desistirPartida,
    seguindo,
    alternarSeguir,
    postsPerfil,
    addPostPerfil,
    atualizarPostPerfil,
    removerPostPerfil,
    logout,
    selectedPlace: selectedPlaceForDetail,
    selectedPlaceId,
    setSelectedPlaceId,
    sportFilters,
    infraFilters,
    toggleSportFilter,
    toggleInfraFilter,
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
