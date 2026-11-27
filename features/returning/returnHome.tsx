"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCopyInviteLink } from "@/src/features/invite/hooks/useCopyInviteLink";
import { usePlannerStore } from "@/src/features/planner/stores/plannerStore";
import { DiscoveryIcon } from "../venues/shared";
import { ChecklistCard, CostSummary, CurrentStage, s } from "./returnUi";
import { getSavedPlanSummary, getWeddingDateDisplay } from "./savedPlanSummary";

export function MemberPanel({ profile = false }: { profile?: boolean }) {
  const me = usePlannerStore((state) => state.me);
  const partner = usePlannerStore((state) => state.partner);
  const { copyLink, feedback } = useCopyInviteLink();
  return (
    <section className={s.card} id={profile ? "profile" : "members"}>
      <h2>{profile ? "내 정보" : "함께하는 멤버"}</h2>
      <div className={s.member}>
        <Image src="/images/avatars/avatar-joongeun.png" width={32} height={32} alt="" />
        <strong>{me.fullName}</strong>
        <small>나</small>
      </div>
      {!profile && (
        <>
          {partner ? (
            <div className={s.member}>
              <Image src="/images/avatars/avatar-minji.png" width={32} height={32} alt="" />
              <strong>{partner.fullName}</strong>
              <small>연결됨</small>
            </div>
          ) : (
            <button type="button" className={s.button} onClick={copyLink}>
              초대 링크 만들기
            </button>
          )}
          <div role="status">{feedback && <p className={s.muted}>{feedback}</p>}</div>
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
    icon: "members",
  },
] as const;

export function ReturnHome() {
  const plan = usePlannerStore();
  const summary = getSavedPlanSummary(plan);
  const tasks = plan.todos.filter((task) => task.stepId === summary.nextStep?.id);
  const date = getWeddingDateDisplay(plan.weddingDate);
  const conditions = [
    date.label,
    plan.conditions.regionLabel,
    plan.conditions.guestLabel ?? "하객 수 미정",
    plan.conditions.moods.join(" · ") || "분위기 상관없음",
  ];
  const panel = useSearchParams().get("panel");
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (panel) panelRef.current?.scrollIntoView({ block: "nearest" });
  }, [panel]);
  return (
    <>
      <header className={s.pageHead}>
        <p className={s.eyebrow}>홈 · {date.countdown}</p>
        <h1>{plan.me.name}님, 다시 오셨네요</h1>
        <p>{conditions.join(" · ")}</p>
      </header>
      <div className={s.workspaceColumns}>
        <div className={s.stack}>
          <CurrentStage plan={plan} tasks={tasks} summary={summary} />
          <ChecklistCard tasks={tasks} nextStep={summary.nextStep} />
        </div>
        <aside className={s.stack}>
          <CostSummary plan={plan} summary={summary} />
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
                    <small>
                      {"subtitle" in item
                        ? item.subtitle
                        : plan.partner
                          ? `${plan.partner.name} 님과 연결됨`
                          : "짝꿍 연결 전"}
                    </small>
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
