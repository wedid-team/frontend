"use client";

import { tierRanges } from "../sdm/sdmData";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "../../src/components/common";
import { DiscoveryIcon } from "../venues/shared";
import { useDiscovery } from "../venues/useDiscovery";
import { money, venues } from "../venues/venueData";
import { ChecklistCard, ConfirmNewPlan, ProfileMenu, Progress, s } from "./returnUi";
import {
  recommendedVenueIds,
  stepHref,
  steps,
  useProgress,
  useReturnPlan,
  useReturnReady,
  weddingDday,
  formatMonth,
  estimateVenue,
} from "./returnPlan";

export function Timeline() {
  const { count } = useProgress();
  return (
    <ol className={s.timeline} aria-label="준비 단계">
      {steps.map((step, index) => (
        <li
          key={step.id}
          data-status={index < count ? "done" : index === count ? "current" : "later"}
        >
          <Link href={stepHref(step)} aria-current={index === count ? "step" : undefined}>
            <span className={s.timelineIcon}>
              {<DiscoveryIcon name={index < count ? "checkWhite" : step.icon} size={21} />}
            </span>
            <strong>{step.short}</strong>
            <small>{index < count ? "완료" : index === count ? "지금 할 일" : step.timing}</small>
          </Link>
        </li>
      ))}
    </ol>
  );
}

function Calendar() {
  const conditions = useReturnPlan((state) => state.conditions);
  const [offset, setOffset] = useState(0);
  const month = new Date(Date.UTC(2026, 10 + offset, 1));
  const year = month.getUTCFullYear();
  const monthNumber = month.getUTCMonth();
  const last = new Date(Date.UTC(year, monthNumber + 1, 0)).getUTCDate();
  return (
    <section className={s.card}>
      <div className={s.spread}>
        <h2>웨딩 일정</h2>
        <div className={s.actions}>
          <button
            className={s.calendarButton}
            aria-label="이전 달"
            onClick={() => setOffset(offset - 1)}
          >
            ‹
          </button>
          <button
            className={s.calendarButton}
            aria-label="다음 달"
            onClick={() => setOffset(offset + 1)}
          >
            ›
          </button>
        </div>
      </div>
      <h3 className={s.calendarTitle} aria-live="polite">
        {year}년 {monthNumber + 1}월
      </h3>
      <div className={s.calendar}>
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <b key={day}>{day}</b>
        ))}
        {Array.from({ length: month.getUTCDay() }, (_, index) => (
          <span key={"blank-" + index} />
        ))}
        {Array.from({ length: last }, (_, index) => (
          <span key={index}>{index + 1}</span>
        ))}
      </div>
      <div className={s.events}>
        <div>
          <span className={s.iconTile}>
            <DiscoveryIcon name="venue" />
          </span>
          <p>
            <strong>예식장 계약 권장 기간</strong>
            <small>2026.12 ~ 2027.02</small>
          </p>
        </div>
        <div>
          <span className={s.iconTile}>
            <DiscoveryIcon name="heart" />
          </span>
          <p>
            <strong>예식일 {weddingDday}</strong>
            <small>{formatMonth(conditions.month)}</small>
          </p>
        </div>
      </div>
    </section>
  );
}

