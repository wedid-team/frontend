import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button, CheckboxCardGroup, Select } from "@/src/components/common";
import { assets } from "../assets";
import {
  conditionLabel,
  formatBudgetAmount,
  guestOptions,
  hasRegionAnswers,
  hasTimingAnswers,
  moodOptions,
  parseBudgetInput,
  regionOptions,
  selectMoods,
  timingOptions,
  type EstimateTier,
  type WeddingAnswers,
} from "../model";
import { loadMockEstimate } from "../mockEstimate";
import { BudgetAmountField, WeddingTimingFields } from "./conditionFields";
import { FlowIcon } from "./flowUi";
import styles from "./editConditionsDrawer.module.css";

export function EditConditionsDrawer({
  answers,
  tier,
  onApply,
  onClose,
}: {
  answers: WeddingAnswers;
  tier: EstimateTier;
  onApply: (answers: WeddingAnswers) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const request = useRef<AbortController | null>(null);
  const [draft, setDraft] = useState(() => ({
    ...answers,
    budget: answers.budgetUnknown ? "" : formatBudgetAmount(answers.budget),
  }));
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const nextAnswers = { ...draft, budget: parseBudgetInput(draft.budget).amount ?? "" };
  const dirty =
    conditionLabel(nextAnswers) !== conditionLabel(answers) ||
    nextAnswers.budget !== (answers.budgetUnknown ? "" : answers.budget);
  const canApply = dirty && hasRegionAnswers(nextAnswers) && hasTimingAnswers(nextAnswers);

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const abortRequest = () => request.current?.abort();
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    window.addEventListener("popstate", abortRequest);
    return () => {
      window.removeEventListener("popstate", abortRequest);
      abortRequest();
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, []);

  function updateDraft(patch: Partial<WeddingAnswers>) {
    setDraft((previous) => ({ ...previous, ...patch }));
  }

  function close() {
    request.current?.abort();
    onClose();
  }

  async function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canApply || request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setFailed(false);
    setPending(true);
    try {
      const result = await loadMockEstimate(nextAnswers, tier, controller.signal);
      if (!controller.signal.aborted) onApply(result.conditions);
    } catch {
      setPending(false);
      if (!controller.signal.aborted) setFailed(true);
    } finally {
      request.current = null;
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.drawer}
      aria-labelledby="editConditionsTitle"
      aria-describedby="editConditionsDescription"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className={styles.content}>
        <header className={styles.heading}>
          <h2 className="tH4" id="editConditionsTitle">
            조건 수정
          </h2>
          <button
            type="button"
            className={styles.close}
            aria-label="조건 수정 닫기"
            onClick={close}
            autoFocus
          >
            <FlowIcon icon={assets.icons.close} />
          </button>
        </header>
        <p className={styles.description} id="editConditionsDescription">
          바꾼 조건으로 예상 비용을 다시 계산해요. 질문 화면으로 돌아가지 않아요.
        </p>
        <form className={styles.form} onSubmit={apply} aria-busy={pending}>
          <fieldset className={styles.fields} disabled={pending}>
            <Select
              label="지역"
              placeholder="지역을 선택해 주세요"
              value={draft.region}
              options={regionOptions}
              onChange={(event) => updateDraft({ region: event.target.value })}
              required
            />
            <Select
              label="하객 수"
              placeholder="하객 수를 선택해 주세요"
              value={draft.guests}
              options={guestOptions}
              onChange={(event) => updateDraft({ guests: event.target.value })}
              required
            />
            <div className={styles.timing}>
              <Select
                label="예식 예정 시기"
                value={draft.timing}
                options={timingOptions}
                onChange={(event) =>
                  updateDraft({ timing: event.target.value as WeddingAnswers["timing"] })
                }
              />
              {draft.timing !== "unknown" && (
                <div className={styles.timingFields}>
                  <WeddingTimingFields answers={draft} updateAnswers={updateDraft} />
                </div>
              )}
            </div>
            <div className={styles.budgetField}>
              <BudgetAmountField
                label="예산 (선택)"
                placeholder="3,000"
                hint="비워 두면 ‘아직 없어요’로 계산해요."
                value={draft.budget}
                onChange={(budget) => updateDraft({ budget, budgetUnknown: budget === "" })}
              />
            </div>
            <div className={styles.moods}>
              <CheckboxCardGroup
                name="editedMoods"
                label="선호 분위기 (선택)"
                options={moodOptions}
                value={draft.moods}
                onChange={(next) => updateDraft({ moods: selectMoods(draft.moods, next) })}
              />
              <p>분위기는 비용에 영향을 주지 않고, 예식장 후보 순서에만 반영돼요.</p>
            </div>
          </fieldset>
          <div className={styles.actions}>
            {failed && <p role="alert">다시 계산하지 못했어요. 다시 시도해 주세요.</p>}
            <Button type="submit" size="lg" disabled={!canApply || pending}>
              {pending ? "다시 계산하는 중…" : "이 조건으로 다시 계산"}
            </Button>
            <Button size="lg" variant="outline" onClick={close}>
              취소
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
