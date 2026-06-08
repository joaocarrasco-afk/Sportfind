import { buscarNoFeed, filtrarEventos, filtrarPostsFeed } from '../src/domain/feed/buscaFeed';

const CATALOGO_FIXTURE = [
  {
    id: 'partida-1',
    kind: 'partida',
    nomePartida: 'Pelada de sábado',
    esporte: 'Futebol',
    username: 'Marina',
    descricao: 'Venha jogar',
  },
  {
    id: 'post-1',
    kind: 'imagem',
    username: 'João',
    descricao: 'Melhor jogo do mês',
  },
  {
    id: 'local-1',
    kind: 'local',
    username: 'Marina',
    descricao: 'Quadra municipal',
    local: { name: 'Quadra Municipal' },
  },
];

describe('buscaFeed', () => {
  it('filtra eventos por nome da partida', () => {
    const lista = filtrarEventos(CATALOGO_FIXTURE, 'pelada');
    expect(lista.length).toBeGreaterThan(0);
    expect(lista.every((p) => p.kind === 'partida')).toBe(true);
  });

  it('filtra posts por descrição', () => {
    const lista = filtrarPostsFeed(CATALOGO_FIXTURE, 'jogo');
    expect(lista.length).toBeGreaterThan(0);
    expect(lista.every((p) => p.kind !== 'partida')).toBe(true);
  });

  it('busca unificada retorna três categorias', () => {
    const r = buscarNoFeed(CATALOGO_FIXTURE, 'marina');
    expect(Array.isArray(r.pessoas)).toBe(true);
    expect(r.eventos.length + r.posts.length).toBeGreaterThan(0);
  });
});
