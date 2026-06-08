import { TAB_IDS } from '../domain/places';

/**
 * Abre o perfil do usuário na stack atual ou vai à aba Perfil se for o usuário logado.
 */
export function abrirPerfilUsuario(navigation, { userId, authUid }) {
  if (!userId) return false;

  if (authUid && userId === authUid) {
    const parent = navigation.getParent?.();
    if (parent?.navigate) {
      parent.navigate(TAB_IDS.PROFILE, { screen: 'PerfilPrincipal' });
    } else {
      navigation.navigate(TAB_IDS.PROFILE, { screen: 'PerfilPrincipal' });
    }
    return true;
  }

  navigation.navigate('TelaPerfilUsuario', { userId });
  return true;
}
