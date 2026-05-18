import { colors, spacing, radii } from '../tokens';

export const createStyles = {
  createScreen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  createScroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 3,
  },
  createHero: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  createMascotCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.purpleMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.purpleLight,
  },
  createTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.purple,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  createSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.md,
  },
  createOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.purple,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  createOptionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.purpleMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createOptionTextBlock: {
    flex: 1,
  },
  createOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  createOptionHint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  createPrimaryBtn: {
    marginTop: spacing.md,
    height: 52,
    borderRadius: radii.pill,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPrimaryBtnText: {
    color: colors.textOnPurple,
    fontSize: 16,
    fontWeight: '700',
  },
};
