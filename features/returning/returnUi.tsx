"use client";

import { useUtAuthStore } from "@/src/stores/utAuthStore";
import { ASSIGNEE_LABEL } from "@/src/features/planner/components/ui";
import { PLANNER_ROUTES } from "@/src/features/planner/routes";
import { usePlannerStore } from "@/src/features/planner/stores/plannerStore";
import type { PlannerState, StepDefinition } from "@/src/features/planner/types";
import { formatRange, formatWon } from "@/src/features/planner/utils/money";
import Image from "next/image";
import Link from "next/link";
import { useId, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DiscoveryIcon } from "../venues/shared";
import { formatPlanBudget, getSavedPlanSummary, getWeddingDateDisplay } from "./savedPlanSummary";
import s from "./returning.module.css";

export { s };

export function Progress({ value, label = "전체 진행률" }: { value: number; label?: string }) {
  return <progress className={s.progress} max={100} value={value} aria-label={label} />;
}

function Checklist({ tasks }: { tasks: PlannerState["todos"] }) {
  const toggleTodo = usePlannerStore((state) => state.toggleTodo);
  if (tasks.length === 0) return <p className={s.empty}>할 일이 없어요</p>;
  return (
    <ul className={s.tasks}>
      {tasks.map((task) => (
        <li key={task.id}>
          <label>
            <input type="checkbox" checked={task.isDone} onChange={() => toggleTodo(task.id)} />
            <span>{task.title}</span>
            <small data-owner={ASSIGNEE_LABEL[task.assignee]}>
              {ASSIGNEE_LABEL[task.assignee]}
            </small>
          </label>
        </li>
      ))}
    </ul>
  );
}

export function ChecklistCard({
  tasks,
  nextStep,
  landing = false,
}: {
  tasks: PlannerState["todos"];
  nextStep: StepDefinition | null;
  landing?: boolean;
}) {
  const checked = tasks.filter((task) => task.isDone).length;
  const href = nextStep ? PLANNER_ROUTES.step(nextStep.id) : PLANNER_ROUTES.roadmap;
  return (
    <section className={s.card}>
      <div className={s.spread}>
        <h2>
          이번 단계 할 일{" "}
          {!landing && (
            <small>
              {checked}/{tasks.length}
            </small>
          )}
        </h2>
        <Link href={href} className={landing ? s.subtle : s.button}>
          {landing ? "더보기 →" : "단계 보기 ›"}
        </Link>
      </div>
      <Checklist tasks={tasks} />
      {nextStep && (
        <Link href={href} className={landing ? s.fullButton : s.textLink}>
          {landing ? "단계 상세 보기 ›" : nextStep.title + " 단계 전체 보기 →"}
        </Link>
      )}
    </section>
  );
}

export function CostSummary({
  plan,
  summary,
}: {
  plan: PlannerState;
  summary: ReturnType<typeof getSavedPlanSummary>;
}) {
  const { percent, spent, remaining } = summary;
  const { venue, sdm } = plan.stepEstimates;
  const estimate =
    venue && sdm
      ? formatRange({ min: venue.min + sdm.min, max: venue.max + sdm.max })
      : "예상 비용 미정";
  return (
    <section className={s.card + " " + s.summary}>
      <div className={s.spread}>
        <h2>우리 결혼 비용</h2>
        <Link href={PLANNER_ROUTES.estimate} className={s.subtle}>
          상세 ›
        </Link>
      </div>
      <dl>
        <div>
          <dt>예상 총 비용</dt>
          <dd>{estimate}</dd>
        </div>
        <div>
          <dt>설정한 예산</dt>
          <dd>{formatPlanBudget(plan.budget)}</dd>
        </div>
        <div>
          <dt>지금까지 쓴 금액</dt>
          <dd>{formatWon(spent)}</dd>
        </div>
        <div>
          <dt>남은 예산</dt>
          <dd className={remaining !== null && remaining >= 0 ? s.green : undefined}>
            {formatPlanBudget(remaining)}
          </dd>
        </div>
      </dl>
      <div className={s.spread + " " + s.progressLabel}>
        <span>전체 진행률</span>
        <strong>{percent}%</strong>
      </div>
      <Progress value={percent} />
    </section>
  );
}

