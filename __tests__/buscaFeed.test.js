import { buscarNoFeed, filtrarEventos, filtrarPostsFeed } from '../src/domain/feed/buscaFeed';
import { montarPublicacoesDemo } from '../src/domain/feed/feedDemo';

describe('buscaFeed', () => {
  const catalogo = montarPublicacoesDemo();

  it('filtra eventos por nome da partida', () => {
    const lista = filtrarEventos(catalogo, 'pelada');
    expect(lista.length).toBeGreaterThan(0);
    expect(lista.every((p) => p.kind === 'partida')).toBe(true);
  });

  it('filtra posts por descrição', () => {
    const lista = filtrarPostsFeed(catalogo, 'jogo');
    expect(lista.length).toBeGreaterThan(0);
    expect(lista.every((p) => p.kind !== 'partida')).toBe(true);
  });

  it('busca unificada retorna três categorias', () => {
    const r = buscarNoFeed(catalogo, 'marina');
    expect(r.pessoas.some((u) => u.username === 'Marina')).toBe(true);
  });
});
