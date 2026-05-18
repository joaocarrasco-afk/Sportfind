import { StyleSheet } from 'react-native';
import { colors, spacing, radii } from '../tokens';

const cardBorder = '#E8E8E8';
const meta = '#666666';
const menu = '#999999';
const avatarBg = '#F3EDF7';
const imageBg = '#F5F5F5';

const cardShadow = {
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
};

export const feedStyles = {
  feedHeaderRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  feedHeaderText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  feedTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  feedSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  feedHeaderIconBtn: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.purple,
    borderRadius: 20,
    borderWidth: 1.5,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  feedHeaderIcon: {
    fontSize: 18,
  },

  feedChipsScroll: {
    marginBottom: spacing.sm,
    maxHeight: 40,
  },
  feedChipsContent: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  feedList: {
    gap: spacing.lg,
    paddingBottom: spacing.xl * 3,
    paddingHorizontal: spacing.lg,
  },

  feedCard: {
    backgroundColor: colors.white,
    borderColor: cardBorder,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    ...cardShadow,
  },
  feedCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  feedCardAvatar: {
    alignItems: 'center',
    backgroundColor: avatarBg,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  feedCardAvatarEmoji: {
    fontSize: 20,
  },
  feedCardHeaderMain: {
    flex: 1,
  },
  feedCardAuthor: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  feedCardTime: {
    color: meta,
    fontSize: 12,
    marginTop: 2,
  },
  feedCardMenu: {
    color: menu,
    fontSize: 18,
  },

  feedCardImage: {
    backgroundColor: imageBg,
    height: 210,
    width: '100%',
  },
  feedCardBody: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  feedCardPlaceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  feedCardPlaceEmoji: {
    fontSize: 16,
  },
  feedCardPlaceName: {
    color: colors.purple,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  feedCardBodyText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.sm,
  },

  feedCardCaptionLabel: {
    color: meta,
    fontSize: 12,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  feedCardCaptionPlaceholderText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  feedCardActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  feedActionBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  feedActionIcon: {
    fontSize: 16,
  },
  feedActionLabel: {
    color: meta,
    fontSize: 13,
    fontWeight: '500',
  },

  feedChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  feedChipActive: {
    borderColor: colors.purple,
    backgroundColor: colors.purpleLight,
  },
  feedChipLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  feedChipLabelActive: {
    color: colors.purple,
    fontWeight: '700',
  },
  feedActionLabelActive: {
    color: colors.purple,
    fontSize: 13,
    fontWeight: '600',
  },
  feedEmpty: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.sm,
  },
  feedEmptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  feedModalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  feedModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  feedModalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '75%',
    paddingBottom: spacing.xl,
  },
  feedModalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  feedModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.purple,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  feedCommentList: {
    paddingHorizontal: spacing.lg,
    maxHeight: 280,
  },
  feedCommentItem: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  feedCommentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedCommentAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  feedCommentText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  feedCommentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  feedCommentInput: {
    flex: 1,
    height: 44,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.purpleMuted,
  },
  feedCommentSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedMenuOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  feedMenuOptionText: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  feedMenuOptionDanger: {
    color: '#c62828',
  },
};
