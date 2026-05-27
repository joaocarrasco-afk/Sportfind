import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../../style/tokens';

/** Margem extra abaixo da status bar / notch */
const TOP_EXTRA = spacing.sm;

/** Altura do conteúdo da tab bar (sem home indicator) — alinhado ao AppNavigator */
export const TAB_BAR_HEIGHT = 56;

/**
 * Insets da área segura com padding extra para não colidir com UI do sistema.
 */
export function useScreenInsets() {
  const insets = useSafeAreaInsets();

  return {
    ...insets,
    topWithPadding: insets.top + TOP_EXTRA,
    bottomWithPadding: insets.bottom + spacing.sm,
    bottomAboveTabBar: insets.bottom + TAB_BAR_HEIGHT + spacing.md,
    horizontal: Math.max(insets.left, insets.right, spacing.lg),
  };
}
