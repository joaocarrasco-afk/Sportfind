import { Modal, Text, TouchableOpacity, View } from 'react-native';
import styles from '../../style';
import { ACCESS_FILTERS, PLACE_TYPE_FILTERS } from '../domain/places';

export default function ModalFiltros({
  visivel,
  fechar,
  filtroTipo,
  filtroAcesso,
  setFiltroTipo,
  setFiltroAcesso,
}) {
  return (
    <Modal visible={visivel} transparent animationType="slide">
      <TouchableOpacity style={styles.overlay} onPress={fechar}>
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={fechar}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>X</Text>
            </TouchableOpacity>
            <Text style={styles.panelTitle}>Filtros</Text>
            <TouchableOpacity
              onPress={() => {
                setFiltroTipo('Todos');
                setFiltroAcesso('Todos');
              }}
            >
              <Text style={{ fontSize: 13, color: '#6393F2', fontWeight: '500' }}>Limpar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.filterLabel}>Esporte</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {PLACE_TYPE_FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.optionChip, filtroTipo === f && styles.optionChipActive]}
                onPress={() => setFiltroTipo(f)}
              >
                <Text style={[styles.optionChipText, filtroTipo === f && { color: '#6393F2' }]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterLabel}>Privacidade</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {ACCESS_FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.optionChip, filtroAcesso === f && styles.optionChipActive]}
                onPress={() => setFiltroAcesso(f)}
              >
                <Text style={[styles.optionChipText, filtroAcesso === f && { color: '#6393F2' }]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
