import { hasRegionAnswers, hasTimingAnswers, type WeddingAnswers } from "../model";
import type { FlowActions } from "./flowUi";
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
  const canContinue =
    step === "region"
      ? hasRegionAnswers(answers)
      : step === "timing"
        ? hasTimingAnswers(answers)
        : true;
  const inputProps = { answers, updateAnswers };
  return (
    <QuestionLayout step={step} answers={answers} canContinue={canContinue} navigate={navigate}>
      {step === "region" && <RegionGuestStep {...inputProps} />}
      {step === "timing" && <WeddingDateBudgetStep {...inputProps} />}
      {step === "mood" && <WeddingStyleStep {...inputProps} />}
    </QuestionLayout>
  );
}
