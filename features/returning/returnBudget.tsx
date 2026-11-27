"use client";

import { useUtAuthStore } from "@/src/stores/utAuthStore";
import { SDM_TIER_OPTIONS, VENUE_ESTIMATE } from "@/src/features/planner/mocks/plannerMock";
import { PLANNER_ROUTES } from "@/src/features/planner/routes";
import { usePlannerStore } from "@/src/features/planner/stores/plannerStore";
import type { PlannerState } from "@/src/features/planner/types";
import { formatRange, formatWon } from "@/src/features/planner/utils/money";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  createSharedEstimateUrl,
  firstVisitHref,
  initialAnswers,
  readSharedEstimate,
  timingLabel,
  unknownGuestCount,
} from "../firstVisit/model";
import { combinations } from "../sdm/sdmData";
import { range } from "../venues/venueData";
import { s } from "./returnUi";
import {
  tierRanges,
  estimateVenue,
  formatMonth,
  regions,
  guestRanges,
  type Conditions,
} from "./returnPlan";
import { formatPlanBudget, getSavedPlanSummary, getWeddingDateDisplay } from "./savedPlanSummary";

function sharedConditions(params: URLSearchParams): Conditions | null {
  const region = params.get("region") ?? "";
  const guests = params.get("guests") ?? "";
  const month = params.get("month") ?? "";
  const budget = params.get("budget") ?? "";
  const mood = params.get("mood") ?? "";
  if (
    !regions.includes(region) ||
    !guestRanges.includes(guests) ||
    !/^\d{4}-(0[1-9]|1[0-2])$/.test(month) ||
    !/^\d{1,7}$/.test(budget) ||
    Number(budget) < 1 ||
    Number(budget) > 1000000 ||
    !mood ||
    mood.length > 30
  )
    return null;
  return { region, guests, month, budget, mood };
}

function shareSavedEstimate(plan: PlannerState) {
  const { weddingDate, conditions, sdmTier } = plan;
  const timing =
    weddingDate.kind === "exact"
      ? { timing: "date" as const, date: weddingDate.date }
      : weddingDate.kind === "month"
        ? {
            timing: "month" as const,
            year: String(weddingDate.year),
            month: String(weddingDate.month),
          }
        : { timing: "unknown" as const };
  const url = new URL(
    createSharedEstimateUrl(
      window.location.href,
      {
        ...initialAnswers,
        region: conditions.regionLabel,
        guests: conditions.guestLabel?.replace(/^하객 /, "") ?? unknownGuestCount,
        moods: conditions.moods,
        ...timing,
      },
      sdmTier,
      new Date(),
    ),
  );
  url.pathname = PLANNER_ROUTES.estimate;
  url.searchParams.delete("screen");
  return url.href;
}

const comboNames = ["실속형", "균형형", "프리미엄형"];

