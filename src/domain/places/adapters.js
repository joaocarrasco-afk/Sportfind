export const toLegacyPlace = (place) => ({
  id: place.id,
  nome: place.name,
  tipo: place.type,
  distancia: place.distance,
  acesso: place.access,
  emoji: place.emoji,
  lat: place.lat,
  lng: place.lng,
  cor: place.color,
  imagem: place.image,
  descricao: place.description,
});

export const toLegacyPlaces = (places) => places.map(toLegacyPlace);
