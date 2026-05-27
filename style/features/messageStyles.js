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

  chatScreen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chatHeaderCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  chatHeaderNome: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chatList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    flexGrow: 1,
  },
  chatBubbleRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  chatBubbleRowMine: {
    justifyContent: 'flex-end',
  },
  chatBubbleRowOther: {
    justifyContent: 'flex-start',
  },
  chatBubble: {
    maxWidth: '80%',
    borderRadius: radii.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chatBubbleMine: {
    backgroundColor: colors.purple,
    borderBottomRightRadius: 4,
  },
  chatBubbleOther: {
    backgroundColor: colors.purpleMuted,
    borderBottomLeftRadius: 4,
  },
  chatBubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  chatBubbleTextMine: {
    color: colors.textOnPurple,
  },
  chatBubbleTextOther: {
    color: colors.textPrimary,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  chatInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.purpleMuted,
  },
  chatSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
