import { AmountField, Select, TextField } from "@/src/components/common";
import { formatBudgetAmount, parseBudgetInput, type WeddingAnswers } from "../../model";
import styles from "../questions/question.module.css";

export type ConditionFieldProps = {
  answers: WeddingAnswers;
  updateAnswers: (patch: Partial<WeddingAnswers>) => void;
};

export function BudgetAmountField({
  value,
  onChange,
  placeholder = "금액을 입력해 주세요",
  label,
  hint,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
}) {
  const { amount, error } = parseBudgetInput(value);
  return (
    <AmountField
      aria-label={label ? undefined : "결혼 예산"}
      label={label}
      value={value}
      placeholder={placeholder}
      error={error}
      hint={hint}
      onChange={(event) => onChange(event.target.value)}
      onBlur={() => {
        if (amount) {
          const formatted = formatBudgetAmount(amount);
          if (formatted !== value) onChange(formatted);
        }
      }}
    />
  );
}

export function WeddingTimingFields({ answers, updateAnswers }: ConditionFieldProps) {
  if (answers.timing === "date") {
    return (
      <TextField
        aria-label="결혼 예정일"
        type="date"
        value={answers.date}
        onInput={(event) => updateAnswers({ date: event.currentTarget.value })}
        onChange={(event) => updateAnswers({ date: event.target.value })}
        required
      />
    );
  }
  if (answers.timing !== "month") return null;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, index) => String(currentYear + index));
  if (/^\d{4}$/.test(answers.year) && !years.includes(answers.year)) years.unshift(answers.year);
  return (
    <div className={styles.monthFields}>
      <Select
        aria-label="결혼 예정 연도"
        placeholder="연도"
        value={answers.year}
        options={years.map((value) => ({ label: `${value}년`, value }))}
        onChange={(event) => updateAnswers({ year: event.target.value })}
        required
      />
      <Select
        aria-label="결혼 예정 월"
        placeholder="월"
        value={answers.month ? String(Number(answers.month)) : ""}
        options={Array.from({ length: 12 }, (_, index) => ({
          label: `${index + 1}월`,
          value: String(index + 1),
        }))}
        onChange={(event) => updateAnswers({ month: event.target.value })}
        required
      />
    </div>
  );
}
