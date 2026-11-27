import { useState } from "react";
import {
  formatBudgetAmount,
  hasRegionAnswers,
  hasTimingAnswers,
  parseBudgetInput,
  type FlowScreen,
  type WeddingAnswers,
} from "../../model";
import type { FlowActions } from "../layout/flowUi";
import { QuestionLayout, type QuestionStep } from "./questionLayout";
import { RegionGuestStep } from "./regionGuestStep";
import { WeddingDateBudgetStep } from "./weddingDateBudgetStep";
import { WeddingStyleStep } from "./weddingStyleStep";

type QuestionScreenProps = Pick<FlowActions, "navigate"> & {
  step: QuestionStep;
  answers: WeddingAnswers;
  updateAnswers: (patch: Partial<WeddingAnswers>) => void;
};

export function QuestionScreen({ step, answers, updateAnswers, navigate }: QuestionScreenProps) {
  const [budgetDraft, setBudgetDraft] = useState(() => ({
    budget: answers.budgetUnknown ? "" : formatBudgetAmount(answers.budget),
    budgetUnknown: answers.budgetUnknown,
  }));
  const budget = parseBudgetInput(budgetDraft.budget).amount;
  const budgetPatch = {
    budget: budget ?? "",
    budgetUnknown: budgetDraft.budgetUnknown,
  };
  const canSaveBudget = budgetDraft.budgetUnknown || budget !== null;
  const canContinue =
    step === "region"
      ? hasRegionAnswers(answers)
      : step === "timing"
        ? hasTimingAnswers({ ...answers, ...budgetPatch })
        : true;
  const inputProps = { answers, updateAnswers };

  function navigateFromQuestion(next: FlowScreen) {
    if (step === "timing" && canSaveBudget) updateAnswers(budgetPatch);
    navigate(next);
  }

  return (
    <QuestionLayout
      step={step}
      answers={step === "timing" && canSaveBudget ? { ...answers, ...budgetPatch } : answers}
      canContinue={canContinue}
      navigate={navigateFromQuestion}
    >
      {step === "region" && <RegionGuestStep {...inputProps} />}
      {step === "timing" && (
        <WeddingDateBudgetStep
          {...inputProps}
          budgetDraft={budgetDraft}
          setBudgetDraft={setBudgetDraft}
        />
      )}
      {step === "mood" && <WeddingStyleStep {...inputProps} />}
    </QuestionLayout>
  );
}
