import { TAB_IDS } from '../domain/places';
import { ehUsuarioAtual, resolveUsuario } from '../domain/users';

/**
 * Abre o perfil do usuário na stack atual ou vai à aba Perfil se for o usuário logado.
 */
export function abrirPerfilUsuario(navigation, { userId, username, authUid }) {
  const usuarioDemo = resolveUsuario({ userId, username });
  const idAlvo = userId ?? usuarioDemo?.id;
  if (!idAlvo) return false;

  const ehProprioPerfil =
    (authUid && idAlvo === authUid) || (usuarioDemo && ehUsuarioAtual(usuarioDemo));

  if (ehProprioPerfil) {
    const parent = navigation.getParent?.();
    if (parent?.navigate) {
      parent.navigate(TAB_IDS.PROFILE, { screen: 'PerfilPrincipal' });
    } else {
      navigation.navigate(TAB_IDS.PROFILE, { screen: 'PerfilPrincipal' });
    }
    return true;
  }

  navigation.navigate('TelaPerfilUsuario', { userId: idAlvo });
  return true;
}
