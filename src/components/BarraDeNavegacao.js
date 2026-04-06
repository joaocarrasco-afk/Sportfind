import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../../style';
import { BOTTOM_TABS } from '../domain/places';

export default function BarraDeNavegacao({ abaAtiva, mudarAba }) {
  return (
    <View style={styles.tabBar}>
      {BOTTOM_TABS.map((tab) => (
        <TouchableOpacity key={tab.id} style={styles.tabBarItem} onPress={() => mudarAba(tab.id)}>
          <View style={[styles.tabPill, abaAtiva === tab.id && styles.tabPillActive]}>
            <Text style={{ fontSize: 22 }}>{tab.icon}</Text>
          </View>
          <Text style={[styles.tabLabel, abaAtiva === tab.id && styles.tabLabelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
