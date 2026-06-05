import { isValidPlaceId } from '../../domain/places/placeIds';

export const MAP_WEB_MESSAGE_TYPE = 'sportfind:place:selected';

export const parseMapMessage = (rawData) => {
  if (rawData == null || rawData === '') {
    return null;
  }

  const asText = String(rawData).trim();

  try {
    const parsed = JSON.parse(asText);
    if (parsed?.type !== MAP_WEB_MESSAGE_TYPE) return null;

    const { placeId } = parsed;
    if (!isValidPlaceId(placeId)) return null;

    if (typeof placeId === 'number') return placeId;
    return String(placeId);
  } catch {
    /* mensagem não é JSON válido */
  }

  return null;
};

export const buildMapMessagePayload = (placeId) =>
  JSON.stringify({
    type: MAP_WEB_MESSAGE_TYPE,
    placeId,
  });
