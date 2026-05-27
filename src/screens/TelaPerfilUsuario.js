import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import PerfilPostModal from '../components/PerfilPostModal';
import ScreenSafe from '../components/ScreenSafe';
import { getUsuarioPorId } from '../domain/users';
import { useAppState } from '../state/AppStateContext';
import styles from '../../style';
import { colors } from '../../style/tokens';

const ABAS = [
  { id: 'pub', label: 'Publicações' },
  { id: 'trophy', label: 'Troféus' },
];

export default function TelaPerfilUsuario({ navigation }) {
  const route = useRoute();
  const userId = route.params?.userId;
  const usuario = useMemo(() => getUsuarioPorId(userId), [userId]);
  const { seguindo, alternarSeguir } = useAppState();
  const [aba, setAba] = useState('pub');
  const [postSelecionado, setPostSelecionado] = useState(null);

  const jaSeguindo = usuario ? seguindo.has(usuario.username) : false;
  const publicacoes = usuario?.publicacoes ?? [];

  if (!usuario) {
    return (
      <ScreenSafe style={styles.usuarioScreen} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.conexoesHeader}>
          <TouchableOpacity style={styles.messageBackBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.purple} />
          </TouchableOpacity>
          <Text style={styles.conexoesHeaderTitle}>Perfil</Text>
          <View style={styles.messageHeaderSpacer} />
        </View>
        <View style={styles.userSearchEmpty}>
          <Text style={styles.userSearchEmptyText}>Usuário não encontrado.</Text>
        </View>
      </ScreenSafe>
    );
  }

  function renderCelulaGrid(post) {
    const ehPartida = post.tipo === 'partida';
    const temImagem = Boolean(post.url);

    return (
      <Pressable
        key={post.id}
        style={styles.usuarioFeedCell}
        onPress={() => setPostSelecionado(post)}
      >
        <View
          style={[
            styles.usuarioFeedCellInner,
            ehPartida && !temImagem && styles.usuarioFeedCellPartida,
          ]}
        >
          {temImagem ? (
            <Image source={{ uri: post.url }} style={styles.usuarioFeedCellImage} resizeMode="cover" />
          ) : (
            <Ionicons
              name={ehPartida ? 'football' : 'image-outline'}
              size={32}
              color={ehPartida ? colors.purple : colors.purpleLight}
            />
          )}
          {ehPartida ? (
            <View style={styles.usuarioFeedCellBadge}>
              <Text style={styles.usuarioFeedCellBadgeText}>Partida</Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    );
  }

  return (
    <ScreenSafe style={styles.usuarioScreen} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.perfilOutroTopBar}>
        <TouchableOpacity style={styles.messageBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.purple} />
        </TouchableOpacity>
        <Text style={styles.perfilOutroTopTitle} numberOfLines={1}>
          {usuario.username}
        </Text>
        <View style={styles.messageHeaderSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.usuarioAvatarWrap}>
          <View style={styles.usuarioAvatar}>
            <Text style={styles.perfilOutroAvatarLetter}>{usuario.username.charAt(0)}</Text>
          </View>
        </View>

        <Text style={styles.usuarioName}>{usuario.username}</Text>
        <View style={styles.usuarioLocationRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.usuarioLocationText, { marginLeft: 4 }]}>{usuario.cidade}</Text>
        </View>

        {usuario.bio ? <Text style={styles.perfilOutroBio}>{usuario.bio}</Text> : null}

        <View style={styles.usuarioTagsRow}>
          {usuario.tags.map((t) => (
            <View key={t} style={styles.usuarioTagPill}>
              <Text style={styles.usuarioTagText}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={styles.usuarioStatsRow}>
          <View style={styles.usuarioStatBlock}>
            <Text style={styles.usuarioStatValue}>{usuario.seguidoresIds.length}</Text>
            <Text style={styles.usuarioStatLabel}>Seguidores</Text>
          </View>
          <View style={styles.usuarioStatBlock}>
            <Text style={styles.usuarioStatValue}>{usuario.seguindoIds.length}</Text>
            <Text style={styles.usuarioStatLabel}>Seguindo</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.perfilOutroFollowBtn, jaSeguindo && styles.perfilOutroFollowBtnActive]}
          onPress={() => alternarSeguir(usuario.username)}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.perfilOutroFollowBtnText,
              jaSeguindo && styles.perfilOutroFollowBtnTextActive,
            ]}
          >
            {jaSeguindo ? 'Seguindo' : 'Seguir'}
          </Text>
        </TouchableOpacity>

        <View style={styles.usuarioTabBar}>
          {ABAS.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.usuarioTabBtn, aba === t.id && styles.usuarioTabBtnActive]}
              onPress={() => setAba(t.id)}
            >
              <Text style={[styles.usuarioTabText, aba === t.id && styles.usuarioTabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.usuarioFeedSection}>
          {aba === 'pub' ? (
            publicacoes.length > 0 ? (
              <View style={styles.usuarioFeedGrid}>{publicacoes.map(renderCelulaGrid)}</View>
            ) : (
              <View style={styles.usuarioEmptyTab}>
                <Ionicons name="images-outline" size={36} color={colors.purpleLight} />
                <Text style={styles.usuarioEmptyTabText}>Nenhuma publicação ainda.</Text>
              </View>
            )
          ) : (
            <View style={styles.usuarioEmptyTab}>
              <Ionicons name="trophy-outline" size={36} color={colors.purpleLight} />
              <Text style={styles.usuarioEmptyTabText}>Troféus aparecerão aqui.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <PerfilPostModal
        visible={postSelecionado != null}
        post={postSelecionado}
        username={usuario.username}
        isOwnProfile={false}
        onClose={() => setPostSelecionado(null)}
      />
    </ScreenSafe>
  );
}
