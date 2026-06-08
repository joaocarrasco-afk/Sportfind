const API = process.env.EXPO_PUBLIC_API_URL;

async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function normalizarUsuario(raw) {
  if (!raw?.id) return null;
  return {
    id: raw.id,
    username: raw.username ?? 'Usuário',
    cidade: raw.cidade ?? '',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    url: raw.url ?? null,
  };
}

export async function buscarUsuariosApi(termo = '', { excluirId = null } = {}) {
  const q = String(termo ?? '').trim();
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (excluirId) params.set('excluir', excluirId);
  params.set('limite', q ? '20' : '8');

  const res = await fetch(`${API}/usuario/busca?${params.toString()}`, {
    method: 'GET',
  });
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(data?.mensagem ?? 'Não foi possível buscar usuários.');
  }

  const lista = Array.isArray(data) ? data : [];
  return lista.map(normalizarUsuario).filter(Boolean);
}
