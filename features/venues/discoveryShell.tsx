"use client";

import { useUtAuthStore } from "@/src/stores/utAuthStore";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { SiteHeader } from "../../src/components/layout/siteHeader";
import { PLANNER_ROUTES } from "@/src/features/planner/routes";
import { usePlannerStore } from "@/src/features/planner/stores/plannerStore";
import { firstVisitHref } from "../firstVisit/model";
import { useDiscovery } from "./useDiscovery";
import { venues } from "./venueData";
import { discoveryStyles as s } from "./shared";
import { PlannerSidebar } from "@/src/features/planner/components/plannerSidebar";
import layout from "@/src/app/(planner)/plannerLayout.module.css";

import { ProfileSignOut, returningProfileUser } from "../returning/returnUi";
import { useReturnReady } from "../returning/returnPlan";

const venueStep = { href: PLANNER_ROUTES.step("venue"), label: "예식장 계약" };
const sdmStep = { href: PLANNER_ROUTES.step("sdm"), label: "스드메 계약" };
const venueList = { href: "/venues", label: "예식장 후보" };
const sdmList = { href: "/sdm", label: "스드메 후보" };
const roadmap = { href: "/roadmap", label: "준비 로드맵" };

export function DiscoveryShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const signedIn = useUtAuthStore((state) => state.provider !== null);
  const signIn = useUtAuthStore((state) => state.signIn);
  const count = useDiscovery((state) => state.compared.length);
  const ready = useReturnReady();
  const plan = usePlannerStore();
  const showPlan = ready && signedIn && plan.hasSavedPlan;
  const isHome = pathname === "/home";
  const isBudget = pathname === "/budget";
  const isSdm = pathname === "/sdm";
  const isCompare = pathname === "/venues/compare";
  const detail = venues.find((venue) => pathname === "/venues/" + venue.id);
  const list = isSdm ? sdmList : venueList;
  const home = { href: "/home", label: "홈" };
  const breadcrumbs = isHome
    ? [home]
    : isBudget
      ? [roadmap, { href: "/budget", label: "예상 비용" }]
      : [roadmap, isSdm ? sdmStep : venueStep, list];
  if (isCompare) breadcrumbs.push({ label: "비교하기", href: pathname });
  if (detail) breadcrumbs.push({ label: detail.name, href: pathname });

  return (
    <div className={s.frame}>
      <SiteHeader
        key={pathname}
        variant="workspace"
        breadcrumbs={breadcrumbs.map((item, index) => index === breadcrumbs.length - 1 ? { label: item.label } : item)}
        user={ready && signedIn ? returningProfileUser(plan.me.name) : null}
        accountActions={<ProfileSignOut />}
        accountLeading={showPlan && plan.partner ? (
          <div className={s.couple} aria-label={plan.me.name + "과 " + plan.partner.name}>
            <Image src="/images/avatars/avatar-minji.png" alt="" width={24} height={24} />
            <Image src="/images/avatars/avatar-joongeun.png" alt="" width={24} height={24} />
          </div>
        ) : undefined}
        guestActions={ready && !signedIn ? (
          <div className={s.previewControls}>
            <button className={s.textAction} onClick={() => signIn()}>로그인</button>
            <button className={s.primary} onClick={() => signIn()}>계획 저장하기</button>
          </div>
        ) : undefined}
      />
      <div className={layout.page}>
        <div className={layout.shell}>
          <Suspense fallback={<div />}>
            <PlannerSidebar showPlan={showPlan} comparedCount={ready && signedIn ? count : 0} />
          </Suspense>
          <main className={layout.main + " " + s.main} aria-busy={!ready}>
            <div className={layout.main__inner}>
              {!ready ? (
                <p role="status">계획을 불러오는 중이에요.</p>
              ) : isHome && !showPlan ? (
                <section className={s.empty}>
                  <h1>
                    {plan.hasSavedPlan
                      ? "로그인하면 내 계획을 볼 수 있어요"
                      : "아직 저장된 계획이 없어요"}
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
              ) : (
                children
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
