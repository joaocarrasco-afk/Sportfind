const API = process.env.EXPO_PUBLIC_API_URL;

async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function normalizarComentario(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    postId: raw.postId,
    userId: raw.user ?? raw.userId,
    autor: raw.username ?? 'Usuário',
    url_perfil: raw.url_perfil ?? null,
    texto: raw.texto ?? '',
    dataCriacao: raw.dataCriacao ?? new Date().toISOString(),
    tempo: formatarTempoRelativo(raw.dataCriacao),
    comentarioPaiId: raw.comentarioPaiId ?? null,
    tipo: raw.tipo ?? 'comentario',
    respostas: [],
  };
}

export function formatarTempoRelativo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Agora';
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} d`;
  const sem = Math.floor(d / 7);
  if (sem < 5) return `${sem} sem`;
  const mes = Math.floor(d / 30);
  return `${mes} m`;
}

export async function listarComentarios(postId) {
  const res = await fetch(`${API}/comentarios/${encodeURIComponent(postId)}`);
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.menssagem ?? data?.mensagem ?? 'Erro ao carregar comentários');
  return (Array.isArray(data) ? data : []).map(normalizarComentario).filter(Boolean);
}

export async function listarRespostas(comentarioPaiId) {
  const res = await fetch(`${API}/respostas/${encodeURIComponent(comentarioPaiId)}`);
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.menssagem ?? data?.mensagem ?? 'Erro ao carregar respostas');
  return (Array.isArray(data) ? data : []).map(normalizarComentario).filter(Boolean);
}

export async function criarComentario(userId, postId, texto) {
  const res = await fetch(`${API}/comentario/${encodeURIComponent(userId)}/${encodeURIComponent(postId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto }),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.menssagem ?? data?.mensagem ?? 'Erro ao criar comentário');
  return normalizarComentario(data);
}

export async function responderComentario(userId, postId, comentarioPaiId, texto) {
  const res = await fetch(
    `${API}/resposta/${encodeURIComponent(postId)}/${encodeURIComponent(comentarioPaiId)}/${encodeURIComponent(userId)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto }),
    },
  );
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.menssagem ?? data?.mensagem ?? 'Erro ao responder comentário');
  return normalizarComentario(data);
}

export async function editarComentario(comentarioId, userId, texto) {
  const res = await fetch(`${API}/comentario/${encodeURIComponent(comentarioId)}/${encodeURIComponent(userId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto }),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.menssagem ?? data?.mensagem ?? 'Erro ao editar comentário');
  return data;
}

export async function deletarComentario(comentarioId, userId) {
  const res = await fetch(`${API}/comentario/${encodeURIComponent(comentarioId)}/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.menssagem ?? data?.mensagem ?? 'Erro ao deletar comentário');
  return data;
}

export async function carregarComentariosComRespostas(postId) {
  const comentarios = await listarComentarios(postId);
  return Promise.all(
    comentarios.map(async (c) => {
      const respostas = await listarRespostas(c.id);
      return { ...c, respostas };
    }),
  );
}

export function contarComentarios(lista) {
  return lista.reduce((n, c) => n + 1 + (c.respostas?.length ?? 0), 0);
}
