import { colors, spacing } from '../tokens';

const hairline = '#ddd';
const cardBorder = '#ececec';
const meta = '#999';

const cardShadow = {
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
};

export const notificationStyles = {
  notificationScreen: { flex: 1, backgroundColor: colors.white },
  notificationHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  notificationTitle: { fontSize: 20, fontWeight: '800', color: colors.purple, letterSpacing: -0.2 },
  notificationSubtitle: { fontSize: 12, color: meta, marginTop: 4, lineHeight: 16 },
  notificationList: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2, gap: spacing.md },

  notificationEmpty: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  notificationEmptyText: { fontSize: 13, color: meta },

  notificationCard: {
    backgroundColor: colors.white,
    borderColor: cardBorder,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    ...cardShadow,
  },
  notificationCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  notificationThumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  notificationTextBlock: { flex: 1 },
  notificationTextTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  notificationTextSubtitle: { fontSize: 12, color: meta, marginTop: 4, lineHeight: 16 },
};

