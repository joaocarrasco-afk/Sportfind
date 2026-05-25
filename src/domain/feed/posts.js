import { CREATABLE_SPORTS } from '../places/sportsMeta';

export function rotuloEsporte(esporte) {
  const found = CREATABLE_SPORTS.find((s) => s.id === esporte);
  if (found) return found.label;
  return esporte === 'Tenis' ? 'Tênis' : esporte ?? '';
}

export function emojiEsporte(esporte) {
  const found = CREATABLE_SPORTS.find((s) => s.id === esporte);
  return found?.emoji ?? '🏅';
}

/** Converte uma partida do estado global em item do feed. */
export function partidaParaFeedPost(partida, username = 'Você') {
  return {
    id: partida.id,
    kind: 'partida',
    nomePartida: partida.nome,
    esporte: partida.esporte,
    horario: partida.dataLabel,
    local: partida.place,
    username,
    dataCriacao: partida.criadoEm ?? 'Agora',
    likes: partida.likes ?? 0,
    comentarios: partida.comentarios ?? 0,
    maxParticipantes: partida.maxParticipantes ?? null,
    participantes: partida.participantes ?? [],
  };
}
