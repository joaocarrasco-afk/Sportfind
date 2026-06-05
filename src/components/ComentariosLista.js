import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../../style';
import { colors } from '../../style/tokens';

function ComentarioItem({
  comentario,
  variant,
  userId,
  editando,
  textoEdicao,
  onChangeTextoEdicao,
  onSalvarEdicao,
  onCancelarEdicao,
  onResponder,
  onOpcoes,
  indent = false,
}) {
  const isFeed = variant === 'feed';
  const rowStyle = isFeed ? styles.feedCommentItem : styles.instaPostComentarioRow;
  const avatarStyle = isFeed ? styles.feedCommentAvatar : styles.instaPostComentarioAvatar;
  const iconSize = isFeed ? 16 : 14;
  const isProprio = userId && comentario.userId === userId;
  const emEdicao = editando?.id === comentario.id;

  return (
    <View style={[rowStyle, indent && { marginLeft: isFeed ? 28 : 24 }]}>
      <View style={avatarStyle}>
        <Ionicons name="person" size={iconSize} color={colors.purple} />
      </View>
      <View style={isFeed ? { flex: 1 } : styles.instaPostComentarioCorpo}>
        {emEdicao ? (
          <>
            <TextInput
              style={isFeed ? styles.feedCommentInput : styles.instaPostInput}
              value={textoEdicao}
              onChangeText={onChangeTextoEdicao}
              multiline
              autoFocus
            />
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
              <TouchableOpacity onPress={onSalvarEdicao}>
                <Text style={{ color: colors.purple, fontWeight: '600', fontSize: 13 }}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onCancelarEdicao}>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {isFeed ? (
              <>
                <Text style={styles.feedCommentAuthor}>{comentario.autor}</Text>
                <Text style={styles.feedCommentText}>{comentario.texto}</Text>
              </>
            ) : (
              <Text style={styles.instaPostComentarioTexto}>
                <Text style={styles.instaPostComentarioAutor}>{comentario.autor} </Text>
                {comentario.texto}
              </Text>
            )}
            <View style={isFeed ? { flexDirection: 'row', gap: 12, marginTop: 4 } : styles.instaPostComentarioMeta}>
              {comentario.tempo ? (
                <Text style={isFeed ? styles.feedCommentText : styles.instaPostComentarioTempo}>
                  {comentario.tempo}
                </Text>
              ) : null}
              {userId ? (
                <TouchableOpacity onPress={() => onResponder(comentario)}>
                  <Text style={isFeed ? styles.feedCommentText : styles.instaPostComentarioResponder}>
                    Responder
                  </Text>
                </TouchableOpacity>
              ) : null}
              {isProprio ? (
                <TouchableOpacity onPress={() => onOpcoes(comentario)}>
                  <Text style={isFeed ? styles.feedCommentText : styles.instaPostComentarioResponder}>
                    ···
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

export default function ComentariosLista({
  lista,
  carregando,
  variant = 'feed',
  userId,
  editando,
  textoEdicao,
  onChangeTextoEdicao,
  onSalvarEdicao,
  onCancelarEdicao,
  onResponder,
  onOpcoes,
  maxVisiveis,
}) {
  const visiveis = maxVisiveis != null ? lista.slice(0, maxVisiveis) : lista;

  if (carregando && lista.length === 0) {
    return (
      <View style={{ paddingVertical: 16, alignItems: 'center' }}>
        <ActivityIndicator color={colors.purple} />
      </View>
    );
  }

  if (lista.length === 0) {
    return (
      <Text
        style={
          variant === 'feed'
            ? [styles.feedCommentText, { textAlign: 'center', paddingVertical: 12 }]
            : [styles.instaPostComentarioTempo, { paddingVertical: 8 }]
        }
      >
        Nenhum comentário ainda. Seja o primeiro!
      </Text>
    );
  }

  return visiveis.map((c) => (
    <View key={c.id}>
      <ComentarioItem
        comentario={c}
        variant={variant}
        userId={userId}
        editando={editando}
        textoEdicao={textoEdicao}
        onChangeTextoEdicao={onChangeTextoEdicao}
        onSalvarEdicao={onSalvarEdicao}
        onCancelarEdicao={onCancelarEdicao}
        onResponder={onResponder}
        onOpcoes={onOpcoes}
      />
      {(c.respostas ?? []).map((r) => (
        <ComentarioItem
          key={r.id}
          comentario={{ ...r, comentarioPaiId: c.id }}
          variant={variant}
          userId={userId}
          editando={editando}
          textoEdicao={textoEdicao}
          onChangeTextoEdicao={onChangeTextoEdicao}
          onSalvarEdicao={onSalvarEdicao}
          onCancelarEdicao={onCancelarEdicao}
          onResponder={() => onResponder(c)}
          onOpcoes={onOpcoes}
          indent
        />
      ))}
    </View>
  ));
}

export function ComentarioInputBar({
  variant = 'feed',
  texto,
  onChangeText,
  onEnviar,
  enviando,
  respondendoA,
  onCancelarResposta,
  placeholder = 'Escreva um comentário...',
}) {
  const isFeed = variant === 'feed';

  return (
    <>
      {respondendoA ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: isFeed ? 16 : 12,
            paddingBottom: 6,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.textSecondary, flex: 1 }} numberOfLines={1}>
            Respondendo a {respondendoA.autor}
          </Text>
          <TouchableOpacity onPress={onCancelarResposta} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      ) : null}
      {isFeed ? (
        <View style={styles.feedCommentInputRow}>
          <TextInput
            style={styles.feedCommentInput}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={texto}
            onChangeText={onChangeText}
            onSubmitEditing={onEnviar}
            returnKeyType="send"
            editable={!enviando}
          />
          <TouchableOpacity
            style={[styles.feedCommentSendBtn, enviando && { opacity: 0.5 }]}
            onPress={onEnviar}
            disabled={enviando}
          >
            <Ionicons name="send" size={18} color={colors.textOnPurple} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.instaPostInputRow}>
          <Ionicons name="happy-outline" size={22} color={colors.textSecondary} />
          <TextInput
            style={styles.instaPostInput}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={texto}
            onChangeText={onChangeText}
            onSubmitEditing={onEnviar}
            returnKeyType="send"
            editable={!enviando}
          />
          {texto.trim() ? (
            <TouchableOpacity onPress={onEnviar} disabled={enviando}>
              <Text style={[styles.instaPostPostarBtn, enviando && { opacity: 0.5 }]}>Publicar</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </>
  );
}
