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
};

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
    }),
    {
      name: "wedidFirstVisitDraft",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
      partialize: ({ answers, tier }) => ({ answers, tier }),
      merge: (persisted, current) => {
        const saved =
          persisted && typeof persisted === "object" ? (persisted as Record<string, unknown>) : {};
        return {
          ...current,
          answers: sanitizeAnswers(saved.answers),
          tier: isTier(saved.tier) ? saved.tier : "standard",
        };
      },
    },
  ),
);
