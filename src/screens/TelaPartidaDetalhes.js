import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../../style';
import { colors, spacing } from '../../style/tokens';
import { useAppState } from '../state/AppStateContext';
import { rotuloEsporte } from '../domain/feed/posts';

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
  const { partidas, participarPartida, desistirPartida, username } = useAppState();

  const partida = useMemo(
    () => (partidas ?? []).find((p) => String(p.id) === String(partidaId)) ?? null,
    [partidaId, partidas],
  );

  const participando = Boolean(partida?.participantes?.includes('voce'));
  const total = partida?.participantes?.length ?? 0;
  const max = partida?.maxParticipantes ?? null;
  const vagas = max != null ? Math.max(0, max - total + (participando ? 1 : 0)) : null;

  if (!partida) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <Ionicons name="alert-circle-outline" size={42} color={colors.purpleLight} />
        <Text style={styles.screenTitle}>Partida não encontrada</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 10 }}>
          <Text style={{ color: colors.purple, fontWeight: '700' }}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  function alternarParticipacao() {
    if (participando) {
      desistirPartida?.(partida.id);
      return;
    }
    participarPartida?.(partida.id);
  }

  const participantes = partida.participantes ?? [];

  return (
    <SafeAreaView style={styles.createLocalScreen}>
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
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {participantes.length === 0 ? (
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                Ninguém participou ainda.
              </Text>
            ) : (
              participantes.map((p, idx) => {
                const label = p === 'voce' ? username ?? 'Você' : String(p);
                return (
                  <View
                    key={`${p}-${idx}`}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: colors.purpleLight,
                      borderWidth: 1,
                      borderColor: colors.purpleMuted,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: colors.purple, fontWeight: '800' }}>{initials(label)}</Text>
                  </View>
                );
              })
            )}
          </View>
        </View>

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
          >
            <Text
              style={[
                styles.createPrimaryBtnText,
                participando && { color: colors.purple },
              ]}
            >
              {participando ? 'Cancelar participação' : 'Participar'}
            </Text>
          </TouchableOpacity>
          {max != null ? (
            <Text style={{ textAlign: 'center', color: colors.textSecondary, fontSize: 12 }}>
              Limite de vagas: {max}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

