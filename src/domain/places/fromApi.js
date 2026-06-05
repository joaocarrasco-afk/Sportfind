import { resolvePlaceSportMeta } from './sportsMeta';

const DEFAULT_PLACE_IMAGE =
  'https://images.unsplash.com/photo-1556300673-04df21735615?w=800&auto=format&fit=crop&q=80';

function parseEsportes(type) {
  if (Array.isArray(type)) return type.filter(Boolean);
  if (typeof type !== 'string') return [];
  const t = type.trim();
  if (!t) return [];
  if (t.startsWith('[')) {
    try {
      const arr = JSON.parse(t);
      return Array.isArray(arr) ? arr.filter(Boolean) : [t];
    } catch {
      return [t];
    }
  }
  return [t];
}

function montarEndereco(endereco) {
  if (!endereco || typeof endereco !== 'object') return '';
  const { rua, numero, bairro, cidade, estado, cep } = endereco;
  const partes = [
    [rua, numero].filter(Boolean).join(', '),
    bairro,
    [cidade, estado].filter(Boolean).join(' - '),
    cep ? `CEP ${cep}` : '',
  ].filter(Boolean);
  return partes.join(' • ');
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(raw, lat, lng, userLocation) {
  if (typeof raw === 'string' && raw.trim() && raw !== '0') return raw;
  if (
    userLocation?.lat != null &&
    userLocation?.lng != null &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  ) {
    const km = haversineKm(userLocation.lat, userLocation.lng, lat, lng);
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
  }
  return '—';
}

/** Converte documento da API Firestore para o formato usado no app. */
export function fromApiLocalizacao(doc, userLocation = null) {
  const esportes = parseEsportes(doc.type);
  const meta = resolvePlaceSportMeta(esportes);
  const enderecoTexto = montarEndereco(doc.endereco);
  const lat = Number(doc.lat);
  const lng = Number(doc.lng);

  return {
    id: doc.id,
    name: doc.name?.trim() || 'Local',
    type: meta.type,
    sports: meta.sports,
    access: doc.access || 'Publico',
    emoji: doc.emoji || meta.emoji,
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    color: doc.color || '#9756CA',
    image: doc.imageurl || doc.image || DEFAULT_PLACE_IMAGE,
    distance: formatDistance(doc.distance, lat, lng, userLocation),
    description: doc.description?.trim() || enderecoTexto || 'Sem descrição.',
    address: enderecoTexto,
    endereco: doc.endereco ?? null,
    infraestrutura: Array.isArray(doc.infraestrutura) ? doc.infraestrutura : [],
  };
}

export function withPlaceDistances(places, userLocation) {
  if (!userLocation?.lat || !userLocation?.lng) return places;
  return places.map((place) => {
    if (!Number.isFinite(place.lat) || !Number.isFinite(place.lng)) return place;
    const km = haversineKm(userLocation.lat, userLocation.lng, place.lat, place.lng);
    const distance = km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
    return { ...place, distance };
  });
}
