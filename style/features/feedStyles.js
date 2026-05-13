import { colors, spacing } from '../tokens';

const hairline = '#ddd';
const cardBorder = '#ececec';
const meta = '#999';
const action = '#555';
const menu = '#bbb';
const avatarBg = '#f3edf7';
const imageBg = '#f5f5f5';

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
    borderColor: hairline,
    borderRadius: 20,
    borderWidth: 1,
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
    color: action,
    fontSize: 13,
    fontWeight: '500',
  },

  feedChipLabelActive: {
    color: colors.purple,
    fontWeight: '700',
  },
};
