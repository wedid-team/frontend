"use client";

/**
 * 로드맵 02 기본 · 03 전체 완료 · 04 예식일 미정 · 06 예산 입력 · 07 지난 단계 (피그마 677:4920)
 * 관련 정책: R-02 다음 할 일 / R-03 남은 예산 / R-06 예산 없을 때 / R-07 지난 단계 / R-08 D-day / E-04 · E-05
 */
import { Button } from "@/src/components/common";
import Link from "next/link";
import { useState } from "react";
import { InviteModal } from "../../invite/components/inviteModal";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  CopyIcon,
  LinkIcon,
  SlidersIcon,
  UsersIcon,
} from "../../planner/components/icons";
import { AssigneeChip, Avatar, StatusPill, cx } from "../../planner/components/ui";
import ui from "../../planner/components/ui.module.css";
import { STEP_DEFINITIONS } from "../../planner/mocks/plannerMock";
import { useCopyInviteLink } from "../../invite/hooks/useCopyInviteLink";
import { PLANNER_ROUTES } from "../../planner/routes";
import { usePlannerStore, useToastStore } from "../../planner/stores/plannerStore";
import type { PlannerState, StepDefinition } from "../../planner/types";
import { formatRange, formatWon } from "../../planner/utils/money";
import {
  formatDday,
  getDday,
  getNextStep,
  getSpentAmount,
  getStepDdayLabel,
  getStepPeriodLabel,
  isStepOverdue,
  resolveWeddingDate,
  type ResolvedWeddingDate,
} from "../../planner/utils/schedule";
import { BudgetInputCard } from "./budgetInputCard";
import { OverdueModal } from "./overdueModal";
import styles from "./roadmap.module.css";
import { WeddingDateModal } from "./weddingDateModal";

