import type { StepId } from "./types";

export const PLANNER_ROUTES = {
  home: "/home",
  estimate: "/budget",
  venueSearch: "/venues",
  sdmSearch: "/sdm",
  compare: "/venues/compare",
  roadmap: "/roadmap",
  step: (stepId: StepId) => `/roadmap/${stepId}`,
  myInfo: "/my",
  invite: (token: string) => `/invite/${token}`,
} as const;
