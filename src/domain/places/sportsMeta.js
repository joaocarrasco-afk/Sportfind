/** Esportes que o usuário pode selecionar ao cadastrar (Poliesportivo é derivado). */
export const CREATABLE_SPORTS = [
  { id: 'Basquete', label: 'Basquete', emoji: '🏀' },
  { id: 'Skate', label: 'Skate', emoji: '🛹' },
  { id: 'Futebol', label: 'Futebol', emoji: '⚽' },
  { id: 'Tenis', label: 'Tênis', emoji: '🎾' },
];

const EMOJI_POR_ESPORTE = Object.fromEntries(CREATABLE_SPORTS.map((s) => [s.id, s.emoji]));

export const PLACE_EMOJI_POLIESPORTIVO = '🏟️';
export const PLACE_TYPE_POLIESPORTIVO = 'Poliesportivo';

/**
 * Define type e emoji do marcador no mapa conforme esportes selecionados.
 * Um esporte → ícone do esporte; dois ou mais → poliesportivo.
 */
export function resolvePlaceSportMeta(selectedSports = []) {
  const lista = [...new Set(selectedSports)].filter(Boolean);

  if (lista.length === 0) {
    return { type: PLACE_TYPE_POLIESPORTIVO, emoji: PLACE_EMOJI_POLIESPORTIVO, sports: [] };
  }

  if (lista.length >= 2) {
    return { type: PLACE_TYPE_POLIESPORTIVO, emoji: PLACE_EMOJI_POLIESPORTIVO, sports: lista };
  }

  const unico = lista[0];
  return {
    type: unico,
    emoji: EMOJI_POR_ESPORTE[unico] ?? '📍',
    sports: lista,
  };
}

/** Local aceita o esporte da partida (tipo igual, poliesportivo ou lista sports). */
export function formatPartidaData(data) {
  if (!(data instanceof Date) || Number.isNaN(data.getTime())) return '';
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function placeSupportsSport(place, sport) {
  if (!sport || !place) return false;
  if (place.type === PLACE_TYPE_POLIESPORTIVO) return true;
  if (place.type === sport) return true;
  if (Array.isArray(place.sports) && place.sports.includes(sport)) return true;
  return false;
}
