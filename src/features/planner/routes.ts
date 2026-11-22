import type { StepId } from "./types";

/**
 * 확인 필요: 기획서에 URL이 없어 팀 합의 전 임시 경로.
 * A · C파트 화면 경로는 각 담당자가 정하면 여기만 바꾼다.
 */
export const PLANNER_ROUTES = {
  home: "/", // C: 로그인 후 홈
  estimate: "/", // A: 예상 비용 결과
  venueSearch: "/", // C: 예식장 후보
  sdmSearch: "/", // C: 스드메 후보
  compare: "/", // C: 업체 비교
  roadmap: "/roadmap",
  step: (stepId: StepId) => `/roadmap/${stepId}`,
  myInfo: "/my",
  invite: (token: string) => `/invite/${token}`,
} as const;
