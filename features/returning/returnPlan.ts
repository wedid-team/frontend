"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toManwon } from "../mocks/money";
import { defaultSdmTier } from "../sdm/sdmData";
import { extraGuestEstimate, plan, range } from "../venues/venueData";
import { returningMock } from "./mocks/returningMock";
import { useDiscovery } from "../venues/useDiscovery";

export const steps = [
  {
    id: "budget",
    title: "예산 일정 합의, 상견례",
    short: "예산, 상견례",
    timing: "D-365~300",
    icon: "budget",
  },
  { id: "venue", title: "예식장 계약", short: "예식장 계약", timing: "D-300~240", icon: "venue" },
  { id: "sdm", title: "스드메 계약", short: "스드메 계약", timing: "D-240~180", icon: "dress" },
  {
    id: "shoot",
    title: "촬영, 신혼여행 예약",
    short: "촬영, 신혼여행",
    timing: "D-180~120",
    icon: "camera",
  },
  {
    id: "invite",
    title: "청첩장 전달, 하객 수 확정",
    short: "청첩장, 하객",
    timing: "D-120~30",
    icon: "mail",
  },
  { id: "final", title: "최종 점검", short: "최종 점검", timing: "D-30~0", icon: "mood" },
] as const;
export type Step = (typeof steps)[number];
export const stepHref = (step: Step) => "/roadmap?stage=" + step.id;
export const tasks = [
  { id: "agree", label: "예산 상한 합의하기", owner: "함께" },
  { id: "tour", label: "후보 예식장 3곳 투어 예약", owner: "나" },
  { id: "share", label: "부모님께 후보 공유", owner: "짝꿍" },
];
export const weddingDday = returningMock.weddingDday;
export const recommendedVenueIds = returningMock.recommendedVenueIds;

export type Conditions = {
  month: string;
  region: string;
  guests: string;
  budget: string;
  mood: string;
};
export const conditionsDefault: Conditions = {
  month: returningMock.month,
  region: plan.region,
  guests: plan.guests,
  budget: String(toManwon(returningMock.budgetWon)),
  mood: returningMock.mood,
};
export function formatMonth(value: string) {
  const [year, month] = value.split("-");
  return year + "년 " + Number(month) + "월";
}
export function estimateVenue(conditions: Conditions): [number, number] {
  const [low, high] = conditions.guests.split("~").map(Number);
  return [
    Math.max(0, plan.venueBudget[0] + (low - 150) * extraGuestEstimate),
    Math.max(0, plan.venueBudget[1] + (high - 200) * extraGuestEstimate),
  ];
}
export const venueBudgetFor = (conditions: Conditions) => range(...estimateVenue(conditions));

type PlanProgress = {
  conditions: Conditions;
  setConditions: (conditions: Conditions) => void;
  completed: number;
  checked: string[];
  tier: number;
  toggleTask: (id: string) => void;
  finish: (index: number) => void;
  setTier: (tier: number) => void;
};

export const useReturnPlan = create<PlanProgress>()(
  persist(
    (set) => ({
      conditions: conditionsDefault,
      setConditions: (conditions) => set({ conditions }),
      completed: 1,
      checked: ["tour"],
      tier: defaultSdmTier,
      toggleTask: (id) =>
        set((state) => ({
          checked: state.checked.includes(id)
            ? state.checked.filter((item) => item !== id)
            : [...state.checked, id],
        })),
      finish: (index) => set((state) => ({ completed: Math.max(state.completed, index + 1) })),
      setTier: (tier) => set({ tier }),
    }),
    { name: "wedid-return-plan-preview", skipHydration: true },
  ),
);

let hydration: Promise<unknown> | undefined;
export function useReturnReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    hydration ??= Promise.all([
      useDiscovery.persist.rehydrate(),
      useReturnPlan.persist.rehydrate(),
    ]);
    let mounted = true;
    const markReady = () => {
      if (mounted) setReady(true);
    };
    void hydration.then(markReady, markReady);
    return () => {
      mounted = false;
    };
  }, []);
  return ready;
}

export function useProgress() {
  const completed = useReturnPlan((state) => state.completed);
  const contracted = useDiscovery((state) => state.contracted);
  const count = Math.max(completed, contracted ? 2 : 1);
  return {
    count,
    percent: Math.round((count / steps.length) * 100),
    current: steps[count],
    spent: count === steps.length ? toManwon(returningMock.completedSpentWon) : 0,
    contracted,
  };
}
