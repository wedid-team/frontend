import { PLANNER_ROUTES } from "@/src/features/planner/routes";
import type { PlannerState, WeddingDate } from "@/src/features/planner/types";
import { formatWon } from "@/src/features/planner/utils/money";
import {
  formatDday,
  getCompletedCount,
  getDday,
  getNextStep,
  getProgressPercent,
  getSpentAmount,
  resolveWeddingDate,
} from "@/src/features/planner/utils/schedule";

export function getSavedPlanSummary(plan: PlannerState) {
  const nextStep = getNextStep(plan);
  const spent = getSpentAmount(plan);
  return {
    nextStep,
    nextHref: nextStep ? PLANNER_ROUTES.step(nextStep.id) : PLANNER_ROUTES.roadmap,
    completed: getCompletedCount(plan),
    percent: getProgressPercent(plan),
    spent,
    remaining: plan.budget === null ? null : plan.budget - spent,
  };
}

export function getWeddingDateDisplay(weddingDate: WeddingDate, today = new Date()) {
  const resolved = resolveWeddingDate(weddingDate, today);
  if (resolved.isUndecided) return { label: "예식일 미정", countdown: "예식일 미정" };

  const label =
    weddingDate.kind === "exact"
      ? `${resolved.monthLabel} ${resolved.date.getDate()}일`
      : resolved.monthLabel;
  return {
    label,
    countdown: `예식 ${formatDday(getDday(resolved.date, today), resolved.isEstimated)}`,
  };
}

export function formatPlanBudget(amount: number | null) {
  if (amount === null) return "예산 미정";
  return amount < 0 ? `-${formatWon(-amount)}` : formatWon(amount);
}
