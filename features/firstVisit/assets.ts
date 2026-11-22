/** public의 기존 파일을 의미 있는 이름으로 참조한다. 원본 파일은 변경하지 않는다. */
export type IconAsset = { src: string; width: number; height: number };

export const assets = {
  images: {
    hero: "/firstVisit/wedding-couple-hero.jpg",
    luxuryVenue: "/firstVisit/wedding-hall-dark.jpg",
    brightVenue: "/firstVisit/wedding-hall-bright.jpg",
    gardenVenue: "/firstVisit/wedding-hall-garden.jpg",
    grandVenue: "/firstVisit/wedding-hall-chandelier.jpg",
    wordmark: "/firstVisit/wedid-logo.png",
    checkmark: "/firstVisit/checkbox-checkmark.png",
    couple: "/firstVisit/wedding-couple-illustration.png",
    avatar: "/firstVisit/member-avatar.png",
  },
  icons: {
    whiteArrow: {
      src: "/firstVisit/arrow-right-white.svg",
      width: 16,
      height: 16,
    },
    chevron: {
      src: "/firstVisit/chevron-right-muted.svg",
      width: 14,
      height: 14,
    },
    cost: {
      src: "/firstVisit/cost-calculation.svg",
      width: 24,
      height: 24,
    },
    location: {
      src: "/firstVisit/roadmap-feature-pin.svg",
      width: 24,
      height: 24,
    },
    members: {
      src: "/firstVisit/prepare-together-users.svg",
      width: 24,
      height: 24,
    },
    whiteHeart: {
      src: "/firstVisit/venue-favorite-heart.svg",
      width: 20,
      height: 20,
    },
    check: {
      src: "/firstVisit/venue-feature-check.svg",
      width: 14,
      height: 14,
    },
    favorite: {
      src: "/firstVisit/header-favorite-heart.svg",
      width: 22,
      height: 22,
    },
    account: {
      src: "/firstVisit/header-account.svg",
      width: 22,
      height: 22,
    },
    exit: {
      src: "/firstVisit/question-exit-close.svg",
      width: 16,
      height: 16,
    },
    selectChevron: {
      src: "/firstVisit/select-chevron-down.svg",
      width: 18,
      height: 18,
    },
    sparkle: {
      src: "/firstVisit/wedding-style-sparkles.svg",
      width: 16,
      height: 16,
    },
    hourglass: {
      src: "/firstVisit/estimate-hourglass.svg",
      width: 24,
      height: 24,
    },
    breadcrumb: {
      src: "/firstVisit/breadcrumb-chevron-right.svg",
      width: 14,
      height: 14,
    },
    settings: {
      src: "/firstVisit/condition-settings.svg",
      width: 14,
      height: 14,
    },
    expand: {
      src: "/firstVisit/details-chevron-down.svg",
      width: 14,
      height: 14,
    },
    candidateChevron: {
      src: "/firstVisit/vendor-candidates-chevron.svg",
      width: 14,
      height: 14,
    },
    externalLink: {
      src: "/firstVisit/arrow-up-right.svg",
      width: 16,
      height: 16,
    },
    budgetCheck: {
      src: "/firstVisit/budget-within-check.svg",
      width: 15,
      height: 15,
    },
    darkArrow: {
      src: "/firstVisit/arrow-right-dark.svg",
      width: 16,
      height: 16,
    },
    link: {
      src: "/firstVisit/share-link.svg",
      width: 16,
      height: 16,
    },
    chat: {
      src: "/firstVisit/chat-bubble.svg",
      width: 16,
      height: 16,
    },
    home: {
      src: "/firstVisit/roadmap-home.svg",
      width: 17,
      height: 17,
    },
    roadmap: {
      src: "/firstVisit/roadmap-map.svg",
      width: 17,
      height: 17,
    },
    budget: {
      src: "/firstVisit/roadmap-budget.svg",
      width: 17,
      height: 17,
    },
    venue: {
      src: "/firstVisit/roadmap-venue-pin.svg",
      width: 17,
      height: 17,
    },
    smallCheck: {
      src: "/firstVisit/roadmap-sidebar-check.svg",
      width: 12,
      height: 12,
    },
    invite: {
      src: "/firstVisit/partner-invite.svg",
      width: 16,
      height: 16,
    },
    saveHeart: {
      src: "/firstVisit/plan-save-heart.svg",
      width: 16,
      height: 16,
    },
    completed: {
      src: "/firstVisit/roadmap-completed-check.svg",
      width: 16,
      height: 16,
    },
    loginHeart: {
      src: "/firstVisit/login-heart.svg",
      width: 24,
      height: 24,
    },
    close: {
      src: "/firstVisit/login-close.svg",
      width: 18,
      height: 18,
    },
  },
} as const;
