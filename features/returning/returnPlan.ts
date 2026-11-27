"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { plan, range } from "../venues/venueData";
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
export const tierRanges: [number, number][] = [
  [185, 250],
  [250, 350],
  [350, 450],
  [450, 565],
];
export const recommendedVenueIds = ["aw-convention", "raon-classic-hall", "grand-opera-hall"];

export type Conditions = {
  month: string;
  region: string;
  guests: string;
  budget: string;
  mood: string;
};
export const conditionsDefault: Conditions = {
  month: "2027-10",
  region: plan.region,
  guests: plan.guests,
  budget: "3000",
  mood: "화사한 · 클래식",
};
export const regions = [plan.region, "서울 강남권", "경기·인천", "제주", "그 외 지역"];
export const guestRanges = ["50~100", "100~150", "150~200", "200~250", "250~300", "300~400"];
export function formatMonth(value: string) {
  const [year, month] = value.split("-");
  return year + "년 " + Number(month) + "월";
}
export function estimateVenue(conditions: Conditions): [number, number] {
  const [low, high] = conditions.guests.split("~").map(Number);
  return [
    Math.max(0, plan.venueBudget[0] + (low - 150) * 6),
    Math.max(0, plan.venueBudget[1] + (high - 200) * 6),
  ];
}
export const venueBudgetFor = (conditions: Conditions) => range(...estimateVenue(conditions));

type PreviewPlan = {
  conditions: Conditions;
  setConditions: (conditions: Conditions) => void;
  tier: number;
};

export const useReturnPlan = create<PreviewPlan>()(
  persist(
    (set) => ({
      conditions: conditionsDefault,
      setConditions: (conditions) => set({ conditions }),
      tier: 1,
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