export function RoadmapView() {
  const state = usePlannerStore();
  const today = new Date();
  const wedding = resolveWeddingDate(state.weddingDate, today);
  const dday = getDday(wedding.date, today);
  const ddayLabel = formatDday(dday, wedding.isUndecided);

  const overdueSteps = STEP_DEFINITIONS.filter(
    (step) => isStepOverdue(step, state, dday) && !state.steps[step.id].isMarkedOverdue,
  );
  const isAllComplete = STEP_DEFINITIONS.every(
    (step) => state.steps[step.id].status === "complete",
  );
  /** R-02: 다음 할 일 = 가장 이른 미완료 단계 (시기가 지난 단계도 포함, SCR-06-F) */
  const nextStep = getNextStep(state);

  const [isInviteOpen, setInviteOpen] = useState(false);
  const [isDateOpen, setDateOpen] = useState(false);
  const [overdueDismissed, setOverdueDismissed] = useState(false);
  const [isOverdueOpenManually, setOverdueOpenManually] = useState(false);
  const isOverdueOpen = overdueSteps.length > 0 && (!overdueDismissed || isOverdueOpenManually);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.header__copy}>
          <p className={ui.eyebrow}>
            준비 로드맵 · 전체 {STEP_DEFINITIONS.length}단계 · 예식 {ddayLabel}
          </p>
          <div className={ui.pageTitleRow}>
            <h1 className={ui.pageTitle}>우리의 웨딩 로드맵</h1>
            {isAllComplete ? (
              <StatusPill tone="complete">준비 완료</StatusPill>
            ) : (
              <StatusPill status="inProgress" />
            )}
          </div>
          <p className={ui.pageLead}>결혼식을 위한 일정을 확인하고, 차근차근 준비해보세요.</p>
          <p className={styles.conditions}>
            예식 예정: {weddingLabel(wedding)} · {state.conditions.regionLabel} ·{" "}
            {state.conditions.guestLabel ?? "하객 수 미정"}
            {state.conditions.moods.length > 0 && ` · ${state.conditions.moods.join(" · ")}`} ·
            토요일 낮 예식 기준
            {/* TODO: 조건 수정은 A파트 결과 화면 오른쪽 패널(E-11)로 연결 — 경로 합의 필요 */}
            <Link className={cx(ui.textLink, ui["textLink--brand"])} href={PLANNER_ROUTES.estimate}>
              <SlidersIcon size={14} />
              조건 수정
            </Link>
          </p>
        </div>
        <Button size="md" variant="outline" onClick={() => setInviteOpen(true)}>
          <UsersIcon size={16} />
          짝꿍 초대
        </Button>
      </header>

      <div className={styles.layout}>
        <div className={styles.layout__main}>
          {/* 로드맵 04 · 07 피그마: 알림 띠는 왼쪽 칸 맨 위 (오른쪽 요약 카드와 윗줄을 맞춤) */}
          {wedding.isUndecided && (
            <div className={styles.notice}>
              <span className={cx(ui.iconTile, styles.notice__icon)}>
                <CalendarIcon size={16} />
              </span>
              <p className={styles.notice__text}>
                <strong>예식일이 아직 정해지지 않았어요.</strong> 지금은 {wedding.monthLabel} 예식
                기준으로 계산한 (예상) 일정이에요.
              </p>
              <Button size="sm" variant="outline" onClick={() => setDateOpen(true)}>
                예식일 정하기
                <ArrowRightIcon size={16} />
              </Button>
            </div>
          )}

          {overdueSteps.length > 0 && (
            <div className={styles.notice}>
              <span className={cx(ui.iconTile, styles.notice__icon)}>
                <CalendarIcon size={16} />
              </span>
              <p className={styles.notice__text}>
                <strong>확인이 필요한 단계 {overdueSteps.length}개가 있어요.</strong> 이미 했는지
                알려주시면 남은 예산을 맞게 계산해 드려요
              </p>
              <Button size="sm" variant="outline" onClick={() => setOverdueOpenManually(true)}>
                확인하기
              </Button>
            </div>
          )}

          {isAllComplete ? (
            <section className={styles.hero}>
              <StatusPill tone="onDark">모든 단계 완료</StatusPill>
              {/* 정책 R-09: 모두 완료 시 "모든 준비를 마쳤어요" (피그마 시안은 "결혼 준비를 모두 마쳤어요") */}
              <h2 className={styles.hero__title}>모든 준비를 마쳤어요</h2>
              <p className={styles.hero__meta}>행복한 결혼식 되세요!</p>
            </section>
          ) : (
            nextStep && (
              <NextStepCard
                dday={dday}
                ddayLabel={ddayLabel}
                isEstimated={wedding.isUndecided}
                state={state}
                step={nextStep}
                weddingDate={wedding.date}
              />
            )
          )}

          <section className={cx(ui.card, styles.schedule)}>
            <div className={ui.cardHeader}>
              <h2 className={ui.cardTitle}>전체 일정</h2>
              <span className={ui.cardMeta}>
                예식일 {wedding.monthLabel} 기준{wedding.isUndecided && " (예상)"}
              </span>
            </div>

            <ScheduleBars nextStepId={nextStep?.id ?? null} state={state} />

            {wedding.isUndecided && (
              <p className={styles.estimateNotice}>
                <CalendarIcon size={14} />
                (예상) {wedding.monthLabel} 예식 기준 일정이에요 · 예식일을 정하면 다시 계산돼요
              </p>
            )}

            {state.budget === null && <BudgetInputCard spentAmount={getSpentAmount(state)} />}

            <hr className={ui.divider} />

            <ol className={styles.stepList}>
              {STEP_DEFINITIONS.map((step) => (
                <StepRow
                  dday={dday}
                  isEstimated={wedding.isUndecided}
                  isNext={step.id === nextStep?.id}
                  key={step.id}
                  state={state}
                  step={step}
                  weddingDate={wedding.date}
                />
              ))}
            </ol>
          </section>
        </div>

        <aside className={styles.layout__aside}>
          <BudgetSummaryCard state={state} />
          <PlanCard partnerName={state.partner?.name ?? null} />
          <MemberCard onInvite={() => setInviteOpen(true)} state={state} />
        </aside>
      </div>

      {isInviteOpen && <InviteModal onClose={() => setInviteOpen(false)} />}
      <WeddingDateModal onClose={() => setDateOpen(false)} open={isDateOpen} />
      <OverdueModal
        dday={dday}
        onClose={() => {
          setOverdueDismissed(true);
          setOverdueOpenManually(false);
        }}
        open={isOverdueOpen}
        steps={overdueSteps}
      />
    </>
  );
}

function weddingLabel(wedding: ResolvedWeddingDate) {
  if (wedding.isUndecided) return `미정 (${wedding.monthLabel} 기준)`;
  return wedding.isEstimated
    ? wedding.monthLabel
    : `${wedding.monthLabel} ${wedding.date.getDate()}일`;
}

