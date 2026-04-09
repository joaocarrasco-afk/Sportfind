export const MAP_WEB_MESSAGE_TYPE = 'sportfind:place:selected';

export const parseMapMessage = (rawData) => {
  if (rawData == null) {
    return null;
  }

  const asText = String(rawData);
  const numericId = Number(asText);
  if (Number.isFinite(numericId)) {
    return numericId;
  }

  try {
    const parsed = JSON.parse(asText);
    if (parsed?.type === MAP_WEB_MESSAGE_TYPE && Number.isFinite(Number(parsed.placeId))) {
      return Number(parsed.placeId);
    }
  } catch (error) {
    return null;
  }

  return null;
};

export const buildMapMessagePayload = (placeId) =>
  JSON.stringify({
    type: MAP_WEB_MESSAGE_TYPE,
    placeId,
  });
