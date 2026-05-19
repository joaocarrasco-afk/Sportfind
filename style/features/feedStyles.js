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
  feedHeaderWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  feedToolbarTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  feedFiltersRow: {
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 40,
  },
  feedChipsScroll: {
    flexGrow: 0,
    maxHeight: 40,
    width: '100%',
  },
  feedChipsContent: {
    alignItems: 'center',
    flexGrow: 1,
    gap: spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },

  feedFab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },

  createPostScreen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  createPostFlex: {
    flex: 1,
  },
  createPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  createPostBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPostHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.purple,
  },
  createPostHeaderSpacer: {
    width: 40,
  },
  createPostScroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  createPostImageBox: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.purpleMuted,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  createPostImagePreview: {
    width: '100%',
    height: '100%',
  },
  createPostImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  createPostImageHint: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  createPostImageEditBadge: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPostFieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  createPostInput: {
    minHeight: 120,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.purpleMuted,
    lineHeight: 22,
  },
  createPostCharCount: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  createPostFooter: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  createPostPublishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: radii.pill,
    backgroundColor: colors.purple,
  },
  createPostPublishBtnDisabled: {
    opacity: 0.45,
  },
  createPostPublishText: {
    color: colors.textOnPurple,
    fontSize: 16,
    fontWeight: '700',
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
