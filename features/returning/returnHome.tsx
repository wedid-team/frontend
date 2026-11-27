"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DiscoveryIcon } from "../venues/shared";
import { ChecklistCard, CostSummary, CurrentStage, s } from "./returnUi";
import { formatMonth, useReturnPlan, weddingDday } from "./returnPlan";

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