function NextStepCard({
  dday,
  ddayLabel,
  isEstimated,
  state,
  step,
  weddingDate,
}: {
  step: StepDefinition;
  state: PlannerState;
  dday: number;
  ddayLabel: string;
  isEstimated: boolean;
  weddingDate: Date;
}) {
  const estimate = state.stepEstimates[step.id];
  return (
    <section className={styles.hero}>
      <div className={styles.hero__top}>
        <StatusPill tone="onDark">다음 할 일 · {step.order}단계</StatusPill>
        <span className={styles.hero__period}>
          {getStepPeriodLabel(step, weddingDate)}
          {isEstimated && " (예상)"}
        </span>
      </div>
      <h2 className={styles.hero__title}>{step.title}</h2>
      <p className={styles.hero__meta}>
        예식 {ddayLabel} · 권장 시기 {getStepDdayLabel(step)}
        {dday < step.endDday && " · 시기가 지났어요"}
      </p>
      <div className={styles.hero__footer}>
        <div>
          <p className={styles.hero__budgetLabel}>이번 단계 예산</p>
          <p className={styles.hero__budget}>{estimate ? formatRange(estimate) : "—"}</p>
        </div>
        <Link
          className={cx(ui.button, ui["button--sm"], ui["button--onDark"])}
          href={PLANNER_ROUTES.step(step.id)}
        >
          단계 보기
          <ArrowRightIcon size={16} />
        </Link>
      </div>
    </section>
  );
}

function ScheduleBars({ nextStepId, state }: { state: PlannerState; nextStepId: string | null }) {
  const todosByStep = (stepId: string) => state.todos.filter((todo) => todo.stepId === stepId);
  return (
    <ol className={styles.bars}>
      {STEP_DEFINITIONS.map((step) => {
        const isComplete = state.steps[step.id].status === "complete";
        const isNext = step.id === nextStepId;
        const todos = todosByStep(step.id);
        const doneRatio = todos.length
          ? todos.filter((todo) => todo.isDone).length / todos.length
          : 0;
        // 완료 100% · 다음 할 일은 체크리스트 진행률(최소 40%로 강조) · 나머지 0
        const fill = isComplete ? 100 : isNext ? Math.max(doneRatio * 100, 40) : 0;
        return (
          <li className={styles.bars__item} key={step.id}>
            <span className={styles.bars__track}>
              <span className={styles.bars__fill} style={{ width: `${fill}%` }} />
            </span>
            <span
              className={cx(
                styles.bars__label,
                isNext && styles["bars__label--current"],
                !isComplete && !isNext && styles["bars__label--muted"],
              )}
            >
              {step.shortTitle}
            </span>
            <span className={styles.bars__dday}>{getStepDdayLabel(step)}</span>
          </li>
        );
      })}
    </ol>
  );
}

function StepRow({
  dday,
  isEstimated,
  isNext,
  state,
  step,
  weddingDate,
}: {
  step: StepDefinition;
  state: PlannerState;
  dday: number;
  isNext: boolean;
  isEstimated: boolean;
  weddingDate: Date;
}) {
  const progress = state.steps[step.id];
  const estimate = state.stepEstimates[step.id];
  const isComplete = progress.status === "complete";
  const isOverdue = isStepOverdue(step, state, dday);

  const metaParts = [
    getStepDdayLabel(step),
    `${getStepPeriodLabel(step, weddingDate)}${isEstimated ? " (예상)" : ""}`,
  ];
  if (isComplete && progress.actualAmount !== null)
    metaParts.push(`실제 ${formatWon(progress.actualAmount)}`);
  else if (!isComplete && estimate) metaParts.push(formatRange(estimate));

  return (
    <li className={styles.stepRow}>
      <span
        className={cx(
          styles.stepRow__marker,
          isComplete && styles["stepRow__marker--complete"],
          isNext && styles["stepRow__marker--next"],
        )}
      >
        {isComplete ? <CheckIcon size={16} /> : step.order}
      </span>
      <div className={styles.stepRow__copy}>
        <p
          className={cx(
            styles.stepRow__title,
            (isComplete || isNext) && styles["stepRow__title--strong"],
          )}
        >
          {step.title}
        </p>
        <p className={styles.stepRow__meta}>{metaParts.join(" · ")}</p>
      </div>
      <div className={styles.stepRow__action}>
        {isComplete ? (
          <StatusPill status="complete" />
        ) : isOverdue ? (
          <Link className={styles.stepRow__overdue} href={PLANNER_ROUTES.step(step.id)}>
            <StatusPill tone="overdue">
              {progress.isMarkedOverdue ? "시기가 지났어요" : "확인 필요"}
            </StatusPill>
          </Link>
        ) : (
          <Link
            className={cx(
              ui.button,
              ui["button--xs"],
              isNext ? ui["button--primary"] : ui["button--plain"],
            )}
            href={PLANNER_ROUTES.step(step.id)}
          >
            {isNext ? "시작하기" : "보기"}
          </Link>
        )}
      </div>
    </li>
  );
}

