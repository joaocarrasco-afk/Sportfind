import {
  buscarUsuarios,
  getUsuarioPorUsername,
  listarSeguidoresDoAtual,
  resolveUsuario,
} from '../src/domain/users';

describe('users domain', () => {
  it('resolve usuário por username', () => {
    const u = getUsuarioPorUsername('Marina');
    expect(u?.id).toBe('u-marina');
  });

  it('busca usuários por termo', () => {
    const lista = buscarUsuarios('joão');
    expect(lista.some((u) => u.username === 'João')).toBe(true);
  });

  it('lista seguidores do usuário atual', () => {
    expect(listarSeguidoresDoAtual().length).toBeGreaterThan(0);
  });

  it('resolve por userId', () => {
    expect(resolveUsuario({ userId: 'u-equipe' })?.username).toBe('Equipe Sportfind');
  });
});
