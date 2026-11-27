"use client";

/**
 * 단계 01 예식장 진행중 · 02 예식장 완료 · 03 스드메 진행중 · 04 스드메 완료 · 05 완료 취소 · 06 할 일 추가 · 07 토스트
 * (피그마 677:4920) 관련 정책: R-02 · R-03 · R-04 · R-09 · R-10 · P-07 · D-02 · D-06
 * 확인 필요: 금액 단계가 아닌 단계(1 · 4 · 5 · 6) 상세 화면은 피그마에 없어 같은 틀로 만들었다.
 */
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  BulbIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FlagIcon,
  PinIcon,
  PlusIcon,
  RefreshIcon,
} from "../../planner/components/icons";
import { AmountField, Button, Checkbox } from "@/src/components/common";
import { venues } from "@/features/venues/venueData";
import { AssigneeChip, StatusPill, cx } from "../../planner/components/ui";
import ui from "../../planner/components/ui.module.css";
import {
  STEP_DEFINITIONS,
  SDM_TIER_OPTIONS,
  getStepDefinition,
} from "../../planner/mocks/plannerMock";
import { PLANNER_ROUTES } from "../../planner/routes";
import { usePlannerStore, useToastStore } from "../../planner/stores/plannerStore";
import type { PlannerState, StepDefinition, StepId } from "../../planner/types";
import {
  BUDGET_MAX,
  formatAmountInput,
  formatRange,
  formatWon,
  parseAmountInput,
} from "../../planner/utils/money";
import {
  BUDGET_VERDICT_LABEL,
  getBudgetVerdict,
  getRemainingEstimate,
  getSpentAmount,
  getStepDdayLabel,
  getStepPeriodLabel,
  resolveWeddingDate,
} from "../../planner/utils/schedule";
import { AddTodoModal } from "./addTodoModal";
import { CancelCompleteModal } from "./cancelCompleteModal";
import { SdmBudgetCard } from "./sdmBudgetCard";
import styles from "./step.module.css";

const SEARCH_CTA: Partial<Record<StepId, { label: string; href: string }>> = {
  venue: { label: "예식장 후보 보기", href: PLANNER_ROUTES.venueSearch },
  sdm: { label: "스드메 후보 보기", href: PLANNER_ROUTES.sdmSearch },
};