function BudgetSummaryCard({ state }: { state: PlannerState }) {
  const spent = getSpentAmount(state);
  return (
    <section className={cx(ui.card, ui["card--compact"])}>
      <div className={ui.cardHeader}>
        <h2 className={cx(ui.cardTitle, ui["cardTitle--small"])}>우리 예산</h2>
        <Link className={ui.textLink} href={PLANNER_ROUTES.estimate}>
          예상 비용
          <ChevronRightIcon size={14} />
        </Link>
      </div>
      <dl className={ui.definitionList}>
        <div className={ui.definitionList__row}>
          <dt className={ui.definitionList__term}>설정한 예산</dt>
          <dd className={ui.definitionList__value}>
            {state.budget === null ? "아직 없어요" : formatWon(state.budget)}
          </dd>
        </div>
        <div className={ui.definitionList__row}>
          <dt className={ui.definitionList__term}>지금까지 쓴 금액</dt>
          <dd className={ui.definitionList__value}>{formatWon(spent)}</dd>
        </div>
        {/* R-06: 예산이 없으면 "남은 예산" 대신 "지금까지 쓴 금액"만 */}
        {state.budget !== null && (
          <div className={ui.definitionList__row}>
            <dt className={ui.definitionList__term}>남은 예산</dt>
            <dd className={cx(ui.definitionList__value, ui["definitionList__value--emphasis"])}>
              {formatWon(state.budget - spent)}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}

/** SCR-06: 짝꿍이 없으면 초대 링크 + [복사] (P-06 · P-09), 합류하면 초대 부분 숨김 */
function PlanCard({ partnerName }: { partnerName: string | null }) {
  const showToast = useToastStore((state) => state.showToast);
  const { inviteUrl, copyLink, feedback } = useCopyInviteLink(showToast);
  return (
    <section className={cx(ui.card, ui["card--compact"], styles.planCard)}>
      {/* TODO: 피그마 일러스트 에셋을 받으면 넣기 (에셋 서버 접근 불가로 배경만 둠) */}
      <div aria-hidden="true" className={styles.planCard__visual} />
      <h2 className={cx(ui.cardTitle, ui["cardTitle--small"])}>웨딧과 함께하는 웨딩 플랜</h2>
      {partnerName ? (
        <p className={styles.planCard__text}>{partnerName} 님과 같은 로드맵을 함께 보고 있어요.</p>
      ) : (
        <>
          <p className={styles.planCard__text}>링크를 보내 초대하세요.</p>
          <div className={styles.planCard__link}>
            <LinkIcon className={styles.planCard__linkIcon} size={16} />
            <span className={styles.planCard__url} title={inviteUrl}>
              {inviteUrl}
            </span>
            <Button onClick={copyLink} size="sm" variant="dark">
              <CopyIcon size={14} />
              복사
            </Button>
          </div>
          <div role="status">{feedback && <p className={styles.planCard__text}>{feedback}</p>}</div>
        </>
      )}
    </section>
  );
}

function MemberCard({ onInvite, state }: { state: PlannerState; onInvite: () => void }) {
  return (
    <section className={cx(ui.card, ui["card--compact"])}>
      <div className={ui.cardHeader}>
        <h2 className={cx(ui.cardTitle, ui["cardTitle--small"])}>함께하는 멤버</h2>
        <Link className={ui.textLink} href={PLANNER_ROUTES.myInfo}>
          관리
          <ChevronRightIcon size={14} />
        </Link>
      </div>
      <ul className={styles.members}>
        <li className={styles.members__item}>
          <Avatar name={state.me.name} role="me" />
          <span className={styles.members__copy}>
            <strong>나 ({state.me.name})</strong>
            <span>{state.me.description}</span>
          </span>
          <AssigneeChip assignee="me" />
        </li>
        {state.partner ? (
          <li className={styles.members__item}>
            <Avatar name={state.partner.name} role="partner" />
            <span className={styles.members__copy}>
              <strong>파트너 ({state.partner.name})</strong>
              <span>{state.partner.description}</span>
            </span>
            <AssigneeChip assignee="partner" />
          </li>
        ) : (
          <li className={styles.members__item}>
            <span aria-hidden="true" className={styles.members__empty}>
              <UsersIcon size={16} />
            </span>
            <span className={styles.members__copy}>
              <strong>짝꿍 자리</strong>
              <span>초대하면 여기에 보여요</span>
            </span>
            <Button size="sm" variant="outline" onClick={onInvite}>
              초대
            </Button>
          </li>
        )}
      </ul>
    </section>
  );
}
