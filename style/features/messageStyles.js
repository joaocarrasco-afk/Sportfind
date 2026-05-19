import { colors, spacing, radii } from '../tokens';

export const messageStyles = {
  messageScreen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  messageBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.purple,
  },
  messageHeaderSpacer: {
    width: 40,
  },
  messageList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl * 2,
    gap: spacing.sm,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  messageAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.purpleMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.purple,
  },
  messageCardBody: {
    flex: 1,
  },
  messageCardNome: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  messageCardPreview: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  messageCardHora: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  messageEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  messageEmptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
};