export function StepView({ stepId }: { stepId: StepId }) {
  const state = usePlannerStore();
  const step = getStepDefinition(stepId);
  const progress = state.steps[stepId];
  const isComplete = progress.status === "complete";
  const estimate = state.stepEstimates[stepId] ?? null;
  const wedding = resolveWeddingDate(state.weddingDate, new Date());

  const [isCancelOpen, setCancelOpen] = useState(false);
  const [isAddTodoOpen, setAddTodoOpen] = useState(false);

  const index = STEP_DEFINITIONS.findIndex((item) => item.id === stepId);
  const prevStep = STEP_DEFINITIONS[index - 1];
  const nextStep = STEP_DEFINITIONS[index + 1];
  const tierLabel = SDM_TIER_OPTIONS.find((tier) => tier.id === state.sdmTier)?.label;
  const cta = SEARCH_CTA[stepId];
  const selectedVenue =
    stepId === "venue" ? venues.find(({ id }) => id === state.selectedVenueId) : undefined;

  return (
    <>
      <Link className={cx(ui.textLink, styles.backLink)} href={PLANNER_ROUTES.roadmap}>
        <ChevronLeftIcon size={14} />
        준비 로드맵으로
      </Link>

      <header className={styles.header}>
        <div className={styles.header__copy}>
          <p className={ui.eyebrow}>
            {step.order}단계 · {getStepDdayLabel(step)}
          </p>
          <div className={ui.pageTitleRow}>
            <h1 className={ui.pageTitle}>{step.title}</h1>
            <StatusPill status={isComplete ? "complete" : "inProgress"} />
          </div>
          <p className={ui.pageLead}>
            {step.hasAmount
              ? "이번 단계에 할 일을 마치고 실제 계약 금액을 넣으면 단계를 완료할 수 있어요."
              : "이번 단계에 할 일을 마치면 단계를 완료할 수 있어요."}
          </p>
          {selectedVenue && (
            <p className={ui.pageLead}>
              선택한 예식장 <strong>{selectedVenue.name}</strong>
            </p>
          )}
        </div>
        <div className={styles.header__side}>
          {!isComplete && cta && (
            <Link
              className={cx(ui.button, ui["button--md"], ui["button--primary"])}
              href={cta.href}
            >
              <PinIcon size={16} />
              {cta.label}
            </Link>
          )}
          {/* SCR-06-D: 금액 없는 단계는 "이번 단계 예산 —" */}
          {(step.hasAmount || !isComplete) && (
            <div className={styles.amountTag}>
              <span className={styles.amountTag__label}>
                {isComplete ? "실제 계약 금액" : "이번 단계 예산"}
              </span>
              <strong className={styles.amountTag__value}>
                {isComplete && progress.actualAmount !== null
                  ? formatWon(progress.actualAmount)
                  : estimate
                    ? formatRange(estimate)
                    : "—"}
              </strong>
              {!isComplete && stepId === "sdm" && (
                <span className={styles.amountTag__label}>
                  {tierLabel} 예산대 · 스·드·메 단품가 합산
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.layout__main}>
          {stepId === "venue" && !isComplete && !selectedVenue && (
            <div className={styles.notice}>
              <span className={styles.notice__icon}>
                <PinIcon size={16} />
              </span>
              <p className={styles.notice__text}>
                <strong>계약할 예식장을 아직 정하지 않았어요.</strong> 후보를 비교하고 한 곳을 골라
                보세요.
              </p>
              <Link
                className={cx(ui.button, ui["button--xs"], ui["button--outline"])}
                href={PLANNER_ROUTES.venueSearch}
              >
                예식장 찾기
              </Link>
            </div>
          )}

          {stepId === "sdm" && <SdmBudgetCard isLocked={isComplete} />}

          <section className={ui.card}>
            <h2 className={ui.cardTitle}>진행 리스트</h2>
            <p className={styles.period}>
              {getStepDdayLabel(step)} · {getStepPeriodLabel(step, wedding.date)}
              {wedding.isUndecided && " (예상)"}
            </p>

            <Checklist onAdd={() => setAddTodoOpen(true)} state={state} stepId={stepId} />

            <hr className={ui.divider} />

            <CompletionForm
              estimate={estimate}
              key={`${stepId}-${progress.status}`}
              onCancel={() => setCancelOpen(true)}
              state={state}
              step={step}
            />
          </section>

          {isComplete && nextStep && (
            <Link
              className={cx(ui.textLink, ui["textLink--brand"], styles.nextLink)}
              href={PLANNER_ROUTES.step(nextStep.id)}
            >
              다음: {nextStep.title}
              <ArrowRightIcon size={14} />
            </Link>
          )}
        </div>

        <aside className={styles.layout__aside}>
          {isComplete && step.hasAmount && <RemainingBudgetCard state={state} />}
          <GuideCard icon={<FlagIcon size={16} />} items={step.decisions} title="정해야 할 것" />
          <GuideCard icon={<BulbIcon size={16} />} items={step.tips} title="알아두면 좋은 점" />
          <nav aria-label="이전 · 다음 단계" className={styles.stepNav}>
            {prevStep ? (
              <Link className={ui.textLink} href={PLANNER_ROUTES.step(prevStep.id)}>
                <ChevronLeftIcon size={14} />
                {prevStep.shortTitle}
              </Link>
            ) : (
              <span />
            )}
            {nextStep && (
              <Link className={ui.textLink} href={PLANNER_ROUTES.step(nextStep.id)}>
                {nextStep.shortTitle}
                <ChevronRightIcon size={14} />
              </Link>
            )}
          </nav>
        </aside>
      </div>

      <CancelCompleteModal onClose={() => setCancelOpen(false)} open={isCancelOpen} step={step} />
      <AddTodoModal
        defaultStepId={stepId}
        key={stepId}
        onClose={() => setAddTodoOpen(false)}
        open={isAddTodoOpen}
      />
    </>
  );
}

function Checklist({
  onAdd,
  state,
  stepId,
}: {
  state: PlannerState;
  stepId: StepId;
  onAdd: () => void;
}) {
  const toggleTodo = usePlannerStore((store) => store.toggleTodo);
  const todos = state.todos.filter((todo) => todo.stepId === stepId);
  const doneCount = todos.filter((todo) => todo.isDone).length;

  return (
    <div className={styles.checklist}>
      <div className={styles.checklist__header}>
        <h3 className={styles.checklist__title}>체크리스트</h3>
        <div className={styles.checklist__progress}>
          <span className={styles.checklist__count}>
            <strong>{doneCount}</strong> / {todos.length} 완료
          </span>
          <span className={styles.checklist__track}>
            <span
              className={styles.checklist__bar}
              style={{ width: `${todos.length ? (doneCount / todos.length) * 100 : 0}%` }}
            />
          </span>
          <button
            className={cx(ui.textLink, ui["textLink--brand"], styles.checklist__add)}
            onClick={onAdd}
            type="button"
          >
            <PlusIcon size={14} />할 일 추가
          </button>
        </div>
      </div>

      {todos.length === 0 ? (
        <p className={styles.checklist__empty}>아직 할 일이 없어요. [할 일 추가]로 넣어 보세요.</p>
      ) : (
        <ul className={styles.checklist__list}>
          {todos.map((todo) => (
            <li key={todo.id}>
              <div className={styles.todo}>
                <Checkbox checked={todo.isDone} onChange={() => toggleTodo(todo.id)}>
                  <span className={cx(todo.isDone && styles["todo__title--done"])}>
                    {todo.title}
                  </span>
                </Checkbox>
                <AssigneeChip assignee={todo.assignee} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CompletionForm({
  estimate,
  onCancel,
  state,
  step,
}: {
  step: StepDefinition;
  state: PlannerState;
  estimate: { min: number; max: number } | null;
  onCancel: () => void;
}) {
  const completeStep = usePlannerStore((store) => store.completeStep);
  const updateAmount = usePlannerStore((store) => store.updateAmount);
  const showToast = useToastStore((store) => store.showToast);
  const progress = state.steps[step.id];
  /** SCR-06-B: 완료 · 금액 수정 직후 토스트 (3초) */
  const completedToast = `${step.title} 완료! 남은 예산을 다시 계산했어요`;
  const isComplete = progress.status === "complete";
  const [amountInput, setAmountInput] = useState(() => formatAmountInput(progress.actualAmount));
  const [error, setError] = useState<string | null>(null);
  const trimmedAmount = amountInput.trim();
  const validFormat = /^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(trimmedAmount);
  const amount = validFormat ? parseAmountInput(trimmedAmount) : null;

  const submit = () => {
    if (!step.hasAmount) {
      completeStep(step.id);
      showToast(completedToast);
      return;
    }
    if (trimmedAmount && !validFormat) {
      setError("계약 금액은 숫자 또는 올바른 천 단위 쉼표로 입력해 주세요.");
      return;
    }
    if (amount === null || amount <= 0) {
      setError("실제 계약 금액을 넣어야 단계를 완료할 수 있어요.");
      return;
    }
    if (amount > BUDGET_MAX) {
      setError("금액은 99,999만 원까지 입력할 수 있어요.");
      return;
    }
    if (isComplete) updateAmount(step.id, amount);
    else completeStep(step.id, amount);
    showToast(completedToast);
  };

  if (!step.hasAmount) {
    return isComplete ? (
      <CompletedBanner onCancel={onCancel} text="이 단계를 완료했어요" />
    ) : (
      <div className={styles.completeOnly}>
        <Button onClick={submit} size="xl">
          단계 완료하기
        </Button>
      </div>
    );
  }

  return (
    <form
      className={styles.amountForm}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      {isComplete && progress.actualAmount !== null && (
        <CompletedBanner
          onCancel={onCancel}
          text={`이 단계를 완료했어요 · 실제 ${formatWon(progress.actualAmount)}`}
        />
      )}
      <label className={styles.amountForm__label} htmlFor={`amount-${step.id}`}>
        실제 계약 금액
      </label>
      <div className={styles.amountForm__row}>
        <AmountField
          error={error ?? undefined}
          hint={
            isComplete
              ? "금액을 고치면 남은 예산을 바로 다시 계산해요."
              : `${estimate ? `예상 범위 ${formatRange(estimate)} · ` : ""}실제 금액을 넣으면 남은 예산을 다시 계산해요.`
          }
          id={`amount-${step.id}`}
          onBlur={() => {
            if (validFormat) setAmountInput(formatAmountInput(amount));
          }}
          onChange={(event) => {
            setAmountInput(event.target.value);
            setError(null);
          }}
          placeholder={estimate ? formatAmountInput(estimate.min) : "금액 입력"}
          value={amountInput}
        />
        <Button size="lg" type="submit" variant={isComplete ? "outline" : "primary"}>
          {isComplete ? "금액 수정" : "단계 완료하기"}
        </Button>
      </div>
    </form>
  );
}

function CompletedBanner({ onCancel, text }: { text: string; onCancel: () => void }) {
  return (
    <div className={styles.completed}>
      <CheckIcon size={16} />
      <span className={styles.completed__text}>{text}</span>
      <button
        className={cx(ui.textLink, styles.completed__cancel)}
        onClick={onCancel}
        type="button"
      >
        <RefreshIcon size={14} />
        완료 취소
      </button>
    </div>
  );
}

/** SCR-06-B 판정 배지 표시 (Q-24): ✓ 충분 / ▲ 부족할 수 있음 / ■ 부족 */
const VERDICT_MARK = { enough: "✓", tight: "▲", short: "■" } as const;

/** R-03 · R-10 · Q-24(배지 문구 제안) */
function RemainingBudgetCard({ state }: { state: PlannerState }) {
  if (state.budget === null) {
    // R-06: 예산이 없으면 판정 없이 쓴 금액만
    return (
      <section className={cx(ui.card, ui["card--compact"], styles.remaining)}>
        <p className={styles.remaining__label}>지금까지 쓴 금액</p>
        <p className={styles.remaining__value}>{formatWon(getSpentAmount(state))}</p>
      </section>
    );
  }

  const spent = getSpentAmount(state);
  const remaining = state.budget - spent;
  const estimate = getRemainingEstimate(state);
  const amountSteps = STEP_DEFINITIONS.filter((step) => step.hasAmount);
  const completedAmountSteps = amountSteps.filter(
    (step) => state.steps[step.id].status === "complete",
  );
  const isAllAmountDone = completedAmountSteps.length === amountSteps.length;
  const verdict = estimate ? getBudgetVerdict(remaining, estimate) : null;

  const formula = [
    formatWon(state.budget),
    ...completedAmountSteps.map(
      (step) =>
        `${step.shortTitle.replace(" 계약", "")} 실제 ${formatWon(state.steps[step.id].actualAmount ?? 0)}`,
    ),
  ].join(" − ");

  return (
    <section className={cx(ui.card, ui["card--compact"], styles.remaining)}>
      <p className={styles.remaining__label}>남은 예산</p>
      <p className={cx(styles.remaining__value, remaining < 0 && styles["remaining__value--over"])}>
        {formatWon(remaining)}
      </p>
      <p className={styles.remaining__formula}>{formula}</p>
      {remaining < 0 && (
        <p className={styles.remaining__over}>
          <AlertCircleIcon size={14} />
          예산을 {formatWon(Math.abs(remaining))} 넘었어요
        </p>
      )}
      {verdict && remaining >= 0 && (
        <span className={cx(styles.verdict, styles[`verdict--${verdict}`])}>
          {VERDICT_MARK[verdict]} {BUDGET_VERDICT_LABEL[verdict]}
        </span>
      )}
      <hr className={styles.remaining__divider} />
      <p className={styles.remaining__foot}>
        {isAllAmountDone ? (
          <>
            예식장 · 스드메 계약을 모두 마쳤어요 · 남은 예산 <strong>{formatWon(remaining)}</strong>
          </>
        ) : (
          estimate && (
            <>
              남은 단계 예상 비용 <strong>{formatRange(estimate)}</strong>
            </>
          )
        )}
      </p>
    </section>
  );
}

function GuideCard({ icon, items, title }: { icon: ReactNode; title: string; items: string[] }) {
  return (
    <section className={cx(ui.card, ui["card--side"])}>
      <div className={styles.guide__header}>
        <span className={ui.iconTile}>{icon}</span>
        <h2 className={cx(ui.cardTitle, ui["cardTitle--small"])}>{title}</h2>
      </div>
      <ul className={styles.guide__list}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
