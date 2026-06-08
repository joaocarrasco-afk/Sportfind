import { formatarTempoRelativo } from './comentarioApi';

const API = process.env.EXPO_PUBLIC_API_URL;

async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function normalizarMensagens(raw) {
  const lista = Array.isArray(raw) ? raw : [];
  return lista
    .map((msg, index) => ({
      id: msg.id ?? `${msg.timestamp ?? index}-${msg.idUsuario ?? index}`,
      idUsuario: msg.idUsuario,
      texto: msg.mensagem ?? msg.texto ?? '',
      timestamp: msg.timestamp ?? 0,
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
}

function processarEventosSse(buffer, callback) {
  const partes = buffer.split('\n\n');
  const resto = partes.pop() ?? '';

  for (const parte of partes) {
    const linha = parte.split('\n').find((l) => l.startsWith('data: '));
    if (!linha) continue;
    try {
      callback(normalizarMensagens(JSON.parse(linha.slice(6))));
    } catch {
      /* ignora chunk inválido */
    }
  }

  return resto;
}

export async function buscarOuCriarChatPV(idUsuario, idOutroUsuario) {
  const res = await fetch(`${API}/chat/pv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idUsuario, idOutroUsuario }),
  });
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(data?.menssagem ?? data?.mensagem ?? 'Erro ao abrir conversa');
  }
  return data;
}

export async function enviarMensagem(idChat, idUsuario, mensagem) {
  const res = await fetch(`${API}/chat/${encodeURIComponent(idChat)}/mensagem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idUsuario, mensagem }),
  });
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(data?.menssagem ?? data?.mensagem ?? 'Erro ao enviar mensagem');
  }
  return data;
}

export function escutarMensagens(idChat, callback) {
  let cancelado = false;
  let buffer = '';
  let ultimoIndice = 0;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${API}/chat/${encodeURIComponent(idChat)}/mensagem`);
  xhr.setRequestHeader('Accept', 'text/event-stream');

  xhr.onprogress = () => {
    if (cancelado) return;
    const chunk = xhr.responseText.slice(ultimoIndice);
    ultimoIndice = xhr.responseText.length;
    buffer += chunk;
    buffer = processarEventosSse(buffer, callback);
  };

  xhr.onload = () => {
    if (cancelado) return;
    buffer += xhr.responseText.slice(ultimoIndice);
    processarEventosSse(`${buffer}\n\n`, callback);
  };

  xhr.onerror = () => {};

  xhr.send();

  return () => {
    cancelado = true;
    xhr.abort();
  };
}

export async function carregarPerfilUsuario(userId) {
  const res = await fetch(`${API}/usuario/perfil/${encodeURIComponent(userId)}`, {
    method: 'GET',
  });
  if (!res.ok) return null;
  const data = await res.json();
  return {
    id: userId,
    username: data?.username ?? data?.nome ?? 'Usuário',
    url: data?.url ?? null,
  };
}

export async function listarSeguidosComPerfil(seguindoIds) {
  const ids = Array.from(seguindoIds ?? []);
  if (ids.length === 0) return [];

  const perfis = await Promise.all(ids.map((id) => carregarPerfilUsuario(id)));
  return perfis.filter(Boolean);
}

export async function listarIdsChatsPV(idUsuario) {
  const res = await fetch(`${API}/chat/pv/${encodeURIComponent(idUsuario)}`, {
    method: 'GET',
  });
  if (!res.ok) return [];
  const data = await parseJson(res);
  return Array.isArray(data) ? data : [];
}

export async function listarContatosMensagens(authUid, seguindoIds) {
  const [idsChatsPv, idsSeguindo] = await Promise.all([
    listarIdsChatsPV(authUid),
    Promise.resolve(Array.from(seguindoIds ?? [])),
  ]);

  const idsUnicos = [...new Set([...idsSeguindo, ...idsChatsPv])].filter((id) => id !== authUid);
  if (idsUnicos.length === 0) return [];

  const perfis = await Promise.all(idsUnicos.map((id) => carregarPerfilUsuario(id)));
  return perfis
    .filter(Boolean)
    .sort((a, b) => a.username.localeCompare(b.username, 'pt-BR'));
}

export function formatarHoraMensagem(timestamp) {
  if (!timestamp) return '';
  const diff = Date.now() - timestamp;
  const dia = 86400000;
  if (diff < dia) {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  if (diff < dia * 2) return 'Ontem';
  return formatarTempoRelativo(new Date(timestamp).toISOString());
}
