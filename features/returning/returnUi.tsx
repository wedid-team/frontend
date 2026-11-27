"use client";

import { tierRanges } from "../sdm/sdmData";
import Image from "next/image";
import Link from "next/link";
import { useId, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DiscoveryIcon } from "../venues/shared";
import { useDiscovery } from "../venues/useDiscovery";
import {
  tasks,
  useProgress,
  useReturnPlan,
  weddingDday,
  stepHref,
  estimateVenue,
  venueBudgetFor,
} from "./returnPlan";
import { money, range } from "../venues/venueData";
import s from "./returning.module.css";

export { s };

export function Progress({ value, label = "전체 진행률" }: { value: number; label?: string }) {
  return <progress className={s.progress} max={100} value={value} aria-label={label} />;
}

export function Checklist({ showEmpty = true }: { showEmpty?: boolean }) {
  const { current } = useProgress();
  const checked = useReturnPlan((state) => state.checked);
  const toggleTask = useReturnPlan((state) => state.toggleTask);
  if (current?.id !== "venue") return showEmpty ? <p className={s.empty}>할 일이 없어요</p> : null;
  return (
    <ul className={s.tasks}>
      {tasks.map((task) => (
        <li key={task.id}>
          <label>
            <input
              type="checkbox"
              checked={checked.includes(task.id)}
              onChange={() => toggleTask(task.id)}
            />
            <span>{task.label}</span>
            <small data-owner={task.owner}>{task.owner}</small>
          </label>
        </li>
      ))}
    </ul>
  );
}

export function ChecklistCard({ landing = false }: { landing?: boolean }) {
  const { current } = useProgress();
  const checked = useReturnPlan((state) => state.checked.length);
  const href = current ? stepHref(current) : "/roadmap";
  return (
    <section className={s.card}>
      <div className={s.spread}>
        <h2>
          이번 단계 할 일{" "}
          {!landing && <small>{current?.id === "venue" ? checked + "/3" : "0/0"}</small>}
        </h2>
        <Link href={href} className={landing ? s.subtle : s.button}>
          {landing ? "더보기 →" : "단계 보기 ›"}
        </Link>
      </div>
      <Checklist />
      {current && (
        <Link href={href} className={landing ? s.fullButton : s.textLink}>
          {landing ? "단계 상세 보기 ›" : current.title + " 단계 전체 보기 →"}
        </Link>
      )}
    </section>
  );
}

export function CostSummary() {
  const { percent, spent } = useProgress();
  const tier = useReturnPlan((state) => state.tier);
  const budget = tierRanges[tier];
  const conditions = useReturnPlan((state) => state.conditions);
  const weddingBudget = Number(conditions.budget);
  const [venueMin, venueMax] = estimateVenue(conditions);
  return (
    <section className={s.card + " " + s.summary}>
      <div className={s.spread}>
        <h2>우리 결혼 비용</h2>
        <Link href="/budget" className={s.subtle}>
          상세 ›
        </Link>
      </div>
      <dl>
        <div>
          <dt>예상 총 비용</dt>
          <dd>{range(venueMin + budget[0], venueMax + budget[1])}</dd>
        </div>
        <div>
          <dt>설정한 예산</dt>
          <dd>{money(weddingBudget)}</dd>
        </div>
        <div>
          <dt>지금까지 쓴 금액</dt>
          <dd>{spent ? money(spent) : "0원"}</dd>
        </div>
        <div>
          <dt>남은 예산</dt>
          <dd className={s.green}>{money(weddingBudget - spent)}</dd>
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
  const signOut = useDiscovery((state) => state.setSignedIn);
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
            <Image src="/images/avatars/avatar-joongeun.png" width={26} height={26} alt="" /> 준근
            님 <span aria-hidden="true">⌄</span>
          </>
        )}
      </summary>
      <div className={s.profileMenu}>
        <div className={s.profileIdentity}>
          <Image src="/images/avatars/avatar-joongeun.png" width={34} height={34} alt="" />
          <div>
            <strong>최준근</strong>
            <small>민지 님과 연결됨</small>
          </div>
        </div>
        <Link href="/home?panel=profile" onClick={close}>
          내 정보
        </Link>
        <Link href="/home?panel=members" onClick={close}>
          짝꿍 초대하기
        </Link>
        <Link href="/estimate?mode=edit" onClick={close}>
          조건 다시 입력
        </Link>
        <button
          onClick={() => {
            close();
            signOut(false);
            router.push("/");
          }}
        >
          로그아웃
        </button>
      </div>
    </details>
  );
}

export function CurrentStage({ roadmap = false }: { roadmap?: boolean }) {
  const { current, count } = useProgress();
  const checked = useReturnPlan((state) => state.checked.length);
  const tier = useReturnPlan((state) => state.tier);
  const conditions = useReturnPlan((state) => state.conditions);
  const budget =
    current?.id === "venue"
      ? venueBudgetFor(conditions)
      : current?.id === "sdm"
        ? range(...tierRanges[tier])
        : null;
  return (
    <section className={s.darkCard}>
      <div className={s.spread}>
        <span className={s.darkPill}>
          ●{" "}
          {current
            ? (roadmap ? "다음 할 일" : "지금 할 일") + " · " + (count + 1) + "단계"
            : "모든 단계 완료"}
        </span>
        {current && <span>예식 {weddingDday}</span>}
      </div>
      <h2>{current?.title ?? "준비를 모두 마쳤어요"}</h2>
      {current && (
        <>
          <p>
            {roadmap ? (
              "예식 " + weddingDday + " · 권장 시기 " + current.timing
            ) : budget ? (
              <>
                이번 단계 예산은 <strong>{budget}</strong>이에요.
              </>
            ) : (
              "다음 준비 일정을 확인해 보세요."
            )}
          </p>
          <div className={s.darkBottom}>
            {roadmap && budget && (
              <div>
                이번 단계 예산 <strong>{budget}</strong>
              </div>
            )}
            {!roadmap && current.id === "venue" && (
              <div className={s.stageProgress}>
                <div className={s.spread}>
                  <span>체크리스트</span>
                  <strong>{checked} / 3</strong>
                </div>
                <Progress label="체크리스트 진행률" value={(checked / 3) * 100} />
              </div>
            )}
            <div className={s.actions}>
              {!roadmap && current.id === "venue" && (
                <Link className={s.ghost} href="/venues">
                  예식장 후보
                </Link>
              )}
              <Link className={s.button} href={stepHref(current)}>
                {roadmap ? "단계 보기 →" : "이어서 하기 →"}
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
