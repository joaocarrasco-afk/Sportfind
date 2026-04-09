import { colors, spacing } from '../tokens';

export const searchStyles = {
  screen: { flex: 1, backgroundColor: colors.white },
  searchBar: { flexDirection: 'row', margin: spacing.lg, marginTop: spacing.sm, height: 48 },
  backButton: {
    width: 48,
    backgroundColor: '#ebebeb',
    borderTopLeftRadius: spacing.sm,
    borderBottomLeftRadius: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#ebebeb',
    paddingHorizontal: spacing.md,
    fontSize: 16,
  },
  filterButton: {
    width: 48,
    backgroundColor: '#ebebeb',
    borderTopRightRadius: spacing.sm,
    borderBottomRightRadius: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  listContent: { padding: spacing.lg, gap: spacing.sm },
};
