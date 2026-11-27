"use client";

/**
 * 임시 사이드바 — 공통 레이아웃(헤더 · 사이드바)은 C파트 담당.
 * C파트 공통 사이드바가 나오면 이 컴포넌트는 지우고 그쪽으로 교체한다.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { STEP_DEFINITIONS } from "../mocks/plannerMock";
import { PLANNER_ROUTES } from "../routes";
import { usePlannerStore } from "../stores/plannerStore";
import {
  formatDday,
  getDday,
  getNextStep,
  getProgressPercent,
  isStepOverdue,
  resolveWeddingDate,
} from "../utils/schedule";
import { CheckIcon, HomeIcon, MapIcon, PinIcon, WonCircleIcon } from "./icons";
import styles from "./plannerSidebar.module.css";
import { cx } from "./ui";

const STEP_SUB_LINKS: Partial<Record<string, Array<{ label: string; href: string }>>> = {
  venue: [
    { label: "예식장 후보 보기", href: PLANNER_ROUTES.venueSearch },
    { label: "업체 비교하기", href: PLANNER_ROUTES.compare },
  ],
  sdm: [{ label: "스드메 후보 보기", href: PLANNER_ROUTES.sdmSearch }],
};

export function PlannerSidebar() {
  const pathname = usePathname();
  const state = usePlannerStore();
  const today = new Date();
  const wedding = resolveWeddingDate(state.weddingDate, today);
  const dday = getDday(wedding.date, today);
  const percent = getProgressPercent(state);
  const nextStepId = getNextStep(state)?.id;
  const isRoadmap = pathname === PLANNER_ROUTES.roadmap;

  const mainLinks = [
    { label: "홈", href: PLANNER_ROUTES.home, icon: HomeIcon, active: false },
    { label: "준비 로드맵", href: PLANNER_ROUTES.roadmap, icon: MapIcon, active: isRoadmap },
    { label: "예상 비용", href: PLANNER_ROUTES.estimate, icon: WonCircleIcon, active: false },
    { label: "예식장 찾기", href: PLANNER_ROUTES.venueSearch, icon: PinIcon, active: false },
  ];

  return (
    <aside aria-label="메뉴" className={styles.sidebar}>
      <div className={styles.plan}>
        <span aria-hidden="true" className={styles.plan__mark}>
          W
        </span>
        <span className={styles.plan__copy}>
          <strong className={styles.plan__title}>우리의 웨딩</strong>
          <span className={styles.plan__meta}>
            {wedding.isUndecided ? "예식일 미정" : wedding.monthLabel} ·{" "}
            {state.conditions.regionLabel.replace(/^서울\s/, "")}
          </span>
        </span>
      </div>

      <nav aria-label="주요 메뉴" className={styles.nav}>
        {mainLinks.map(({ active, href, icon: Icon, label }) => (
          <Link
            aria-current={active ? "page" : undefined}
            className={cx(styles.nav__link, active && styles["nav__link--active"])}
            href={href}
            key={label}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      <nav aria-label="준비 단계" className={styles.steps}>
        <p className={styles.steps__title}>준비 단계</p>
        <ol className={styles.steps__list}>
          {STEP_DEFINITIONS.map((step) => {
            // SCR-06 · 06-D: 완료 ✓ · 다음 할 일 강조(채운 원) · 시기 지난 미완료 ⚠ · 나머지 빈 원
            const isComplete = state.steps[step.id].status === "complete";
            const isOverdue = isStepOverdue(step, state, dday);
            const marker = isComplete
              ? "complete"
              : isOverdue
                ? "overdue"
                : step.id === nextStepId
                  ? "next"
                  : "upcoming";
            const href = PLANNER_ROUTES.step(step.id);
            const isActive = pathname === href;
            return (
              <li className={styles.steps__item} key={step.id}>
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cx(styles.steps__link, isActive && styles["steps__link--active"])}
                  href={href}
                >
                  <span
                    aria-label={isOverdue ? "시기가 지났어요" : undefined}
                    className={cx(styles.steps__marker, styles[`steps__marker--${marker}`])}
                  >
                    {isComplete ? <CheckIcon size={12} /> : isOverdue ? "⚠" : step.order}
                  </span>
                  <span
                    className={cx(
                      styles.steps__label,
                      (isComplete || step.id === nextStepId) && styles["steps__label--strong"],
                    )}
                  >
                    {step.title}
                  </span>
                </Link>
                {STEP_SUB_LINKS[step.id]?.map((sub) => (
                  <Link className={styles.steps__subLink} href={sub.href} key={sub.label}>
                    {sub.label}
                  </Link>
                ))}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className={styles.dday}>
        <p className={styles.dday__label}>예식까지</p>
        <p className={styles.dday__value}>{formatDday(dday, false)}</p>
        <div
          aria-label={`전체 진행률 ${percent}%`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={percent}
          className={styles.dday__track}
          role="progressbar"
        >
          <span className={styles.dday__bar} style={{ width: `${percent}%` }} />
        </div>
        <p className={styles.dday__label}>
          전체 진행률 {percent}%{wedding.isEstimated && " · 예상"}
        </p>
      </div>
    </aside>
  );
}
