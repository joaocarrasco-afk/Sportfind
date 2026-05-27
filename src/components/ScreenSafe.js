import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../style/tokens';

/**
 * Container de tela que respeita notch, status bar e gestos do sistema.
 * @param {import('react-native-safe-area-context').Edge[]} edges - padrão: topo e laterais
 */
export default function ScreenSafe({ children, style, edges = ['top', 'left', 'right'] }) {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: colors.white }, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}
