export const PICKER_MAP_MESSAGE_TYPE = 'sportfind:picker:pinMoved';
export const PICKER_MAP_APP_MESSAGE_TYPE = 'sportfind:picker:command';

export const parsePickerMapMessage = (rawData) => {
  if (rawData == null || rawData === '') return null;

  try {
    const parsed = JSON.parse(String(rawData).trim());
    if (parsed?.type !== PICKER_MAP_MESSAGE_TYPE) return null;
    const lat = Number(parsed.lat);
    const lng = Number(parsed.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
};
