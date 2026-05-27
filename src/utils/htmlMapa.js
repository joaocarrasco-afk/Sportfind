import { createMapHtml } from '../features/map/createMapHtml';

export const htmlMapa = (locais, userLocation = null) =>
  createMapHtml(
    locais.map((local) => ({
      id: local.id,
      lat: local.lat,
      lng: local.lng,
      color: local.color ?? local.cor,
      emoji: local.emoji,
    })),
    userLocation,
  );
