"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DiscoveryIcon } from "../venues/shared";
import { useDiscovery } from "../venues/useDiscovery";
import { money, venues } from "../venues/venueData";
import { Checklist, ChecklistCard, CostSummary, CurrentStage, s } from "./returnUi";
import {
  stepHref,
  steps,
  useProgress,
  useReturnPlan,
  weddingDday,
  formatMonth,
} from "./returnPlan";

export function MemberPanel({ profile = false }: { profile?: boolean }) {
  const [feedback, setFeedback] = useState("");
  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(
        new URL("/roadmap?invite=preview", window.location.origin).href,
      );
      setFeedback("미리보기 초대 링크를 복사했어요.");
    } catch {
      setFeedback("초대 링크를 복사하지 못했어요.");
    }
  }
  return (
    <section className={s.card} id={profile ? "profile" : "members"}>
      <h2>{profile ? "내 정보" : "함께하는 멤버"}</h2>
      <div className={s.member}>
        <Image src="/images/avatars/avatar-joongeun.png" width={32} height={32} alt="" />
        <strong>최준근</strong>
        <small>나</small>
      </div>
      {!profile && (
        <>
          <div className={s.member}>
            <Image src="/images/avatars/avatar-minji.png" width={32} height={32} alt="" />
            <strong>민지 님</strong>
            <small>연결됨</small>
          </div>
          <button type="button" className={s.button} onClick={() => void copyInvite()}>
            초대 링크 만들기
          </button>
          {feedback && (
            <p className={s.muted} role="status">
              {feedback}
            </p>
          )}
        </>
      )}
    </section>
  );
}

const quickLinks = [
  {
    href: "/budget",
    title: "예상 비용 다시 보기",
    subtitle: "스드메 예산대 바꿔보기",
    icon: "budget",
  },
  { href: "/venues", title: "예식장 후보", subtitle: "조건에 맞는 업체 찾기", icon: "pin" },
  {
    href: "/home?panel=members",
    title: "함께하는 멤버",
    subtitle: "민지 님과 연결됨",
    icon: "members",
  },
] as const;

