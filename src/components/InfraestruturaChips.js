import { Text, View } from 'react-native';
import styles from '../../style';
import { chipsInfraestrutura } from '../domain/places';

export default function InfraestruturaChips({
  ids = [],
  compact = false,
  maxItens,
  emptyText = 'Infraestrutura não informada',
}) {
  const chips = chipsInfraestrutura(ids);
  const visiveis = maxItens != null ? chips.slice(0, maxItens) : chips;
  const restantes = maxItens != null ? Math.max(0, chips.length - maxItens) : 0;

  if (chips.length === 0) {
    return <Text style={styles.infraChipsEmpty}>{emptyText}</Text>;
  }

  return (
    <View style={styles.infraChipsRow}>
      {visiveis.map((item) => (
        <View
          key={item.id}
          style={[styles.infraChip, compact && styles.infraChipCompact]}
        >
          <Text style={styles.infraChipEmoji}>{item.emoji}</Text>
          <Text style={[styles.infraChipLabel, compact && styles.infraChipLabelCompact]}>
            {item.label}
          </Text>
        </View>
      ))}
      {restantes > 0 ? (
        <View style={[styles.infraChip, styles.infraChipMais, compact && styles.infraChipCompact]}>
          <Text style={[styles.infraChipLabel, compact && styles.infraChipLabelCompact]}>
            +{restantes}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
