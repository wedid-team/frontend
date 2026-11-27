import { STEP_DEFINITIONS } from "../mocks/plannerMock";
import type { ManwonRange, PlannerState, StepDefinition, StepId, WeddingDate } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;

export type ResolvedWeddingDate = {
  date: Date;
  /** 연·월만 있거나 미정이라 계산한 날짜 (R-08, E-04) */
  isEstimated: boolean;
  isUndecided: boolean;
  /** "2027년 10월" */
  monthLabel: string;
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function monthLabel(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

/**
 * R-08 · E-04
 * - 날짜가 있으면 그 날짜
 * - 연·월만 있으면 그 달 1일 기준 "(예상)"
 * - 미정이면 오늘로부터 12개월 뒤 기준 "(예상)"
 */
export function resolveWeddingDate(weddingDate: WeddingDate, today: Date): ResolvedWeddingDate {
  if (weddingDate.kind === "exact") {
    const date = startOfDay(new Date(`${weddingDate.date}T12:00:00`));
    return { date, isEstimated: false, isUndecided: false, monthLabel: monthLabel(date) };
  }
  if (weddingDate.kind === "month") {
    const date = new Date(weddingDate.year, weddingDate.month - 1, 1);
    return { date, isEstimated: true, isUndecided: false, monthLabel: monthLabel(date) };
  }
  const date = startOfDay(new Date(today.getFullYear(), today.getMonth() + 12, today.getDate()));
  return { date, isEstimated: true, isUndecided: true, monthLabel: monthLabel(date) };
}

/** 예식까지 남은 일수 */
export function getDday(weddingDate: Date, today: Date): number {
  return Math.round((startOfDay(weddingDate).getTime() - startOfDay(today).getTime()) / DAY_MS);
}

export function formatDday(dday: number, isEstimated: boolean) {
  const base = dday >= 0 ? `D-${dday}` : `D+${Math.abs(dday)}`;
  return isEstimated ? `${base} (예상)` : base;
}

function formatYearMonth(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** 단계 권장 기간을 실제 연월로: "2026.12 ~ 2027.02" */
export function getStepPeriodLabel(step: StepDefinition, weddingDate: Date) {
  const start = new Date(weddingDate.getTime() - step.startDday * DAY_MS);
  const end = new Date(weddingDate.getTime() - step.endDday * DAY_MS);
  return `${formatYearMonth(start)} ~ ${formatYearMonth(end)}`;
}

export function getStepDdayLabel(step: StepDefinition) {
  return `D-${step.startDday}~${step.endDday}`;
}

/** 권장 기간이 지났는데 완료하지 않은 단계 (R-07) */
export function isStepOverdue(step: StepDefinition, state: PlannerState, dday: number) {
  return state.steps[step.id].status !== "complete" && dday < step.endDday;
}

/** R-02: "다음 할 일" = 가장 이른 미완료 단계 */
export function getNextStep(state: PlannerState): StepDefinition | null {
  return STEP_DEFINITIONS.find((step) => state.steps[step.id].status !== "complete") ?? null;
}

export function getCompletedCount(state: PlannerState) {
  return STEP_DEFINITIONS.filter((step) => state.steps[step.id].status === "complete").length;
}

export function getProgressPercent(state: PlannerState) {
  return Math.round((getCompletedCount(state) / STEP_DEFINITIONS.length) * 100);
}

/** 완료한 단계의 실제 금액 합 */
export function getSpentAmount(state: PlannerState) {
  return STEP_DEFINITIONS.reduce((sum, step) => {
    const progress = state.steps[step.id];
    if (progress.status !== "complete" || progress.actualAmount === null) return sum;
    return sum + progress.actualAmount;
  }, 0);
}

/** 남은 미완료 금액 단계의 예상 비용 합 */
export function getRemainingEstimate(state: PlannerState): ManwonRange | null {
  const ranges = STEP_DEFINITIONS.filter(
    (step) => step.hasAmount && state.steps[step.id].status !== "complete",
  )
    .map((step) => state.stepEstimates[step.id])
    .filter((range): range is ManwonRange => Boolean(range));
  if (ranges.length === 0) return null;
  return ranges.reduce((sum, range) => ({ min: sum.min + range.min, max: sum.max + range.max }), {
    min: 0,
    max: 0,
  });
}

export type BudgetVerdict = "enough" | "tight" | "short";

/**
 * R-03: 남은 예산 vs 남은 미완료 단계 예상 비용 합 (판정 기준은 E-12와 같음)
 * 배지 문구는 Q-24(PM 제안) 기준 — 확정 전
 */
export const BUDGET_VERDICT_LABEL: Record<BudgetVerdict, string> = {
  enough: "남은 예산으로 충분해요",
  tight: "조건에 따라 부족할 수 있어요",
  short: "남은 예산이 부족해요",
};

export function getBudgetVerdict(remainingBudget: number, estimate: ManwonRange): BudgetVerdict {
  if (estimate.max <= remainingBudget) return "enough";
  if (estimate.min <= remainingBudget) return "tight";
  return "short";
}

export function getStepEstimate(state: PlannerState, stepId: StepId) {
  return state.stepEstimates[stepId] ?? null;
}
