import { SafeAreaView, Text } from 'react-native';
import styles from '../../style';

export default function TelaAbaPlaceholder({ conteudo }) {
  const { icon, title, subtitle } = conteudo;

  return (
    <SafeAreaView style={styles.centeredScreen}>
      <Text style={{ fontSize: 48 }}>{icon}</Text>
      <Text style={styles.screenTitle}>{title}</Text>
      {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
    </SafeAreaView>
  );
}
