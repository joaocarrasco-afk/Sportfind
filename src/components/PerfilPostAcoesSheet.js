import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import styles from '../../style';
import { colors } from '../../style/tokens';

export default function PerfilPostAcoesSheet({ visible, onClose, onEdit, onDelete }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.perfilAcoesSheetRoot}>
        <Pressable style={styles.perfilAcoesSheetBackdrop} onPress={onClose} />
        <View style={styles.perfilAcoesSheetCard}>
          <View style={styles.perfilAcoesSheetHandle} />
          <Text style={styles.perfilAcoesSheetTitulo}>Publicação</Text>

          <TouchableOpacity
            style={styles.perfilAcoesSheetRow}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil-outline" size={22} color={colors.purple} />
            <Text style={styles.perfilAcoesSheetRowText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.perfilAcoesSheetRow}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={22} color="#ed4956" />
            <Text style={[styles.perfilAcoesSheetRowText, styles.perfilAcoesSheetRowDanger]}>
              Excluir
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.perfilAcoesSheetCancel}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.perfilAcoesSheetCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
