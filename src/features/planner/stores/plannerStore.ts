"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type PersistStorage } from "zustand/middleware";
import { safeLocalStorage } from "../../../stores/localStorage";
import {
  createBasePlannerState,
  createDemoPlannerState,
  createNewPlannerState,
  SDM_TIER_OPTIONS,
  STEP_DEFINITIONS,
  type DemoScenario,
} from "../mocks/plannerMock";
import type {
  Assignee,
  Member,
  PlannerDraft,
  PlannerState,
  SdmTier,
  StepId,
  WeddingDate,
} from "../types";

/**
 * UT 계획은 이 브라우저에 저장한다. 시안 확인용 시나리오는 저장하지 않는다.
 * 백엔드 연동 시 각 액션을 API 호출(TanStack Query mutation 등)로 교체한다.
 */
type PlannerActions = {
  savePlanIfMissing: (draft: PlannerDraft, provider: Member["loginProvider"]) => Promise<void>;
  loadScenario: (scenario: DemoScenario, today: Date) => void;
  selectVenue: (venueId: string) => boolean;
  /** 금액 단계는 amount 필수 (R-09) */
  completeStep: (stepId: StepId, amount?: number) => void;
  /** 단계 05: 진행중으로 되돌림. 실제 금액은 지우지 않고 계산에서만 빠진다. */
  cancelComplete: (stepId: StepId) => void;
  /** R-04: 완료 후 금액 수정 */
  updateAmount: (stepId: StepId, amount: number) => void;
  /** R-07 [아직 안 했어요] */
  markNotDoneYet: (stepId: StepId) => void;
  setBudget: (budget: number) => void;
  setWeddingDate: (weddingDate: WeddingDate) => void;
  setSdmTier: (tier: SdmTier) => void;
  addTodo: (input: { stepId: StepId; title: string; assignee: Assignee }) => void;
  toggleTodo: (todoId: string) => void;
  disconnectPartner: () => void;
};

type PlannerStore = PlannerState & PlannerActions & { hasSavedPlan: boolean };

const jsonStorage = createJSONStorage<PlannerState | null>(() => safeLocalStorage);
const savedPlanStorage: PersistStorage<PlannerState | null> = {
  getItem: (name) => jsonStorage?.getItem(name) ?? null,
  setItem: (name, value) => {
    if (value.state !== null) return jsonStorage?.setItem(name, value);
  },
  removeItem: (name) => jsonStorage?.removeItem(name),
};

function planSnapshot(state: PlannerState): PlannerState {
  const {
    conditions,
    weddingDate,
    budget,
    selectedVenueId,
    steps,
    stepEstimates,
    sdmTier,
    todos,
    me,
    partner,
  } = state;
  return {
    conditions,
    weddingDate,
    budget,
    selectedVenueId: typeof selectedVenueId === "string" ? selectedVenueId : null,
    steps,
    stepEstimates,
    sdmTier,
    todos,
    me,
    partner,
  };
}

export const usePlannerStore = create<PlannerStore>()(
  persist(
    (set, get) => ({
      ...createBasePlannerState(),
      hasSavedPlan: false,

      savePlanIfMissing: async (draft, provider) => {
        // 열린 탭이 여럿이면 다른 탭에서 먼저 만든 계획도 확인한다.
        await usePlannerStore.persist.rehydrate();
        if (!get().hasSavedPlan)
          set({ ...createNewPlannerState(draft, provider), hasSavedPlan: true });
      },

      loadScenario: (scenario, today) => {
        if (!get().hasSavedPlan) set(createDemoPlannerState(scenario, today));
      },

      selectVenue: (venueId) => {
        if (!get().hasSavedPlan) return false;
        set({ selectedVenueId: venueId });
        return true;
      },

      completeStep: (stepId, amount) =>
        set((state) => ({
          steps: {
            ...state.steps,
            [stepId]: {
              ...state.steps[stepId],
              status: "complete",
              actualAmount: amount ?? state.steps[stepId].actualAmount,
              isMarkedOverdue: false,
            },
          },
        })),

      cancelComplete: (stepId) =>
        set((state) => ({
          steps: { ...state.steps, [stepId]: { ...state.steps[stepId], status: "inProgress" } },
        })),

      updateAmount: (stepId, amount) =>
        set((state) => ({
          steps: { ...state.steps, [stepId]: { ...state.steps[stepId], actualAmount: amount } },
        })),

      markNotDoneYet: (stepId) =>
        set((state) => ({
          steps: { ...state.steps, [stepId]: { ...state.steps[stepId], isMarkedOverdue: true } },
        })),

      setBudget: (budget) => set({ budget }),

      setWeddingDate: (weddingDate) => set({ weddingDate }),

      setSdmTier: (tier) =>
        set((state) => ({
          sdmTier: tier,
          stepEstimates: {
            ...state.stepEstimates,
            sdm: SDM_TIER_OPTIONS.find((option) => option.id === tier)!.range,
          },
        })),

      addTodo: ({ assignee, stepId, title }) =>
        set((state) => ({
          todos: [
            ...state.todos,
            { id: `todo-${Date.now()}`, stepId, title: title.trim(), assignee, isDone: false },
          ],
        })),

      toggleTodo: (todoId) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === todoId ? { ...todo, isDone: !todo.isDone } : todo,
          ),
        })),

      disconnectPartner: () => set({ partner: null }),
    }),
    {
      name: "wedidUtPlannerPlan",
      storage: savedPlanStorage,
      partialize: (state) => (state.hasSavedPlan ? planSnapshot(state) : null),
      merge: (stored, current) => {
        const plan = stored as Partial<PlannerState> | null | undefined;
        if (
          !plan?.conditions ||
          !plan.weddingDate ||
          !(plan.budget === null || typeof plan.budget === "number") ||
          !STEP_DEFINITIONS.every(({ id }) => plan.steps?.[id]) ||
          !plan.stepEstimates ||
          !SDM_TIER_OPTIONS.some(({ id }) => id === plan.sdmTier) ||
          !Array.isArray(plan.todos) ||
          !plan.me
        ) {
          return current;
        }
        return { ...current, ...planSnapshot(plan as PlannerState), hasSavedPlan: true };
      },
    },
  ),
);

/** U-06 토스트: 하단 가운데 · 3초 · 한 번에 1개 */
type ToastState = {
  message: string | null;
  showToast: (message: string) => void;
  hideToast: () => void;
};

export const useToastStore = create<ToastState>()((set) => ({
  message: null,
  showToast: (message) => set({ message }),
  hideToast: () => set({ message: null }),
}));
