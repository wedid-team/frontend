import type { PlannerDraft, WeddingDate } from "@/src/features/planner/types";
import {
  hasRegionAnswers,
  hasTimingAnswers,
  unknownGuestCount,
  type EstimateTier,
  type WeddingAnswers,
} from "./model";

export function toPlannerDraft(answers: WeddingAnswers, tier: EstimateTier): PlannerDraft | null {
  if (!hasRegionAnswers(answers) || !hasTimingAnswers(answers)) return null;

  let weddingDate: WeddingDate = { kind: "undecided" };
  if (answers.timing === "date") weddingDate = { kind: "exact", date: answers.date };
  if (answers.timing === "month") {
    weddingDate = { kind: "month", year: Number(answers.year), month: Number(answers.month) };
  }

  return {
    conditions: {
      regionLabel: answers.region,
      guestLabel: answers.guests === unknownGuestCount ? null : `하객 ${answers.guests}`,
      moods: [...answers.moods],
    },
    weddingDate,
    budget: answers.budgetUnknown ? null : Number(answers.budget),
    sdmTier: tier,
  };
}
