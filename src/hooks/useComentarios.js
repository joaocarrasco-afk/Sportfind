import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import {
  carregarComentariosComRespostas,
  contarComentarios,
  criarComentario,
  deletarComentario,
  editarComentario,
  formatarTempoRelativo,
  responderComentario,
} from '../utils/comentarioApi';

export function useComentarios(postId, { userId, username, enabled = true, contagemInicial = 0 } = {}) {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [respondendoA, setRespondendoA] = useState(null);
  const [editando, setEditando] = useState(null);
  const [texto, setTexto] = useState('');
  const [textoEdicao, setTextoEdicao] = useState('');

  const total = useMemo(() => {
    if (lista.length === 0) return contagemInicial;
    return contarComentarios(lista);
  }, [lista, contagemInicial]);

  const carregar = useCallback(async () => {
    if (!postId || !enabled) return;
    setCarregando(true);
    try {
      const comRespostas = await carregarComentariosComRespostas(postId);
      setLista(comRespostas);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setCarregando(false);
    }
  }, [postId, enabled]);

  useEffect(() => {
    if (!enabled) return;
    carregar();
  }, [carregar, enabled]);

  useEffect(() => {
    if (!enabled) {
      setRespondendoA(null);
      setEditando(null);
      setTexto('');
      setTextoEdicao('');
    }
  }, [enabled]);

  function limparResposta() {
    setRespondendoA(null);
  }

  async function enviar() {
    const conteudo = texto.trim();
    if (!conteudo || !postId) return;

    if (!userId) {
      Alert.alert('Comentários', 'Faça login para comentar.');
      return;
    }

    setEnviando(true);
    try {
      if (respondendoA) {
        const resposta = await responderComentario(userId, postId, respondendoA.id, conteudo);
        setLista((prev) =>
          prev.map((c) =>
            c.id === respondendoA.id
              ? { ...c, respostas: [...(c.respostas ?? []), resposta] }
              : c,
          ),
        );
        setRespondendoA(null);
      } else {
        const novo = await criarComentario(userId, postId, conteudo);
        if (!novo.autor || novo.autor === 'Usuário') {
          novo.autor = username ?? 'Você';
        }
        setLista((prev) => [...prev, { ...novo, respostas: [] }]);
      }
      setTexto('');
    } catch (error) {
      Alert.alert('Comentários', error.message ?? 'Não foi possível enviar o comentário.');
    } finally {
      setEnviando(false);
    }
  }

  function iniciarEdicao(comentario) {
    setEditando(comentario);
    setTextoEdicao(comentario.texto);
    setRespondendoA(null);
  }

  function cancelarEdicao() {
    setEditando(null);
    setTextoEdicao('');
  }

  async function salvarEdicao() {
    const conteudo = textoEdicao.trim();
    if (!editando || !conteudo || !userId) return;

    setEnviando(true);
    try {
      await editarComentario(editando.id, userId, conteudo);
      const atualizado = {
        ...editando,
        texto: conteudo,
        tempo: formatarTempoRelativo(new Date().toISOString()),
      };

      if (editando.comentarioPaiId) {
        setLista((prev) =>
          prev.map((c) =>
            c.id === editando.comentarioPaiId
              ? {
                  ...c,
                  respostas: (c.respostas ?? []).map((r) =>
                    r.id === editando.id ? { ...r, ...atualizado } : r,
                  ),
                }
              : c,
          ),
        );
      } else {
        setLista((prev) =>
          prev.map((c) => (c.id === editando.id ? { ...c, ...atualizado } : c)),
        );
      }
      cancelarEdicao();
    } catch (error) {
      Alert.alert('Comentários', error.message ?? 'Não foi possível editar o comentário.');
    } finally {
      setEnviando(false);
    }
  }

  function confirmarExclusao(comentario) {
    Alert.alert('Excluir comentário', 'Deseja excluir este comentário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => excluir(comentario),
      },
    ]);
  }

  async function excluir(comentario) {
    if (!userId) return;

    setEnviando(true);
    try {
      const resultado = await deletarComentario(comentario.id, userId);

      if (comentario.comentarioPaiId) {
        setLista((prev) =>
          prev.map((c) =>
            c.id === comentario.comentarioPaiId
              ? { ...c, respostas: (c.respostas ?? []).filter((r) => r.id !== comentario.id) }
              : c,
          ),
        );
      } else {
        setLista((prev) => prev.filter((c) => c.id !== comentario.id));
      }

      if (editando?.id === comentario.id) cancelarEdicao();
      if (respondendoA?.id === comentario.id) limparResposta();
    } catch (error) {
      Alert.alert('Comentários', error.message ?? 'Não foi possível excluir o comentário.');
    } finally {
      setEnviando(false);
    }
  }

  function opcoesComentario(comentario) {
    if (!userId || comentario.userId !== userId) return;
    Alert.alert('Seu comentário', undefined, [
      { text: 'Editar', onPress: () => iniciarEdicao(comentario) },
      { text: 'Excluir', style: 'destructive', onPress: () => confirmarExclusao(comentario) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  return {
    lista,
    total,
    carregando,
    enviando,
    respondendoA,
    setRespondendoA,
    limparResposta,
    editando,
    texto,
    setTexto,
    textoEdicao,
    setTextoEdicao,
    enviar,
    salvarEdicao,
    cancelarEdicao,
    opcoesComentario,
    recarregar: carregar,
  };
}
