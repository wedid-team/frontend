"use client";

import { create } from "zustand";
import {
  createBasePlannerState,
  createDemoPlannerState,
  SDM_TIER_OPTIONS,
  type DemoScenario,
} from "../mocks/plannerMock";
import type { Assignee, PlannerState, SdmTier, StepId, WeddingDate } from "../types";

/**
 * B파트 화면 상태. 지금은 MOCK 데이터로 화면 안에서만 바뀐다.
 * 백엔드 연동 시 각 액션을 API 호출(TanStack Query mutation 등)로 교체한다.
 */
type PlannerActions = {
  loadScenario: (scenario: DemoScenario, today: Date) => void;
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

export const usePlannerStore = create<PlannerState & PlannerActions>()((set) => ({
  ...createBasePlannerState(),

  loadScenario: (scenario, today) => set(createDemoPlannerState(scenario, today)),

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
}));

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