export function ReturnHome() {
  const conditions = useReturnPlan((state) => state.conditions);
  const panel = useSearchParams().get("panel");
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (panel) panelRef.current?.scrollIntoView({ block: "nearest" });
  }, [panel]);
  return (
    <>
      <header className={s.pageHead}>
        <p className={s.eyebrow}>홈 · 예식 {weddingDday}</p>
        <h1>준근님, 다시 오셨네요</h1>
        <p>
          {formatMonth(conditions.month)} 예식 · {conditions.region} · 지금 할 일과 이번 주 할 일을
          확인해요.
        </p>
      </header>
      <div className={s.workspaceColumns}>
        <div className={s.stack}>
          <CurrentStage />
          <ChecklistCard />
        </div>
        <aside className={s.stack}>
          <CostSummary />
          <section className={s.card + " " + s.summary}>
            <h2>바로가기</h2>
            <div className={s.quickLinks}>
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className={s.iconTile}>
                    <DiscoveryIcon name={item.icon} />
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.subtitle}</small>
                  </span>
                  <span aria-hidden="true">›</span>
                </Link>
              ))}
            </div>
          </section>
          {(panel === "members" || panel === "profile") && (
            <div ref={panelRef}>
              <MemberPanel profile={panel === "profile"} />
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

export function ReturnRoadmap() {
  const conditions = useReturnPlan((state) => state.conditions);
  const weddingBudget = Number(conditions.budget);
  const params = useSearchParams();
  const stage = params.get("stage");
  const invitation = params.get("invite") === "preview";
  const { count, contracted, spent } = useProgress();
  const signedIn = useDiscovery((state) => state.signedIn);
  const finish = useReturnPlan((state) => state.finish);
  const index = steps.findIndex((step) => step.id === stage);
  const current = steps[index];
  const venue = signedIn ? venues.find((item) => item.id === contracted) : undefined;
  if (current)
    return (
      <>
        <Link href="/roadmap" className={s.textLink}>
          ‹ 준비 로드맵
        </Link>
        <header className={s.pageHead}>
          <p className={s.eyebrow}>
            {index + 1}단계 · {current.timing}
          </p>
          <h1>{current.title}</h1>
        </header>
        <section className={s.card}>
          {current.id === "venue" && (
            <>
              {venue && (
                <p role="status">
                  진행할 업체로 <strong>{venue.name}</strong>을 선택했어요.
                </p>
              )}
              <div className={s.actions}>
                <Link className={s.primary} href="/venues">
                  예식장 후보 보기
                </Link>
                <Link className={s.button} href="/venues/compare">
                  업체 비교하기
                </Link>
                {venue && (
                  <Link className={s.button} href="/roadmap?stage=sdm">
                    스드메 계약 단계로
                  </Link>
                )}
              </div>
              <Checklist showEmpty={false} />
            </>
          )}
          {current.id === "sdm" && (
            <Link className={s.primary} href="/sdm">
              스드메 후보 보기
            </Link>
          )}
          {current.id === "budget" && (
            <Link className={s.primary} href="/budget">
              예상 비용 보기
            </Link>
          )}
          <div className={s.stageActions}>
            {index === count && (
              <button className={s.primary} onClick={() => finish(index)}>
                이 단계 완료하기
              </button>
            )}
            {index < count && <span className={s.pill}>✓ 완료</span>}
            {index < count && steps[index + 1] && (
              <Link className={s.button} href={stepHref(steps[index + 1])}>
                다음 단계 보기 →
              </Link>
            )}
            <Link className={s.button} href="/home">
              홈으로
            </Link>
          </div>
        </section>
      </>
    );

  return (
    <>
      <header className={s.pageHead}>
        <p className={s.eyebrow}>준비 로드맵 · 전체 6단계 · 예식 {weddingDday}</p>
        <h1>
          우리의 웨딩 로드맵 <span className={s.pill}>{count === 6 ? "완료" : "● 진행중"}</span>
        </h1>
        <p>결혼식을 위한 일정을 확인하고, 차근차근 준비해보세요.</p>
        <p>
          예식 예정: {formatMonth(conditions.month)} · {conditions.region} · 하객{" "}
          {conditions.guests}명 · {conditions.mood} · 토요일 낮 예식 기준{" "}
          <Link className={s.textLink} href="/estimate?mode=edit">
            조건 수정
          </Link>
        </p>
      </header>
      {invitation && (
        <p className={s.empty} role="status">
          짝꿍 초대 미리보기예요. 실제 계정 연결은 지원 준비 중이에요.
        </p>
      )}
      <div className={s.workspaceColumns}>
        <div className={s.stack}>
          <CurrentStage roadmap />
          <section className={s.card}>
            <div className={s.spread}>
              <h2>전체 일정</h2>
              <small className={s.muted}>예식일 {formatMonth(conditions.month)} 기준</small>
            </div>
            <div className={s.roadmapBars}>
              {steps.map((step, i) => (
                <Link key={step.id} href={stepHref(step)} data-done={i < count}>
                  <strong>{step.short}</strong>
                  <small>{step.timing}</small>
                </Link>
              ))}
            </div>
            <ol className={s.roadmapList}>
              {steps.map((step, i) => (
                <li key={step.id}>
                  <span className={s.iconTile}>{i < count ? "✓" : i + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <small>{step.timing}</small>
                  </div>
                  <Link className={i === count ? s.primary : s.button} href={stepHref(step)}>
                    {i < count ? "완료" : i === count ? "시작하기" : "단계 보기"}
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <aside className={s.stack}>
          <section className={s.card + " " + s.summary}>
            <div className={s.spread}>
              <h2>우리 예산</h2>
              <Link href="/budget" className={s.subtle}>
                예상 비용 ›
              </Link>
            </div>
            <dl>
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
                <dd>{money(weddingBudget - spent)}</dd>
              </div>
            </dl>
          </section>
          <section className={s.card + " " + s.summary}>
            <div className={s.illustration}>
              <Image
                src="/images/home/wedding-couple-illustration.png"
                width={104}
                height={104}
                alt=""
              />
            </div>
            <h2>웨딧과 함께하는 웨딩 플랜</h2>
            <p className={s.muted}>
              링크를 보내 짝꿍을 초대하세요. 같은 계획을 함께 보고 체크할 수 있어요.
            </p>
            <Link className={s.primary} href="/home?panel=members">
              짝꿍 초대하기
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
