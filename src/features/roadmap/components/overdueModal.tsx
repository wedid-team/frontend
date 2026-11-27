"use client";

/**
 * 로드맵 07 지난 단계 팝업 (R-07 · PM 디자인 추가 요청 #8)
 * [이미 했어요] → 금액 단계(예식장 · 스드메)는 카드 안에 실제 금액 입력 줄 + [완료하기] / [취소]
 *               그 외 단계는 바로 완료
 * [아직 안 했어요] → "시기가 지났어요" 표시 후 유지
 */
import { useState } from "react";
import { AmountField, Button } from "@/src/components/common";
import { Dialog } from "../../planner/components/ui";
import ui from "../../planner/components/ui.module.css";
import { usePlannerStore, useToastStore } from "../../planner/stores/plannerStore";
import type { StepDefinition, StepId } from "../../planner/types";
import {
  BUDGET_MAX,
  formatAmountInput,
  formatRange,
  parseAmountInput,
} from "../../planner/utils/money";
import { getStepDdayLabel } from "../../planner/utils/schedule";
import styles from "./roadmap.module.css";

type OverdueModalProps = {
  open: boolean;
  onClose: () => void;
  steps: StepDefinition[];
  dday: number;
};

export function OverdueModal({ dday, onClose, open, steps }: OverdueModalProps) {
  const estimates = usePlannerStore((state) => state.stepEstimates);
  const completeStep = usePlannerStore((state) => state.completeStep);
  const markNotDoneYet = usePlannerStore((state) => state.markNotDoneYet);
  const showToast = useToastStore((state) => state.showToast);
  const completeWithToast = (step: StepDefinition, amount?: number) => {
    completeStep(step.id, amount);
    showToast(`${step.title} 완료! 남은 예산을 다시 계산했어요`); // SCR-06-B
  };

  /** 금액 입력 줄을 연 단계 (한 번에 하나) */
  const [amountStepId, setAmountStepId] = useState<StepId | null>(null);

  const handleDone = (step: StepDefinition) => {
    if (step.hasAmount) {
      setAmountStepId(step.id);
      return;
    }
    completeWithToast(step);
  };

  return (
    <Dialog labelledBy="overdue-title" onClose={onClose} open={open} variant="wide">
      <p className={ui.dialog__eyebrow}>지난 단계 확인</p>
      <h2 className={ui.dialog__title} id="overdue-title">
        확인해주세요!
      </h2>
      <p className={ui.dialog__description}>
        예식까지 {dday}일 남아 권장 시기가 지난 단계가 있어요. 이미 했는지 알려주시면 남은 예산을
        맞게 계산해 드려요.
      </p>

      <ul className={styles.overdueList}>
        {steps.map((step) => {
          const estimate = estimates[step.id];
          const isEnteringAmount = amountStepId === step.id;
          return (
            <li className={styles.overdueList__item} key={step.id}>
              <div className={styles.overdueList__row}>
                <div className={styles.overdueList__copy}>
                  <span className={styles.overdueList__meta}>
                    {getStepDdayLabel(step)} · 시기가 지났어요
                  </span>
                  <strong className={styles.overdueList__title}>{step.title}</strong>
                  <span className={styles.overdueList__meta}>
                    {estimate
                      ? `예상 ${formatRange(estimate)}`
                      : (step.costNote ?? "따로 드는 비용 없음")}
                  </span>
                </div>
                {!isEnteringAmount && (
                  <div className={styles.overdueList__actions}>
                    <Button onClick={() => handleDone(step)} size="sm" variant="primary">
                      이미 했어요
                    </Button>
                    <Button onClick={() => markNotDoneYet(step.id)} size="sm" variant="outline">
                      아직 안 했어요
                    </Button>
                  </div>
                )}
              </div>
              {isEnteringAmount && (
                <AmountEntryRow
                  onCancel={() => setAmountStepId(null)}
                  onComplete={(amount) => {
                    completeWithToast(step, amount);
                    setAmountStepId(null);
                  }}
                  placeholder={estimate ? formatAmountInput(estimate.min) : "금액 입력"}
                  stepTitle={step.title}
                />
              )}
            </li>
          );
        })}
      </ul>

      <p className={styles.overdueList__footnote}>
        나중에 해도 돼요 · 로드맵 위 [확인하기]로 다시 열 수 있어요
      </p>
    </Dialog>
  );
}

/** 카드 안 실제 금액 입력 줄 — R-09: 금액 단계는 실제 금액을 넣어야 완료 */
function AmountEntryRow({
  onCancel,
  onComplete,
  placeholder,
  stepTitle,
}: {
  stepTitle: string;
  placeholder: string;
  onComplete: (amount: number) => void;
  onCancel: () => void;
}) {
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (amount === null || amount <= 0) {
      setError("실제 계약 금액을 넣어야 완료할 수 있어요.");
      return;
    }
    if (amount > BUDGET_MAX) {
      setError("금액은 99,999만 원까지 입력할 수 있어요.");
      return;
    }
    onComplete(amount);
  };

  return (
    <form
      className={styles.overdueList__amount}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <AmountField
        aria-label={`${stepTitle} 실제 계약 금액`}
        autoFocus
        error={error ?? undefined}
        onChange={(event) => {
          setAmount(parseAmountInput(event.target.value));
          setError(null);
        }}
        placeholder={placeholder}
        value={formatAmountInput(amount)}
      />
      <Button size="lg" type="submit" variant="primary">
        완료하기
      </Button>
      <Button onClick={onCancel} size="lg" variant="outline">
        취소
      </Button>
    </form>
  );
}
