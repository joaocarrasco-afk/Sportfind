/** Compara IDs numéricos (seed/local) e strings (Firestore). */
export function samePlaceId(a, b) {
  if (a == null || b == null || a === '' || b === '') return false;
  return String(a) === String(b);
}

export function findPlaceById(places, id) {
  if (id == null || id === '') return null;
  return places.find((place) => samePlaceId(place.id, id)) ?? null;
}

export function isValidPlaceId(id) {
  if (id == null || id === '') return false;
  if (typeof id === 'number') return Number.isInteger(id) && id > 0;
  if (typeof id === 'string') return id.trim().length > 0;
  return false;
}