export function ConfirmNewPlan({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  const router = useRouter();
  return (
    <>
      <button className={className ?? s.button} onClick={() => dialog.current?.showModal()}>
        {children}
      </button>
      <dialog ref={dialog} className={s.dialog} aria-labelledby={title}>
        <button aria-label="닫기" className={s.close} onClick={() => dialog.current?.close()}>
          <DiscoveryIcon name="close" />
        </button>
        <span className={s.iconTile} aria-hidden="true">
          ↻
        </span>
        <h2 id={title}>새 계획을 시작할까요?</h2>
        <p>
          질문 5개에 처음부터 답해 새 예상 비용과 로드맵을 만들어요. 지금 계획의 완료 기록과 할 일은
          그대로 남아요.
        </p>
        <div className={s.dialogActions}>
          <button className={s.button} autoFocus onClick={() => dialog.current?.close()}>
            취소
          </button>
          <button
            className={s.primary}
            onClick={() => {
              dialog.current?.close();
              router.push("/estimate?mode=new");
            }}
          >
            새 계획 시작하기
          </button>
        </div>
      </dialog>
    </>
  );
}

export function ProfileMenu({ iconOnly = false }: { iconOnly?: boolean }) {
  const signOut = useUtAuthStore((state) => state.signOut);
  const me = usePlannerStore((state) => state.me);
  const partner = usePlannerStore((state) => (state.hasSavedPlan ? state.partner : null));
  const router = useRouter();
  const menu = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (menu.current) menu.current.open = false;
  };
  return (
    <details
      ref={menu}
      className={s.profile}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          close();
          menu.current?.querySelector("summary")?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <summary aria-label="프로필 메뉴">
        {iconOnly ? (
          <DiscoveryIcon name="profile" size={20} />
        ) : (
          <>
            <Image src="/images/avatars/avatar-joongeun.png" width={26} height={26} alt="" />{" "}
            {me.name}님 <span aria-hidden="true">⌄</span>
          </>
        )}
      </summary>
      <div className={s.profileMenu}>
        <div className={s.profileIdentity}>
          <Image src="/images/avatars/avatar-joongeun.png" width={34} height={34} alt="" />
          <div>
            <strong>{me.fullName}</strong>
            <small>{partner ? `${partner.name} 님과 연결됨` : "짝꿍 연결 전"}</small>
          </div>
        </div>
        <Link href="/home?panel=profile" onClick={close}>
          내 정보
        </Link>
        <Link href="/home?panel=members" onClick={close}>
          짝꿍 초대하기
        </Link>
        <Link href={PLANNER_ROUTES.roadmap} onClick={close}>
          예산·예식일 수정
        </Link>
        <button
          onClick={() => {
            close();
            signOut();
            router.push("/");
          }}
        >
          로그아웃
        </button>
      </div>
    </details>
  );
}

export function CurrentStage({
  plan,
  tasks,
  summary,
}: {
  plan: PlannerState;
  tasks: PlannerState["todos"];
  summary: ReturnType<typeof getSavedPlanSummary>;
}) {
  const { nextStep, nextHref } = summary;
  const checked = tasks.filter((task) => task.isDone).length;
  const budget = nextStep ? plan.stepEstimates[nextStep.id] : null;
  return (
    <section className={s.darkCard}>
      <div className={s.spread}>
        <span className={s.darkPill}>
          ● {nextStep ? "지금 할 일 · " + nextStep.order + "단계" : "모든 단계 완료"}
        </span>
        {nextStep && <span>{getWeddingDateDisplay(plan.weddingDate).countdown}</span>}
      </div>
      <h2>{nextStep?.title ?? "준비를 모두 마쳤어요"}</h2>
      {nextStep && (
        <>
          <p>
            {budget ? (
              <>
                이번 단계 예상 비용은 <strong>{formatRange(budget)}</strong>이에요.
              </>
            ) : (
              "다음 준비 일정을 확인해 보세요."
            )}
          </p>
          <div className={s.darkBottom}>
            {tasks.length > 0 && (
              <div className={s.stageProgress}>
                <div className={s.spread}>
                  <span>체크리스트</span>
                  <strong>
                    {checked} / {tasks.length}
                  </strong>
                </div>
                <Progress label="체크리스트 진행률" value={(checked / tasks.length) * 100} />
              </div>
            )}
            <div className={s.actions}>
              {nextStep.id === "venue" && (
                <Link className={s.ghost} href={PLANNER_ROUTES.venueSearch}>
                  예식장 후보
                </Link>
              )}
              <Link className={s.button} href={nextHref}>
                이어서 하기 →
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
