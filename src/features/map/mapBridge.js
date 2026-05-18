export const MAP_WEB_MESSAGE_TYPE = 'sportfind:place:selected';

export const parseMapMessage = (rawData) => {
  if (rawData == null || rawData === '') {
    return null;
  }

  const asText = String(rawData).trim();

  try {
    const parsed = JSON.parse(asText);
    if (
      parsed?.type === MAP_WEB_MESSAGE_TYPE &&
      Number.isInteger(Number(parsed.placeId)) &&
      Number(parsed.placeId) > 0
    ) {
      return Number(parsed.placeId);
    }
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
