import { TAB_IDS } from '../domain/places';
import { ehUsuarioAtual, resolveUsuario } from '../domain/users';

/**
 * Abre o perfil do usuário na stack atual ou vai à aba Perfil se for o usuário logado.
 */
export function abrirPerfilUsuario(navigation, { userId, username }) {
  const usuario = resolveUsuario({ userId, username });
  if (!usuario) return false;

  if (ehUsuarioAtual(usuario)) {
    const parent = navigation.getParent?.();
    if (parent?.navigate) {
      parent.navigate(TAB_IDS.PROFILE, { screen: 'PerfilPrincipal' });
    } else {
      navigation.navigate(TAB_IDS.PROFILE, { screen: 'PerfilPrincipal' });
    }
    return true;
  }

  navigation.navigate('TelaPerfilUsuario', { userId: usuario.id });
  return true;
}
