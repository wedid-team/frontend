import { RadioCardGroup } from "@/src/components/common";
import {
  formatBudgetAmount,
  increaseBudgetInput,
  parseBudgetInput,
  type WeddingAnswers,
} from "../model";
import {
  BudgetAmountField,
  WeddingTimingFields,
  type ConditionFieldProps,
} from "./conditionFields";
import { QuestionField } from "./questionLayout";
import styles from "./question.module.css";

type BudgetDraft = Pick<WeddingAnswers, "budget" | "budgetUnknown">;

export function WeddingDateBudgetStep({
  answers,
  updateAnswers,
  budgetDraft,
  setBudgetDraft,
}: ConditionFieldProps & {
  budgetDraft: BudgetDraft;
  setBudgetDraft: (draft: BudgetDraft) => void;
}) {
  const { budget, budgetUnknown } = budgetDraft;
  const amount = parseBudgetInput(budget).amount;
  const editBudget = (budget: string) => setBudgetDraft({ budget, budgetUnknown: false });
  const setTiming = (timing: WeddingAnswers["timing"]) => updateAnswers({ timing });
  return (
    <>
      <QuestionField
        number="Q3"
        title="결혼식은 언제쯤인가요?"
        description="날짜가 없어도 괜찮아요. 대략적인 시기로 로드맵을 만들어요."
      >
        <div className={styles.timingChoices} role="group" aria-label="결혼 시기">
          <RadioCardGroup
            name="timing"
            value={answers.timing}
            options={[{ label: "날짜가 정해졌어요", value: "date" }]}
            onChange={() => setTiming("date")}
          />
          {answers.timing === "date" && (
            <WeddingTimingFields answers={answers} updateAnswers={updateAnswers} />
          )}
          <RadioCardGroup
            name="timing"
            value={answers.timing}
            options={[{ label: "대략적인 달만 정했어요", value: "month" }]}
            onChange={() => setTiming("month")}
          />
          {answers.timing === "month" && (
            <WeddingTimingFields answers={answers} updateAnswers={updateAnswers} />
          )}
          <RadioCardGroup
            name="timing"
            value={answers.timing}
            options={[{ label: "아직 정하지 않았어요", value: "unknown" }]}
            onChange={() => setTiming("unknown")}
          />
        </div>
      </QuestionField>
      <QuestionField
        number="Q4"
        title="생각해 둔 예산이 있나요?"
        description="예식장과 스드메에 쓸 예산이에요. 대략적인 금액도 괜찮아요."
      >
        <div className={styles.budgetInput}>
          <BudgetAmountField value={budget} onChange={editBudget} />
        </div>
        {amount && <p className={styles.budgetHint}>{formatBudgetAmount(amount)}만 원</p>}
        <div className={styles.budgetShortcuts}>
          {[500, 1000, 3000].map((increment) => (
            <button
              type="button"
              key={increment}
              onClick={() => editBudget(increaseBudgetInput(budget, increment))}
            >
              +{increment.toLocaleString("ko-KR")}만
            </button>
          ))}
          <button type="button" onClick={() => editBudget("")}>
            지우기
          </button>
        </div>
        <RadioCardGroup
          name="budgetUnknown"
          options={[{ label: "아직 없어요", value: "unknown" }]}
          value={budgetUnknown ? "unknown" : ""}
          onChange={() => setBudgetDraft({ budget: "", budgetUnknown: true })}
        />
      </QuestionField>
    </>
  );
}
