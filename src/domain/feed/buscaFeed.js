import { buscarUsuarios } from '../users';

export const FILTROS_BUSCA_FEED = [
  { id: 'todos', label: 'Todos' },
  { id: 'pessoas', label: 'Pessoas' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'posts', label: 'Posts' },
];

function normalizarTermo(termo) {
  return String(termo ?? '')
    .trim()
    .toLowerCase();
}

function combinaTermo(texto, termo) {
  if (!termo) return true;
  return String(texto ?? '')
    .toLowerCase()
    .includes(termo);
}

export function textoBuscaPost(post) {
  const partes = [
    post.username,
    post.descricao,
    post.nomePartida,
    post.esporte,
    post.horario,
    post.local?.name,
    post.local?.description,
    post.local?.address,
  ];
  return partes.filter(Boolean).join(' ');
}

export function filtrarEventos(publicacoes, termo) {
  const q = normalizarTermo(termo);
  return publicacoes.filter(
    (p) => p.kind === 'partida' && combinaTermo(textoBuscaPost(p), q),
  );
}

export function filtrarPostsFeed(publicacoes, termo) {
  const q = normalizarTermo(termo);
  return publicacoes.filter(
    (p) => p.kind !== 'partida' && combinaTermo(textoBuscaPost(p), q),
  );
}

export function filtrarPessoas(termo) {
  return buscarUsuarios(termo);
}

export function buscarNoFeed(publicacoes, termo) {
  return {
    pessoas: filtrarPessoas(termo),
    eventos: filtrarEventos(publicacoes, termo),
    posts: filtrarPostsFeed(publicacoes, termo),
  };
}

export function tituloPostBusca(post) {
  if (post.kind === 'partida') return post.nomePartida ?? 'Partida';
  if (post.kind === 'local') return post.local?.name ?? 'Local';
  return post.descricao?.slice(0, 60) || 'Publicação';
}

export function subtituloPostBusca(post) {
  if (post.kind === 'partida') {
    return `${post.esporte ?? ''} · ${post.horario ?? ''}`.replace(/^ · | · $/g, '').trim();
  }
  if (post.kind === 'local') {
    return `${post.username} · ${post.local?.distance ?? ''}`.trim();
  }
  return `${post.username} · ${post.dataCriacao ?? ''}`.trim();
}
