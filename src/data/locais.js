import {
  ACCESS_FILTERS,
  BOTTOM_TABS,
  PLACE_TYPE_FILTERS,
  TAB_CONTENT,
  toLegacyPlaces,
  PLACES,
} from '../domain/places';

export const LOCAIS = toLegacyPlaces(PLACES).map((place) => ({
  ...place,
  acesso: place.acesso === 'Publico' ? 'Público' : place.acesso,
  tipo: place.tipo === 'Tenis' ? 'Tênis' : place.tipo,
}));

export const FILTROS_TIPO = PLACE_TYPE_FILTERS.map((type) => (type === 'Tenis' ? 'Tênis' : type));
export const FILTROS_ACESSO = ACCESS_FILTERS.map((access) =>
  access === 'Publico' ? 'Público' : access,
);

export const ABAS = BOTTOM_TABS.map((tab) => ({ id: tab.id, rotulo: tab.label, icone: tab.icon }));

export const CONTEUDO_ABAS = Object.fromEntries(
  Object.entries(TAB_CONTENT).map(([tabId, content]) => [
    tabId,
    {
      icone: content.icon,
      titulo: content.title,
      sub: content.subtitle,
    },
  ]),
);
