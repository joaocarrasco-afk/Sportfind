import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import styles from '../../style';
import { ACCESS_FILTERS, FILTER_ALL, INFRASTRUCTURE_OPTIONS, SPORT_FILTERS } from '../domain/places';
import { colors, spacing } from '../../style/tokens';

export default function ModalFiltros({
  visivel,
  fechar,
  sportFilters,
  infraFilters,
  filtroAcesso,
  onAplicar,
  onLimparTodos,
}) {
  const [draftSports, setDraftSports] = useState(sportFilters);
  const [draftInfra, setDraftInfra] = useState(infraFilters ?? []);
  const [draftAccess, setDraftAccess] = useState(filtroAcesso);

  useEffect(() => {
    if (visivel) {
      setDraftSports(sportFilters);
      setDraftInfra(infraFilters ?? []);
      setDraftAccess(filtroAcesso);
    }
  }, [visivel, sportFilters, infraFilters, filtroAcesso]);

  function toggleDraftSport(sport) {
    setDraftSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport],
    );
  }

  function toggleDraftInfra(id) {
    setDraftInfra((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  function aplicar() {
    onAplicar(draftSports, draftAccess, draftInfra);
    fechar();
  }

  function limpar() {
    setDraftSports([]);
    setDraftInfra([]);
    setDraftAccess(FILTER_ALL);
    onLimparTodos();
    fechar();
  }

  const temDraft =
    draftSports.length > 0 || draftInfra.length > 0 || draftAccess !== FILTER_ALL;

  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={fechar}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable
          style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
          onPress={fechar}
        />
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={fechar}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>X</Text>
            </TouchableOpacity>
            <Text style={styles.panelTitlePurple}>Filtros</Text>
            {temDraft ? (
              <TouchableOpacity onPress={limpar}>
                <Text style={styles.panelClearText}>Limpar todos</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 72 }} />
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.filterLabel}>Esportes (toque para marcar vários)</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {SPORT_FILTERS.map((f) => {
                const ativo = draftSports.includes(f);
                return (
                  <TouchableOpacity
                    key={f}
                    style={[styles.optionChip, ativo && styles.optionChipActive]}
                    onPress={() => toggleDraftSport(f)}
                  >
                    <Text style={[styles.optionChipText, ativo && styles.optionChipTextActive]}>
                      {f}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {draftSports.length > 0 ? (
              <Text
                style={{
                  fontSize: 12,
                  color: colors.purple,
                  marginBottom: spacing.md,
                  fontWeight: '600',
                }}
              >
                Esportes: {draftSports.join(', ')}
              </Text>
            ) : null}

            <Text style={styles.filterLabel}>Infraestrutura</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: spacing.sm }}>
              O local precisa ter todos os itens marcados.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {INFRASTRUCTURE_OPTIONS.map((item) => {
                const ativo = draftInfra.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.optionChip, ativo && styles.optionChipActive]}
                    onPress={() => toggleDraftInfra(item.id)}
                  >
                    <Text style={[styles.optionChipText, ativo && styles.optionChipTextActive]}>
                      {item.emoji} {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {draftInfra.length > 0 ? (
              <Text
                style={{
                  fontSize: 12,
                  color: colors.purple,
                  marginBottom: spacing.md,
                  fontWeight: '600',
                }}
              >
                Infraestrutura:{' '}
                {draftInfra
                  .map((id) => INFRASTRUCTURE_OPTIONS.find((o) => o.id === id)?.label ?? id)
                  .join(', ')}
              </Text>
            ) : null}

            <Text style={styles.filterLabel}>Privacidade</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {ACCESS_FILTERS.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.optionChip, draftAccess === f && styles.optionChipActive]}
                  onPress={() => setDraftAccess(f)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      draftAccess === f && styles.optionChipTextActive,
                    ]}
                  >
                    {f === 'Publico' ? 'Público' : f === FILTER_ALL ? 'Todos' : f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            style={{
              height: 48,
              borderRadius: 10,
              backgroundColor: colors.purple,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: spacing.sm,
            }}
            onPress={aplicar}
          >
            <Text style={{ color: colors.textOnPurple, fontWeight: '700', fontSize: 15 }}>
              Aplicar filtros
              {draftSports.length + draftInfra.length > 0
                ? ` (${draftSports.length + draftInfra.length})`
                : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