export function ReturnBudget() {
  const params = useSearchParams();
  const signedIn = useUtAuthStore((state) => state.provider !== null);
  const signIn = useUtAuthStore((state) => state.signIn);
  const plan = usePlannerStore();
  const shared = readSharedEstimate(params.get("plan"));
  const legacy = sharedConditions(params);
  const sharedMode = shared !== null || legacy !== null;
  const summary = sharedMode ? null : getSavedPlanSummary(plan);
  const [feedback, setFeedback] = useState("");
  const legacyTier = params.get("tier") ?? "";
  const selected =
    legacy && !shared
      ? /^[0-3]$/.test(legacyTier)
        ? Number(legacyTier)
        : 1
      : SDM_TIER_OPTIONS.findIndex(({ id }) => id === (shared?.tier ?? plan.sdmTier));
  const option = SDM_TIER_OPTIONS[selected];
  const [legacyVenueMin, legacyVenueMax] = legacy ? estimateVenue(legacy) : [];
  const [legacySdmMin, legacySdmMax] = tierRanges[selected];
  const venue = shared
    ? VENUE_ESTIMATE
    : legacyVenueMin !== undefined && legacyVenueMax !== undefined
      ? { min: legacyVenueMin, max: legacyVenueMax }
      : (plan.stepEstimates.venue ?? VENUE_ESTIMATE);
  const sdm =
    legacy && !shared
      ? { min: legacySdmMin, max: legacySdmMax }
      : shared
        ? option.range
        : (plan.stepEstimates.sdm ?? option.range);
  const total = { min: venue.min + sdm.min, max: venue.max + sdm.max };
  const budget = shared ? null : legacy ? Number(legacy.budget) : plan.budget;
  const region = shared?.answers.region ?? legacy?.region ?? plan.conditions.regionLabel;
  let conditions = [
    plan.conditions.guestLabel ?? "하객 수 미정",
    plan.conditions.moods.join(" · ") || "분위기 상관없음",
    getWeddingDateDisplay(plan.weddingDate).label,
  ];
  if (shared) {
    const { answers } = shared;
    conditions = [
      answers.guests === unknownGuestCount ? "하객 수 미정" : `하객 ${answers.guests}`,
      answers.moods.join(" · ") || "분위기 상관없음",
      timingLabel(answers),
    ];
  } else if (legacy) {
    conditions = [`하객 ${legacy.guests}명`, legacy.mood, formatMonth(legacy.month)];
  }

  async function share(preferNative: boolean) {
    try {
      const url = shareSavedEstimate(plan);
      if (preferNative && navigator.share) {
        await navigator.share({
          title: "우리 결혼 예상 비용",
          text: formatRange(total),
          url,
        });
        setFeedback("공유를 완료했어요.");
      } else {
        await navigator.clipboard.writeText(url);
        setFeedback(
          preferNative
            ? "링크를 복사했어요. 카카오톡에 붙여넣어 공유할 수 있어요."
            : "결과 링크를 복사했어요.",
        );
      }
    } catch (error) {
      if (!(error instanceof Error) || error.name !== "AbortError")
        setFeedback("공유 링크를 준비하지 못했어요.");
    }
  }

  if (!sharedMode && (!signedIn || !plan.hasSavedPlan))
    return (
      <section className={s.card}>
        <h1>
          {plan.hasSavedPlan ? "로그인하면 내 계획을 볼 수 있어요" : "아직 저장된 계획이 없어요"}
        </h1>
        {plan.hasSavedPlan ? (
          <button className={s.primary} onClick={() => signIn()}>
            미리보기 로그인
          </button>
        ) : (
          <Link className={s.primary} href={firstVisitHref("region")}>
            결혼 비용 계산하기
          </Link>
        )}
      </section>
    );

  return (
    <>
      <header className={s.pageHead}>
        <p className={s.eyebrow}>{sharedMode ? "공유받은 예상 비용이에요" : "비용 계산 결과"}</p>
        <h1>우리 결혼 예상 비용</h1>
        <p>답해 주신 조건으로 예식장과 스드메 비용을 범위로 계산했어요.</p>
        <p>
          {[region, ...conditions, "토요일 낮 예식 기준"].join(" · ")}{" "}
          {!sharedMode && (
            <Link href={PLANNER_ROUTES.roadmap} className={s.textLink}>
              예산·예식일 수정
            </Link>
          )}
        </p>
      </header>
      <div className={s.workspaceColumns}>
        <div className={s.stack}>
          <section className={s.card + " " + s.priceCard}>
            <div>
              <h2>예식장</h2>
              <p>{region} · 예식장 시안 예시 가격 기준</p>
            </div>
            <strong>{formatRange(venue)}</strong>
          </section>
          <section className={s.card}>
            <div className={s.priceCard}>
              <div>
                <h2>스드메</h2>
                <p>예산대를 바꾸면 예상 비용이 바로 바뀌어요 · 기본값: 이 지역 중간 수준 구간</p>
              </div>
              <strong>{formatRange(sdm)}</strong>
            </div>
            <div className={s.tiers} role="group" aria-label="스드메 예산대">
              {SDM_TIER_OPTIONS.map((item, index) => (
                <button
                  key={item.id}
                  aria-pressed={selected === index}
                  disabled={sharedMode}
                  onClick={() => {
                    plan.setSdmTier(item.id);
                    setFeedback("");
                  }}
                >
                  {index === 1 && <span>추천</span>}
                  <strong>{item.label}</strong>
                  <small>{item.rangeLabel}</small>
                </button>
              ))}
            </div>
            <details className={s.calculation}>
              <summary>산출 근거 보기</summary>
              <p>
                스드메 범위는 선택 예산대 기준이고, 각 조합은 세 업체의 기본 단품가를 합산한
                예시예요. 별도 옵션 비용은 포함하지 않았어요.
              </p>
            </details>
            <div className={s.spread + " " + s.comboTitle}>
              <div>
                <h3>이 예산대의 스드메 조합</h3>
                <small className={s.muted}>{option.label} 예산대 · 서울 시안 예시 가격 기준</small>
              </div>
              <Link className={s.textLink} href={"/sdm?tier=" + selected}>
                스드메 후보 보기 ›
              </Link>
            </div>
            <div className={s.combos}>
              {combinations(selected).map((combo, index) => {
                const min = combo.reduce((total, item) => total + item.min, 0);
                const max = combo.reduce((total, item) => total + item.max, 0);
                return (
                  <article key={comboNames[index]}>
                    <p className={s.eyebrow}>{comboNames[index]}</p>
                    <h3>{range(min, max)}</h3>
                    {combo.map((vendor) => (
                      <div key={vendor.id}>
                        <span>
                          <small>{vendor.category}</small>
                          <b>{vendor.name}</b>
                        </span>
                        <strong>{vendor.min}만~</strong>
                        {vendor.officialUrl && (
                          <a href={vendor.officialUrl} aria-label={vendor.name + " 공식 채널"}>
                            ↗
                          </a>
                        )}
                      </div>
                    ))}
                    <small>기본 상품 합산 · 플래너 경유가</small>
                  </article>
                );
              })}
            </div>
          </section>
          <section className={s.extra}>
            <h2>별도로 생길 수 있는 비용</h2>
            <p>원본 사진, 드레스 업그레이드, 헬퍼비 등 (합계 미포함)</p>
          </section>
          <p className={s.muted}>
            시안 예시 가격 · 실제 견적은 날짜, 옵션, 업체에 따라 달라질 수 있어요.
          </p>
        </div>
        <aside>
          <section className={s.darkCard + " " + s.total}>
            <p>예상 총비용</p>
            <h2>{formatRange(total)}</h2>
            <div
              className={s.splitBar}
              role="img"
              aria-label="예상 비용에서 예식장과 스드메의 비율"
            >
              <span
                style={{ width: ((venue.min + venue.max) / (total.min + total.max)) * 100 + "%" }}
              />
            </div>
            <small>
              ■ 예식장　<span>■ 스드메</span>
            </small>
            {(!sharedMode || budget !== null) && (
              <div className={s.totalBudget}>
                <div className={s.spread}>
                  <span>{sharedMode ? "설정한 예산" : "내 예산"}</span>
                  <strong>{formatPlanBudget(budget)}</strong>
                </div>
                {summary && (
                  <>
                    <div className={s.spread}>
                      <span>지금까지 쓴 금액</span>
                      <strong>{formatWon(summary.spent)}</strong>
                    </div>
                    <div className={s.spread}>
                      <span>남은 예산</span>
                      <strong>{formatPlanBudget(summary.remaining)}</strong>
                    </div>
                    <div className={s.spread}>
                      <span>전체 진행률</span>
                      <strong>{summary.percent}%</strong>
                    </div>
                  </>
                )}
                {budget !== null && (
                  <span className={s.darkPill}>
                    {total.max <= budget
                      ? "✓ 예산 안에 들어와요"
                      : "ⓘ 조건에 따라 예산을 넘을 수 있어요"}
                  </span>
                )}
              </div>
            )}
            <Link
              href={sharedMode ? firstVisitHref("region") : PLANNER_ROUTES.roadmap}
              className={s.fullButton}
            >
              {sharedMode ? "나도 계산해 보기 →" : "준비 로드맵 보기 →"}
            </Link>
            {summary?.nextStep && (
              <Link href={summary.nextHref} className={s.fullButton}>
                다음 할 일 · {summary.nextStep.title} →
              </Link>
            )}
            {!sharedMode && (
              <div className={s.actions}>
                <button className={s.ghost} onClick={() => void share(false)}>
                  결과 링크 복사
                </button>
                <button className={s.kakao} onClick={() => void share(true)}>
                  카카오톡 공유
                </button>
              </div>
            )}
            {feedback && <p role="status">{feedback}</p>}
          </section>
        </aside>
      </div>
    </>
  );
}
