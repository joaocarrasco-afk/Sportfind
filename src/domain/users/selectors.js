import { USUARIO_ATUAL_ID, USUARIOS_DEMO } from './users';

const porId = new Map(USUARIOS_DEMO.map((u) => [u.id, u]));
const porUsername = new Map(USUARIOS_DEMO.map((u) => [u.username.toLowerCase(), u]));

export function getUsuarioPorId(id) {
  if (!id) return null;
  return porId.get(id) ?? null;
}

export function getUsuarioPorUsername(username) {
  if (!username) return null;
  const chave = String(username).trim().toLowerCase();
  if (chave === 'você') return porId.get(USUARIO_ATUAL_ID) ?? null;
  return porUsername.get(chave) ?? null;
}

export function resolveUsuario({ userId, username }) {
  if (userId) return getUsuarioPorId(userId);
  return getUsuarioPorUsername(username);
}

export function ehUsuarioAtual(usuario) {
  return usuario?.id === USUARIO_ATUAL_ID;
}

export function buscarUsuarios(termo, { excluirAtual = true } = {}) {
  const q = String(termo ?? '')
    .trim()
    .toLowerCase();
  return USUARIOS_DEMO.filter((u) => {
    if (excluirAtual && u.id === USUARIO_ATUAL_ID) return false;
    if (!q) return true;
    return (
      u.username.toLowerCase().includes(q) ||
      u.tags.some((t) => t.toLowerCase().includes(q)) ||
      u.cidade.toLowerCase().includes(q)
    );
  });
}

export function listarSeguidoresDoAtual() {
  const eu = getUsuarioPorId(USUARIO_ATUAL_ID);
  if (!eu) return [];
  return eu.seguidoresIds.map(getUsuarioPorId).filter(Boolean);
}

export function listarSeguindoDoAtual() {
  const eu = getUsuarioPorId(USUARIO_ATUAL_ID);
  if (!eu) return [];
  return eu.seguindoIds.map(getUsuarioPorId).filter(Boolean);
}

export function contagemConexoesAtual() {
  const eu = getUsuarioPorId(USUARIO_ATUAL_ID);
  return {
    seguidores: eu?.seguidoresIds?.length ?? 0,
    seguindo: eu?.seguindoIds?.length ?? 0,
  };
}

/** Mapeia nome exibido no feed/chat para id de usuário demo */
export function usernameParaUserId(username) {
  return getUsuarioPorUsername(username)?.id ?? null;
}
