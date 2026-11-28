"use client";

import { useEffect, useState } from "react";
import { plan } from "../venues/venueData";
import { useDiscovery } from "../venues/useDiscovery";

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
let hydration: Promise<void> | undefined;
export function useReturnReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    hydration ??= Promise.resolve(useDiscovery.persist.rehydrate());
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
