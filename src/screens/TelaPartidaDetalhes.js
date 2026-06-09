import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenSafe from '../components/ScreenSafe';
import styles from '../../style';
import { colors, spacing } from '../../style/tokens';
import { useAppState } from '../state/AppStateContext';
import { rotuloEsporte } from '../domain/feed/posts';
import {
  buscarEvento,
  carregarPerfisParticipantes,
  eventoParaDetalhes,
  participarEvento,
} from '../utils/eventoApi';

function asDate(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  return null;
}

function formatHeaderData(dateLike) {
  const d = asDate(dateLike);
  if (!d) return '';
  const data = d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${data} • ${hora}`;
}

function initials(name) {
  const cleaned = String(name ?? '').trim();
  if (!cleaned) return '?';
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + last).toUpperCase();
}

export default function TelaPartidaDetalhes() {
  const navigation = useNavigation();
  const route = useRoute();
  const { partidaId } = route.params ?? {};
  const { authUid, username } = useAppState();
  const [partida, setPartida] = useState(null);
  const [perfisParticipantes, setPerfisParticipantes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const carregarPartida = useCallback(async () => {
    if (!partidaId) {
      setPartida(null);
      setCarregando(false);
      return;
    }

    setCarregando(true);
    try {
      const evento = await buscarEvento(partidaId);
      setPartida(eventoParaDetalhes(evento));
    } catch {
      setPartida(null);
    } finally {
      setCarregando(false);
    }
  }, [partidaId]);

  useEffect(() => {
    carregarPartida();
  }, [carregarPartida]);

  useEffect(() => {
    let cancelado = false;

    async function carregarPerfis() {
      if (!partida?.participantes?.length) {
        setPerfisParticipantes([]);
        return;
      }

      const perfis = await carregarPerfisParticipantes(
        partida.participantes,
        authUid,
        username,
      );
      if (!cancelado) setPerfisParticipantes(perfis);
    }

    carregarPerfis();
    return () => {
      cancelado = true;
    };
  }, [partida?.participantes, authUid, username]);

  const ehDono = Boolean(authUid && partida?.admId === authUid);
  const participando = Boolean(authUid && partida?.participantes?.includes(authUid));
  const total = partida?.participantes?.length ?? 0;
  const max = partida?.maxParticipantes ?? null;
  const vagas = max != null ? Math.max(0, max - total + (participando ? 1 : 0)) : null;

  async function alternarParticipacao() {
    if (!authUid) {
      Alert.alert('Login necessário', 'Faça login para participar da partida.');
      return;
    }
    if (!partida) return;

    if (participando) {
      setPartida((prev) => ({
        ...prev,
        participantes: (prev.participantes ?? []).filter((id) => id !== authUid),
      }));
      return;
    }

    setSalvando(true);
    try {
      const resultado = await participarEvento(partida.id, authUid);
      setPartida((prev) => ({
        ...prev,
        participantes: resultado.participantes ?? [...(prev.participantes ?? []), authUid],
      }));
    } catch (error) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível participar da partida.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <ScreenSafe style={styles.centeredScreen}>
        <ActivityIndicator size="large" color={colors.purple} />
      </ScreenSafe>
    );
  }

  if (!partida) {
    return (
      <ScreenSafe style={styles.centeredScreen}>
        <Ionicons name="alert-circle-outline" size={42} color={colors.purpleLight} />
        <Text style={styles.screenTitle}>Partida não encontrada</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 10 }}>
          <Text style={{ color: colors.purple, fontWeight: '700' }}>Voltar</Text>
        </TouchableOpacity>
      </ScreenSafe>
    );
  }

  return (
    <ScreenSafe style={styles.createLocalScreen}>
      <View style={styles.createLocalHeader}>
        <TouchableOpacity style={styles.createLocalBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.purple} />
        </TouchableOpacity>
        <Text style={styles.createLocalHeaderTitle}>Detalhes</Text>
        <View style={styles.createLocalHeaderSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl * 3, gap: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.feedPartidaCard, { marginHorizontal: 0, marginBottom: 0 }]}>
          <Text style={styles.feedPartidaTitle}>{partida.nome}</Text>
          <View style={styles.feedPartidaMetaRow}>
            <Text style={styles.feedPartidaMetaText}>{rotuloEsporte(partida.esporte)}</Text>
          </View>
          <Text style={[styles.feedPartidaMetaText, { marginTop: spacing.sm }]}>
            {formatHeaderData(partida.data)}
          </Text>
          <Text style={[styles.feedPartidaMetaText, { marginTop: spacing.sm }]} numberOfLines={2}>
            📍 {partida.place?.name ?? 'Local'}
            {partida.place?.address ? ` — ${partida.place.address}` : ''}
          </Text>

          {max != null ? (
            <Text style={styles.feedPartidaVagas}>
              {total}/{max} participantes
              {vagas != null ? ` • ${vagas} vaga(s) restante(s)` : ''}
            </Text>
          ) : (
            <Text style={styles.feedPartidaVagas}>{total} participantes</Text>
          )}
        </View>

        <View>
          <Text style={{ fontSize: 14, fontWeight: '800', color: colors.purple, marginBottom: spacing.sm }}>
            Participantes
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
            {perfisParticipantes.length === 0 ? (
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                Ninguém participou ainda.
              </Text>
            ) : (
              perfisParticipantes.map((perfil) => (
                <View key={perfil.id} style={{ alignItems: 'center', width: 64 }}>
                  {perfil.url ? (
                    <Image
                      source={{ uri: perfil.url }}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        borderWidth: 1,
                        borderColor: colors.purpleMuted,
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: colors.purpleLight,
                        borderWidth: 1,
                        borderColor: colors.purpleMuted,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: colors.purple, fontWeight: '800' }}>
                        {initials(perfil.username)}
                      </Text>
                    </View>
                  )}
                  <Text
                    style={{
                      marginTop: 4,
                      fontSize: 11,
                      color: colors.textSecondary,
                      textAlign: 'center',
                    }}
                    numberOfLines={1}
                  >
                    {perfil.username}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        {!ehDono ? (
          <View style={{ gap: 10 }}>
            <TouchableOpacity
              style={[
                styles.createPrimaryBtn,
                participando && {
                  backgroundColor: colors.white,
                  borderWidth: 1.5,
                  borderColor: colors.purple,
                },
              ]}
              activeOpacity={0.9}
              onPress={alternarParticipacao}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator color={colors.textOnPurple} />
              ) : (
                <Text
                  style={[
                    styles.createPrimaryBtnText,
                    participando && { color: colors.purple },
                  ]}
                >
                  {participando ? 'Cancelar participação' : 'Participar'}
                </Text>
              )}
            </TouchableOpacity>
            {max != null ? (
              <Text style={{ textAlign: 'center', color: colors.textSecondary, fontSize: 12 }}>
                Limite de vagas: {max}
              </Text>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </ScreenSafe>
  );
}
