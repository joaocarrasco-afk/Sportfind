import {
  buscarUsuarios,
  getUsuarioPorUsername,
  listarSeguidoresDoAtual,
  resolveUsuario,
} from '../src/domain/users';

describe('users domain', () => {
  it('não retorna usuários demo (lista vazia)', () => {
    expect(buscarUsuarios('marina')).toEqual([]);
  });

  it('resolve usuário por username retorna null sem dados demo', () => {
    expect(getUsuarioPorUsername('Marina')).toBeNull();
  });

  it('lista seguidores do usuário atual vazia sem dados demo', () => {
    expect(listarSeguidoresDoAtual()).toEqual([]);
  });

  it('resolve por userId retorna null sem dados demo', () => {
    expect(resolveUsuario({ userId: 'u-equipe' })).toBeNull();
  });
});
