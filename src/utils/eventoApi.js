import { formatPartidaData } from '../domain/places';
import { formatarTempoRelativo } from './comentarioApi';

const API = process.env.EXPO_PUBLIC_API_URL;

async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function asDate(valor) {
  if (!valor) return null;
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function normalizarEventosParaFeed(eventos) {
  return (Array.isArray(eventos) ? eventos : []).map((evento) => {
    const dataEvento = asDate(evento.data_evento);
    return {
      id: evento.id,
      kind: 'partida',
      nomePartida: evento.nome ?? 'Partida',
      esporte: evento.esporte ?? '',
      horario: dataEvento ? formatPartidaData(dataEvento) : '',
      data: dataEvento,
      local: evento.local ?? null,
      username: evento.username ?? 'Usuário',
      userId: evento.adm ?? evento.userId ?? null,
      url_perfil: evento.url_perfil ?? null,
      dataCriacao: evento.dataCriacao
        ? formatarTempoRelativo(evento.dataCriacao)
        : 'Agora',
      likes: 0,
      comentarios: 0,
      maxParticipantes: evento.max_participantes > 0 ? evento.max_participantes : null,
      participantes: evento.participantes ?? [],
    };
  });
}

export function eventoParaDetalhes(evento) {
  const dataEvento = asDate(evento.data_evento);
  return {
    id: evento.id,
    nome: evento.nome ?? 'Partida',
    esporte: evento.esporte ?? '',
    data: dataEvento,
    place: evento.local
      ? {
          name: evento.local.name,
          address: evento.local.address,
          emoji: evento.local.emoji,
        }
      : null,
    maxParticipantes: evento.max_participantes > 0 ? evento.max_participantes : null,
    participantes: evento.participantes ?? [],
    autorUsername: evento.username ?? 'Usuário',
    admId: evento.adm ?? evento.userId ?? null,
  };
}

export async function carregarPerfisParticipantes(ids, authUid, usernameAtual) {
  const lista = Array.isArray(ids) ? ids : [];
  if (lista.length === 0) return [];

  const perfis = await Promise.all(
    lista.map(async (id) => {
      try {
        const res = await fetch(`${API}/usuario/perfil/${encodeURIComponent(id)}`, {
          method: 'GET',
        });
        if (!res.ok) {
          return {
            id,
            username: id === authUid ? usernameAtual ?? 'Você' : 'Usuário',
            url: null,
          };
        }
        const data = await res.json();
        return {
          id,
          username:
            id === authUid
              ? usernameAtual ?? data?.username ?? 'Você'
              : data?.username ?? data?.nome ?? 'Usuário',
          url: data?.url ?? null,
        };
      } catch {
        return {
          id,
          username: id === authUid ? usernameAtual ?? 'Você' : 'Usuário',
          url: null,
        };
      }
    }),
  );

  return perfis;
}

export async function criarEvento(payload) {
  const res = await fetch(`${API}/evento`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(data?.error ?? data?.mensagem ?? 'Erro ao criar partida');
  }
  return data;
}

export async function listarEventos() {
  const res = await fetch(`${API}/evento`, { method: 'GET' });
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(data?.error ?? 'Erro ao carregar partidas');
  }
  return Array.isArray(data) ? data : [];
}

export async function buscarEvento(eventoId) {
  const res = await fetch(`${API}/evento/${encodeURIComponent(eventoId)}`, {
    method: 'GET',
  });
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(data?.error ?? 'Partida não encontrada');
  }
  return data;
}

export async function participarEvento(eventoId, userId) {
  const res = await fetch(`${API}/evento/${encodeURIComponent(eventoId)}/participar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(data?.error ?? 'Erro ao participar da partida');
  }
  return data;
}
