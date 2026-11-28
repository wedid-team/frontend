import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  initialAnswers,
  isValidBudget,
  isTier,
  sanitizeAnswers,
  type EstimateTier,
  type WeddingAnswers,
} from "./model";

type FirstVisitState = {
  answers: WeddingAnswers;
  tier: EstimateTier;
  updateAnswers: (patch: Partial<WeddingAnswers>) => void;
  setTier: (tier: EstimateTier) => void;
  resetDraft: () => void;
};

const draftStorage = createJSONStorage(() => ({
  getItem(name) {
    try {
      return window.sessionStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem(name, value) {
    try {
      window.sessionStorage.setItem(name, value);
    } catch {
      // 저장을 사용할 수 없는 환경에서는 현재 탭의 메모리 상태를 유지한다.
    }
  },
  removeItem(name) {
    try {
      window.sessionStorage.removeItem(name);
    } catch {
      // 저장소가 차단된 상태에서는 삭제할 수 없다.
    }
  },
}));

// 이 브라우저의 임시 계획이며 로그인 계정에 저장된 계획과 분리한다.
export const useFirstVisitStore = create<FirstVisitState>()(
  persist(
    (set) => ({
      answers: initialAnswers,
      tier: "standard",
      updateAnswers: (patch) =>
        set((state) => {
          const answers = { ...state.answers, ...patch };
          if (
            (patch.budget !== undefined || patch.budgetUnknown !== undefined) &&
            (answers.budget !== "" || !answers.budgetUnknown) &&
            !isValidBudget(answers.budget)
          ) {
            return state;
          }
          return { answers };
        }),
      setTier: (tier) => set({ tier }),
      resetDraft: () => set({ answers: initialAnswers, tier: "standard" }),
    }),
    {
      name: "wedidFirstVisitDraft",
      version: 1,
      storage: draftStorage,
      skipHydration: true,
      partialize: ({ answers, tier }) => ({ answers, tier }),
      merge: (persisted, current) => {
        if (!persisted || typeof persisted !== "object") return current;
        const saved = persisted as Record<string, unknown>;
        return {
          ...current,
          answers: sanitizeAnswers(saved.answers),
          tier: isTier(saved.tier) ? saved.tier : "standard",
        };
      },
    },
  ),
);
