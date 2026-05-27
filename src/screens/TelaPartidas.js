import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

function formatResumoData(dateLike) {
  const d = asDate(dateLike);
  if (!d) return '';
  const dia = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dia} • ${hora}`;
}

const FILTROS = [
  { id: 'Futebol', label: 'Futebol' },
  { id: 'Basquete', label: 'Basquete' },
  { id: 'Volei', label: 'Vôlei' },
  { id: 'Hoje', label: 'Hoje' },
  { id: 'Semana', label: 'Esta semana' },
];

export default function TelaPartidas() {
  const navigation = useNavigation();
  const { partidas } = useAppState();
  const [busca, setBusca] = useState('');
  const [filtrosAtivos, setFiltrosAtivos] = useState(() => new Set());

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const ativos = filtrosAtivos;

    const hoje = new Date();
    const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);
    const inicioSemana = new Date(inicioHoje);
    inicioSemana.setDate(inicioSemana.getDate() - ((inicioSemana.getDay() + 6) % 7));
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(fimSemana.getDate() + 7);

    return [...(partidas ?? [])]
      .filter((p) => {
        const nome = (p.nome ?? '').toLowerCase();
        const esporte = (p.esporte ?? '').toLowerCase();
        const local = (p.place?.name ?? '').toLowerCase();
        if (termo && !nome.includes(termo) && !esporte.includes(termo) && !local.includes(termo)) {
          return false;
        }

        const data = asDate(p.data);
        const filtraHoje = ativos.has('Hoje');
        const filtraSemana = ativos.has('Semana');
        if ((filtraHoje || filtraSemana) && !data) return false;
        if (filtraHoje && (data < inicioHoje || data >= fimHoje)) return false;
        if (filtraSemana && (data < inicioSemana || data >= fimSemana)) return false;

        const esportesAtivos = ['Futebol', 'Basquete', 'Volei'].filter((x) => ativos.has(x));
        if (esportesAtivos.length > 0) {
          return esportesAtivos.some((e) => (p.esporte ?? '') === e);
        }
        return true;
      })
      .sort((a, b) => {
        const da = asDate(a.data)?.getTime() ?? 0;
        const db = asDate(b.data)?.getTime() ?? 0;
        return da - db;
      });
  }, [busca, filtrosAtivos, partidas]);

  function toggleFiltro(id) {
    setFiltrosAtivos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <SafeAreaView style={styles.createLocalScreen}>
      <View style={styles.createLocalHeader}>
        <TouchableOpacity style={styles.createLocalBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.purple} />
        </TouchableOpacity>
        <Text style={styles.createLocalHeaderTitle}>Partidas</Text>
        <View style={styles.createLocalHeaderSpacer} />
      </View>

      <View style={{ padding: spacing.lg, paddingBottom: 0, gap: spacing.md }}>
        <View style={{ position: 'relative' }}>
          <Ionicons
            name="search"
            size={18}
            color={colors.purple}
            style={{ position: 'absolute', left: 14, top: 15 }}
          />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar por nome, esporte ou local..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.createLocalInput, { paddingLeft: 40 }]}
          />
        </View>

        <View style={styles.feedFiltersRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.feedChipsScroll, { width: '100%' }]}
            contentContainerStyle={[
              styles.feedChipsContent,
              { paddingHorizontal: 0, justifyContent: 'flex-start' },
            ]}
          >
            {FILTROS.map((f) => {
              const ativo = filtrosAtivos.has(f.id);
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.feedChip, ativo && styles.feedChipActive]}
                  onPress={() => toggleFiltro(f.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.feedChipLabel, ativo && styles.feedChipLabelActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={lista}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.feedList, { paddingTop: spacing.lg }]}
        renderItem={({ item }) => {
          const total = item.participantes?.length ?? 0;
          const max = item.maxParticipantes;
          const localNome = item.place?.name ?? 'Local';
          return (
            <View style={styles.feedCard}>
              <View style={{ padding: spacing.md, gap: 8 }}>
                <Text style={styles.feedPartidaTitle} numberOfLines={1}>
                  {item.nome}
                </Text>
                <Text style={styles.feedPartidaMetaText}>
                  {rotuloEsporte(item.esporte)} • {formatResumoData(item.data)}
                </Text>
                <Text style={styles.feedPartidaMetaText} numberOfLines={2}>
                  📍 {localNome}
                </Text>
                {max != null ? (
                  <Text style={styles.feedPartidaVagas}>
                    {total}/{max} participantes
                  </Text>
                ) : (
                  <Text style={styles.feedPartidaVagas}>{total} participantes</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.feedPartidaParticiparBtn}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('TelaPartidaDetalhes', { partidaId: item.id })}
              >
                <Text style={styles.feedPartidaParticiparText}>Ver detalhes</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.feedEmpty}>
            <Ionicons name="calendar-outline" size={40} color={colors.purpleLight} />
            <Text style={styles.feedEmptyText}>Nenhuma partida encontrada.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

