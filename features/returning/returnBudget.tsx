"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDiscovery } from "../venues/useDiscovery";
import { combinations, tiers } from "../sdm/sdmData";
import { money, range } from "../venues/venueData";
import { s } from "./returnUi";
import {
  tierRanges,
  useReturnPlan,
  estimateVenue,
  formatMonth,
  regions,
  guestRanges,
  type Conditions,
} from "./returnPlan";

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

function compactRange(min: number, max: number) {
  return min.toLocaleString("ko-KR") + "만 ~ " + max.toLocaleString("ko-KR") + "만원";
}

const comboNames = ["실속형", "균형형", "프리미엄형"];

export function ReturnBudget() {
  const params = useSearchParams();
  const sharedTier = params.get("tier");
  const tier = useReturnPlan((state) => state.tier);
  const setTier = useReturnPlan((state) => state.setTier);
  const signedIn = useDiscovery((state) => state.signedIn);
  const signIn = useDiscovery((state) => state.setSignedIn);
  const planConditions = useReturnPlan((state) => state.conditions);
  const shared = sharedConditions(params);
  const conditions = shared ?? planConditions;
  const [override, setOverride] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const selected =
    override ?? (sharedTier && /^[0-3]$/.test(sharedTier) ? Number(sharedTier) : tier);
  const [venueMin, venueMax] = estimateVenue(conditions);
  const [sdmMin, sdmMax] = tierRanges[selected];
  const totalMin = venueMin + sdmMin;
  const totalMax = venueMax + sdmMax;
  const budget = Number(conditions.budget);

  async function share(preferNative: boolean) {
    const url = new URL("/budget", window.location.origin);
    url.searchParams.set("tier", String(selected));
    for (const [key, value] of Object.entries(conditions)) url.searchParams.set(key, value);
    try {
      if (preferNative && navigator.share) {
        await navigator.share({
          title: "우리 결혼 예상 비용",
          text: range(totalMin, totalMax),
          url: url.href,
        });
        setFeedback("공유를 완료했어요.");
      } else {
        await navigator.clipboard.writeText(url.href);
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

  if (!signedIn && !shared)
    return (
      <section className={s.card}>
        <h1>로그인하면 내 계획을 볼 수 있어요</h1>
        <button className={s.primary} onClick={() => signIn(true)}>
          미리보기 로그인
        </button>
      </section>
    );

  return (
    <>
      <header className={s.pageHead}>
        <p className={s.eyebrow}>비용 계산 결과</p>
        <h1>우리 결혼 예상 비용</h1>
        <p>답해 주신 조건으로 예식장과 스드메 비용을 범위로 계산했어요.</p>
        <p>
          {conditions.region} · 하객 {conditions.guests}명 · {conditions.mood} ·{" "}
          {formatMonth(conditions.month)} · 토요일 낮 예식 기준{" "}
          <Link href="/estimate?mode=edit" className={s.textLink}>
            조건 수정
          </Link>
        </p>
      </header>
      <div className={s.workspaceColumns}>
        <div className={s.stack}>
          <section className={s.card + " " + s.priceCard}>
            <div>
              <h2>예식장</h2>
              <p>{conditions.region} · 예식장 시안 예시 가격 기준</p>
            </div>
            <strong>{compactRange(venueMin, venueMax)}</strong>
          </section>
          <section className={s.card}>
            <div className={s.priceCard}>
              <div>
                <h2>스드메</h2>
                <p>예산대를 바꾸면 예상 비용이 바로 바뀌어요 · 기본값: 이 지역 중간 수준 구간</p>
              </div>
              <strong>{compactRange(sdmMin, sdmMax)}</strong>
            </div>
            <div className={s.tiers} role="group" aria-label="스드메 예산대">
              {tiers.map((item, index) => (
                <button
                  key={item.name}
                  aria-pressed={selected === index}
                  onClick={() => {
                    setOverride(index);
                    if (!shared) setTier(index);
                    setFeedback("");
                  }}
                >
                  {index === 1 && <span>추천</span>}
                  <strong>{item.name}</strong>
                  <small>{item.label}</small>
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
                <small className={s.muted}>
                  {tiers[selected].name} 예산대 · 서울 시안 예시 가격 기준
                </small>
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
            <h2>{compactRange(totalMin, totalMax)}</h2>
            <div
              className={s.splitBar}
              role="img"
              aria-label="예상 비용에서 예식장과 스드메의 비율"
            >
              <span
                style={{ width: ((venueMin + venueMax) / (totalMin + totalMax)) * 100 + "%" }}
              />
            </div>
            <small>
              ■ 예식장　<span>■ 스드메</span>
            </small>
            <div className={s.totalBudget}>
              <div className={s.spread}>
                <span>내 예산</span>
                <strong>{money(budget)}</strong>
              </div>
              <span className={s.darkPill}>
                {totalMax <= budget
                  ? "✓ 예산 안에 들어와요"
                  : "ⓘ 조건에 따라 예산을 넘을 수 있어요"}
              </span>
            </div>
            <Link href="/roadmap" className={s.fullButton}>
              준비 로드맵 보기 →
            </Link>
            <div className={s.actions}>
              <button className={s.ghost} onClick={() => void share(false)}>
                결과 링크 복사
              </button>
              <button className={s.kakao} onClick={() => void share(true)}>
                카카오톡 공유
              </button>
            </div>
            {feedback && <p role="status">{feedback}</p>}
          </section>
        </aside>
      </div>
    </>
  );
}