function Recommendations() {
  const favorites = useDiscovery((state) => state.favorites);
  const toggle = useDiscovery((state) => state.toggleFavorite);
  const ids = [
    ...favorites.filter((id) => venues.some((venue) => venue.id === id)),
    ...recommendedVenueIds.filter((id) => !favorites.includes(id)),
  ].slice(0, 3);
  return (
    <section className={s.card}>
      <div className={s.spread}>
        <h2>
          추천 예식장 <small>· 관심 업체 먼저</small>
        </h2>
        <Link href="/venues" className={s.subtle}>
          더보기 →
        </Link>
      </div>
      <div className={s.recommendations}>
        {ids.flatMap((id) => {
          const venue = venues.find((item) => item.id === id);
          if (!venue) return [];
          const photo =
            id === "grand-opera-hall"
              ? "/images/home/grand-opera-hall-card.png"
              : "/images/venues/" + id + ".png";
          return (
            <article key={id} className={s.venueCard}>
              <div className={s.venuePhoto}>
                <Link href={"/venues/" + id} aria-label={venue.name + " 상세 보기"}>
                  <Image src={photo} alt={venue.name} fill sizes="(max-width: 700px) 70vw, 240px" />
                </Link>
                <span>{venue.mood}</span>
                <button
                  aria-label={venue.name + " 관심 업체"}
                  aria-pressed={favorites.includes(id)}
                  onClick={() => toggle(id)}
                >
                  {favorites.includes(id) ? "♥" : "♡"}
                </button>
              </div>
              <div className={s.venueBody}>
                <small>서울 {venue.district}</small>
                <Link href={"/venues/" + id}>
                  <strong>{venue.name}</strong>
                </Link>
                <div className={s.actions}>
                  <span className={s.pill}>{venue.meal}</span>
                  <span className={s.pill}>주차 {venue.parking ? "가능" : "불가"}</span>
                </div>
                <p>{venue.note}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Allocation() {
  const tier = useReturnPlan((state) => state.tier);
  const conditions = useReturnPlan((state) => state.conditions);
  const weddingBudget = Number(conditions.budget);
  const venueEstimate = estimateVenue(conditions);
  const venue = (venueEstimate[0] + venueEstimate[1]) / 2;
  const sdm = (tierRanges[tier][0] + tierRanges[tier][1]) / 2;
  const parts = [venue, sdm, Math.max(0, weddingBudget - venue - sdm)];
  const total = parts.reduce((sum, item) => sum + item, 0);
  const first = (parts[0] / total) * 100;
  const second = ((parts[0] + parts[1]) / total) * 100;
  return (
    <section className={s.card}>
      <div className={s.spread}>
        <h2>예산 현황</h2>
        <Link href="/budget" className={s.subtle}>
          상세보기 →
        </Link>
      </div>
      <div className={s.allocation}>
        <div
          className={s.donut}
          style={{
            background:
              "conic-gradient(var(--brand800) 0 " +
              first +
              "%, var(--brand500) " +
              first +
              "% " +
              second +
              "%, var(--brand200) " +
              second +
              "%)",
          }}
        >
          <div>
            <small>총 예산</small>
            <strong>{(weddingBudget * 10000).toLocaleString("ko-KR")}원</strong>
          </div>
        </div>
        <dl>
          {["예식장 예상", "스드메 예상", "여유 · 기타"].map((name, index) => (
            <div key={name}>
              <dt>
                <i data-part={index} />
                {name}
              </dt>
              <dd>
                <strong>{(parts[index] * 10000).toLocaleString("ko-KR")}원</strong>
                <span>{Math.round((parts[index] / total) * 100)}%</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function ReturningLanding() {
  const ready = useReturnReady();
  const signedIn = useDiscovery((state) => state.signedIn);
  const signIn = useDiscovery((state) => state.setSignedIn);
  const { count, current, percent, spent } = useProgress();
  const weddingBudget = useReturnPlan((state) => Number(state.conditions.budget));
  return (
    <div className={s.landing}>
      <section className={s.hero}>
        <div className={s.heroPhoto}>
          <Image
            src="/images/home/wedding-couple-hero.png"
            alt=""
            fill
            sizes="(max-width: 700px) 100vw, 663px"
            preload
          />
        </div>
        <header className={s.landingHeader}>
          <Logo />
          <nav aria-label="서비스 메뉴">
            <Link href="/home">웨딩 플랜</Link>
            <Link href="/roadmap">내 로드맵</Link>
          </nav>
          <div className={s.actions}>
            {ready &&
              (signedIn ? (
                <>
                  <Link href="/venues?view=favorites" aria-label="관심 예식장">
                    <DiscoveryIcon name="heart" size={20} />
                  </Link>
                  <ProfileMenu iconOnly />
                </>
              ) : (
                <button onClick={() => signIn(true)} className={s.button}>
                  미리보기 로그인
                </button>
              ))}
          </div>
        </header>
        <div className={s.heroBody}>
          <div className={s.heroCopy}>
            <p>{ready && signedIn ? "안녕하세요, 준근님" : "WEDID 웨딩 플랜"}</p>
            <h1>
              우리만의 웨딩을
              <br />
              차근차근 완성해요
            </h1>
            <p>
              지금까지의 준비가
              <br />더 특별한 날을 만들어줄 거예요.
            </p>
            <div className={s.actions}>
              {ready && signedIn ? (
                <>
                  <Link className={s.primary} href="/roadmap">
                    내 로드맵 이어서 보기 →
                  </Link>
                  <ConfirmNewPlan>새 계획 시작하기</ConfirmNewPlan>
                </>
              ) : (
                <Link className={s.primary} href="/estimate?mode=new">
                  새 계획 시작하기
                </Link>
              )}
            </div>
          </div>
          {ready && signedIn && (
            <div className={s.heroProgress + " " + s.card}>
              <div className={s.spread}>
                <strong>전체 준비 진행률</strong>
                <span className={s.pill}>예식 {weddingDday}</span>
              </div>
              <p>
                <strong>{percent}</strong> %
              </p>
              <Progress value={percent} />
              <small>{count} / 6 단계</small>
            </div>
          )}
        </div>
      </section>
      {ready && signedIn && (
        <main className={s.landingMain}>
          <div className={s.statGrid}>
            <Link href="/budget">
              <span className={s.iconTile}>
                <DiscoveryIcon name="budget" />
              </span>
              <p>
                <small>남은 예산</small>
                <strong>{money(weddingBudget - spent)}</strong>
              </p>
            </Link>
            <Link href={current ? stepHref(current) : "/roadmap"}>
              <span className={s.iconTile}>
                <DiscoveryIcon name="flag" />
              </span>
              <p>
                <small>다음 STEP{current ? " · " + current.title : ""}</small>
                <strong>
                  {current?.id === "venue" ? "D-34" : (current?.timing ?? "모든 단계 완료")}
                </strong>
              </p>
            </Link>
            <Link href="/home?panel=members">
              <span className={s.iconTile}>
                <DiscoveryIcon name="members" />
              </span>
              <p>
                <small>짝꿍</small>
                <strong>민지 님이 합류했어요</strong>
              </p>
            </Link>
          </div>
          <section className={s.card}>
            <div className={s.spread}>
              <h2>우리의 결혼 준비 로드맵</h2>
              <Link href="/roadmap" className={s.subtle}>
                전체보기 →
              </Link>
            </div>
            <Timeline />
          </section>
          <div className={s.landingColumns}>
            <Allocation />
            <ChecklistCard landing />
          </div>
          <div className={s.landingRecommendations}>
            <Recommendations />
            <Calendar />
          </div>
        </main>
      )}
      <footer className={s.footer}>
        <div>
          <Logo />
          <p>우리의 웨딩을 완성하다</p>
        </div>
        <div>
          <strong>서비스</strong>
          <Link href="/home">웨딩 플랜</Link>
          <Link href="/budget">비용 계산</Link>
          <Link href="/roadmap">준비 로드맵</Link>
        </div>
        <div>
          <strong>고객지원</strong>
          <p>자주 묻는 질문</p>
          <p>고객센터</p>
        </div>
        <div>
          <strong>정책</strong>
          <p>이용약관</p>
          <p>개인정보처리방침</p>
        </div>
        <small>© 2026 WEDID</small>
      </footer>
    </div>
  );
}
