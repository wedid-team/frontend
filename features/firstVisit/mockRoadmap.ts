import { weddingDate, type WeddingAnswers } from "./model";

export type PreviewStep = {
  id: string;
  title: string;
  short: string;
  range: string;
  months: readonly [number, number];
  status: "completed" | "current" | "upcoming";
  cost?: "venue" | "styling";
  candidates?: readonly string[];
};

/** 비로그인 디자인 미리보기 전용. 로그인 사용자의 실제 준비 상태와 무관하다. */
export const mockRoadmapSteps: readonly PreviewStep[] = [
  {
    id: "planning",
    title: "예산 일정 합의, 상견례",
    short: "예산, 상견례",
    range: "D-365~300",
    months: [12, 10],
    status: "completed",
  },
  {
    id: "venue",
    title: "예식장 계약",
    short: "예식장 계약",
    range: "D-300~240",
    months: [10, 8],
    status: "current",
    cost: "venue",
    candidates: ["예식장 후보 보기", "업체 비교하기"],
  },
  {
    id: "styling",
    title: "스드메 계약",
    short: "스드메 계약",
    range: "D-240~180",
    months: [8, 6],
    status: "upcoming",
    cost: "styling",
    candidates: ["스드메 후보 보기"],
  },
  {
    id: "travel",
    title: "촬영, 신혼여행 예약",
    short: "촬영, 신혼여행",
    range: "D-180~120",
    months: [6, 4],
    status: "upcoming",
  },
  {
    id: "guests",
    title: "청첩장 전달, 하객 수 확정",
    short: "청첩장, 하객",
    range: "D-120~30",
    months: [4, 1],
    status: "upcoming",
  },
  {
    id: "finalCheck",
    title: "최종 점검",
    short: "최종 점검",
    range: "D-30~0",
    months: [1, 0],
    status: "upcoming",
  },
];

export function previewProgress(steps: readonly PreviewStep[]) {
  return steps.length
    ? Math.round((steps.filter((step) => step.status === "completed").length / steps.length) * 100)
    : 0;
}

/** 예시의 월 간격만 선택 시기에 맞춘다. 실제 업무 일정 엔진이 아니다. */
export function previewMonthRange(answers: WeddingAnswers, offsets: readonly number[]) {
  const date = weddingDate(answers);
  if (!date) return "예식 시기를 정하면 확인할 수 있어요";
  return offsets
    .map((offset) => {
      const month = new Date(date.getFullYear(), date.getMonth() - offset, 1);
      return `${month.getFullYear()}.${String(month.getMonth() + 1).padStart(2, "0")}`;
    })
    .join(" ~ ");
}
