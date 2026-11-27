"use client";

/**
 * 단계 05 완료 취소 (피그마 677:8851)
 * 확인 필요: 정책 정의서에 완료 취소 항목이 없어 피그마 문구 기준으로 구현
 * — 진행중으로 돌아가고, 실제 금액은 지우지 않고 남은 예산 계산에서만 뺀다.
 */
import { Button } from "@/src/components/common";
import { RefreshIcon } from "../../planner/components/icons";
import { Dialog, cx } from "../../planner/components/ui";
import ui from "../../planner/components/ui.module.css";
import { usePlannerStore } from "../../planner/stores/plannerStore";
import type { StepDefinition } from "../../planner/types";

export function CancelCompleteModal({
  onClose,
  open,
  step,
}: {
  open: boolean;
  onClose: () => void;
  step: StepDefinition;
}) {
  const cancelComplete = usePlannerStore((state) => state.cancelComplete);

  return (
    <Dialog labelledBy="cancel-complete-title" onClose={onClose} open={open} variant="narrow">
      <span
        className={cx(
          ui.iconTile,
          ui["iconTile--hero"],
          ui["iconTile--neutral"],
          ui.dialog__iconTile,
        )}
      >
        <RefreshIcon size={22} />
      </span>
      <h2 className={ui.dialog__title} id="cancel-complete-title">
        {step.title} 완료를 취소할까요?
      </h2>
      <p className={ui.dialog__description}>
        진행중 상태로 돌아가요.
        {step.hasAmount && " 넣은 실제 금액은 지워지지 않고, 남은 예산 계산에서만 빠져요."}
      </p>
      <div className={ui.dialog__actions}>
        <Button size="lg" variant="outline" onClick={onClose}>
          닫기
        </Button>
        <Button
          size="lg"
          variant="primary"
          onClick={() => {
            cancelComplete(step.id);
            onClose();
          }}
        >
          완료 취소
        </Button>
      </div>
    </Dialog>
  );
}
