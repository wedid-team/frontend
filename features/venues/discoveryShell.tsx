"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { SiteHeader } from "../../src/components/layout/siteHeader";
import { SideNavigation } from "../../src/components/layout/sideNavigation";
import { workspaceNavigationItems } from "../../src/components/layout/workspaceNavigation";
import { PLANNER_ROUTES } from "@/src/features/planner/routes";
import { useDiscovery } from "./useDiscovery";
import { venues } from "./venueData";
import { DiscoveryIcon, discoveryStyles as s, type DiscoveryIconName } from "./shared";

import { ProfileMenu, s as returnStyles } from "../returning/returnUi";
import {
  formatMonth,
  stepHref,
  steps,
  useProgress,
  useReturnPlan,
  useReturnReady,
  weddingDday,
} from "../returning/returnPlan";

const menuIcons: DiscoveryIconName[] = ["home", "roadmap", "budget", "pin"];
const discoveryNavigation = workspaceNavigationItems.map((item, index) => ({
  ...item,
  icon: <DiscoveryIcon name={menuIcons[index]} />,
}));

const venueStep = { href: PLANNER_ROUTES.step("venue"), label: "예식장 계약" };
const sdmStep = { href: PLANNER_ROUTES.step("sdm"), label: "스드메 계약" };
const venueList = { href: "/venues", label: "예식장 후보" };
const sdmList = { href: "/sdm", label: "스드메 후보" };
const roadmap = { href: "/roadmap", label: "준비 로드맵" };

export function DiscoveryShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const signedIn = useDiscovery((state) => state.signedIn);
  const setSignedIn = useDiscovery((state) => state.setSignedIn);
  const count = useDiscovery((state) => state.compared.length);
  const ready = useReturnReady();
  const { count: completed, percent } = useProgress();
  const conditions = useReturnPlan((state) => state.conditions);
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
      <div className={s.top + " " + returnStyles.workspaceTop}>
        <SiteHeader
          variant="workspace"
          breadcrumbs={breadcrumbs.map((item, index) =>
            index === breadcrumbs.length - 1 ? { label: item.label } : item,
          )}
        />
        {ready &&
          (signedIn ? (
            <div className={returnStyles.workspaceAccount}>
              <div className={s.couple} aria-label="준근과 민지">
                <Image src="/images/avatars/avatar-minji.png" alt="" width={24} height={24} />
                <Image src="/images/avatars/avatar-joongeun.png" alt="" width={24} height={24} />
              </div>
              <ProfileMenu />
            </div>
          ) : (
            <div className={s.previewControls}>
              <button className={s.textAction} onClick={() => setSignedIn(true)}>
                로그인
              </button>
              <button className={s.primary} onClick={() => setSignedIn(true)}>
                계획 저장하기
              </button>
            </div>
          ))}
      </div>
      <div className={s.frameBody}>
        <aside className={s.sidebar}>
          <div className={s.wedding}>
            <b>W</b>
            <div>
              <strong>우리의 웨딩</strong>
              <small>
                {formatMonth(conditions.month)} · {conditions.region.replace("서울 ", "")}
              </small>
            </div>
          </div>
          <SideNavigation items={discoveryNavigation} />
          <nav className={s.steps} aria-label="준비 단계">
            <p>준비 단계</p>
            {steps.map((step, index) => (
              <div key={step.id}>
                <Link className={s.step} href={stepHref(step)}>
                  <b data-active={signedIn && index <= completed}>
                    {signedIn && index < completed ? "✓" : index + 1}
                  </b>
                  {step.title}
                </Link>
                {step.id === "venue" && (
                  <>
                    <Link
                      className={s.stepLink}
                      aria-current={
                        pathname.startsWith("/venues") && !isCompare ? "page" : undefined
                      }
                      href="/venues"
                    >
                      예식장 후보 보기
                    </Link>
                    <Link
                      className={s.stepLink}
                      aria-current={isCompare ? "page" : undefined}
                      href="/venues/compare"
                    >
                      업체 비교하기 {ready && signedIn && count > 0 && <span>{count}</span>}
                    </Link>
                  </>
                )}
                {step.id === "sdm" && (
                  <Link
                    className={s.stepLink}
                    aria-current={isSdm ? "page" : undefined}
                    href="/sdm"
                  >
                    스드메 후보 보기
                  </Link>
                )}
              </div>
            ))}
          </nav>
          <div className={s.countdown}>
            <p>예식까지</p>
            <strong>{weddingDday}</strong>
            <progress max={6} value={signedIn ? completed : 0} />
            <p>전체 진행률 {signedIn ? percent : 0}%</p>
          </div>
        </aside>
        <main className={s.main} aria-busy={!ready}>
          {!ready ? (
            <p role="status">계획을 불러오는 중이에요.</p>
          ) : isHome && !signedIn ? (
            <section className={s.empty}>
              <h1>로그인하면 내 계획을 볼 수 있어요</h1>
              <button className={s.primary} onClick={() => setSignedIn(true)}>
                미리보기 로그인
              </button>
            </section>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
