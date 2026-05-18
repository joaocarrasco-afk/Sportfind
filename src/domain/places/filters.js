export const FILTER_ALL = 'Todos';

/** Esportes selecionáveis (multi-filtro; vazio = todos) */
export const SPORT_FILTERS = ['Basquete', 'Skate', 'Futebol', 'Tenis', 'Poliesportivo'];

/** @deprecated use SPORT_FILTERS — mantido para compatibilidade */
export const PLACE_TYPE_FILTERS = [FILTER_ALL, ...SPORT_FILTERS];

export const ACCESS_FILTERS = [FILTER_ALL, 'Publico', 'Privado', 'Temporario'];
