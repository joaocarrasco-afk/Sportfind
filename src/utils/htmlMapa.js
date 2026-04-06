import { createMapHtml } from '../features/map/createMapHtml';

export const htmlMapa = (locais) =>
  createMapHtml(
    locais.map((local) => ({
      id: local.id,
      lat: local.lat,
      lng: local.lng,
      color: local.cor,
      emoji: local.emoji,
    })),
  );
