"use client";

/** 로드맵 06 예산 입력 카드 (E-05 · E-06 · R-06) */
import { useState } from "react";
import { AmountField, Button } from "@/src/components/common";
import { usePlannerStore, useToastStore } from "../../planner/stores/plannerStore";
import {
  formatAmountInput,
  formatWon,
  parseAmountInput,
  validateBudget,
} from "../../planner/utils/money";
import styles from "./roadmap.module.css";

export function BudgetInputCard({ spentAmount }: { spentAmount: number }) {
  const setBudget = usePlannerStore((state) => state.setBudget);
  const showToast = useToastStore((state) => state.showToast);
  const [value, setValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const message = validateBudget(value);
    if (message) {
      setError(message);
      return;
    }
    setBudget(value!);
    showToast("예산을 넣었어요. 남은 예산을 다시 계산했어요");
  };

  return (
    <div className={styles.budgetInput}>
      <div className={styles.budgetInput__spent}>
        <span className={styles.budgetInput__label}>지금까지 쓴 금액</span>
        <strong className={styles.budgetInput__amount}>{formatWon(spentAmount)}</strong>
      </div>
      <form
        className={styles.budgetInput__form}
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <p className={styles.budgetInput__title}>예산을 정하면 남은 예산을 계산해드려요</p>
        <p className={styles.budgetInput__desc}>
          총 예산을 넣으면 단계별로 얼마나 남았는지 보여드려요. 나중에 넣어도 돼요.
        </p>
        <div className={styles.budgetInput__row}>
          <AmountField
            aria-label="총 예산"
            error={error ?? undefined}
            onChange={(event) => {
              setValue(parseAmountInput(event.target.value));
              setError(null);
            }}
            placeholder="금액 입력"
            value={formatAmountInput(value)}
          />
          <Button size="lg" type="submit" variant={value ? "primary" : "soft"}>
            예산 넣기
          </Button>
        </div>
      </form>
    </div>
  );
}
