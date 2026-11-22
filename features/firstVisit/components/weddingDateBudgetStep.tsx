import { Select, RadioCardGroup, AmountField, TextField } from "@/src/components/common";
import { budgetLabel, type WeddingAnswers } from "../model";
import { QuestionField } from "./questionLayout";
import styles from "./question.module.css";

export function WeddingDateBudgetStep({
  answers,
  updateAnswers,
}: {
  answers: WeddingAnswers;
  updateAnswers: (patch: Partial<WeddingAnswers>) => void;
}) {
  const currentYear = new Date().getFullYear();
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
            <TextField
              aria-label="결혼 예정일"
              type="date"
              value={answers.date}
              onInput={(event) => updateAnswers({ date: event.currentTarget.value })}
              onChange={(event) => updateAnswers({ date: event.target.value })}
              required
            />
          )}
          <RadioCardGroup
            name="timing"
            value={answers.timing}
            options={[{ label: "대략적인 달만 정했어요", value: "month" }]}
            onChange={() => setTiming("month")}
          />
          {answers.timing === "month" && (
            <div className={styles.monthFields}>
              <Select
                aria-label="결혼 예정 연도"
                placeholder="연도"
                value={answers.year}
                options={Array.from({ length: 7 }, (_, index) => ({
                  label: `${currentYear + index}년`,
                  value: String(currentYear + index),
                }))}
                onChange={(event) => updateAnswers({ year: event.target.value })}
                required
              />
              <Select
                aria-label="결혼 예정 월"
                placeholder="월"
                value={answers.month}
                options={Array.from({ length: 12 }, (_, index) => ({
                  label: `${index + 1}월`,
                  value: String(index + 1),
                }))}
                onChange={(event) => updateAnswers({ month: event.target.value })}
                required
              />
            </div>
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
          <AmountField
            aria-label="결혼 예산"
            value={
              !answers.budgetUnknown && answers.budget
                ? Number(answers.budget).toLocaleString("ko-KR")
                : ""
            }
            placeholder="금액을 입력해 주세요"
            onChange={(event) =>
              updateAnswers({
                budget: event.target.value.replace(/\D/g, "").slice(0, 9),
                budgetUnknown: false,
              })
            }
          />
        </div>
        {answers.budget && !answers.budgetUnknown && (
          <p className={styles.budgetHint}>{budgetLabel(answers)}</p>
        )}
        <div className={styles.budgetShortcuts}>
          {[500, 1000, 3000].map((amount) => (
            <button
              type="button"
              key={amount}
              onClick={() =>
                updateAnswers({
                  budget: String(Number(answers.budgetUnknown ? 0 : answers.budget || 0) + amount),
                  budgetUnknown: false,
                })
              }
            >
              +{amount.toLocaleString("ko-KR")}만
            </button>
          ))}
          <button type="button" onClick={() => updateAnswers({ budget: "", budgetUnknown: false })}>
            지우기
          </button>
        </div>
        <RadioCardGroup
          name="budgetUnknown"
          options={[{ label: "아직 없어요", value: "unknown" }]}
          value={answers.budgetUnknown ? "unknown" : ""}
          onChange={() => updateAnswers({ budgetUnknown: true })}
        />
      </QuestionField>
    </>
  );
}
