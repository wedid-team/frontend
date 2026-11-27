import { Suspense } from "react";
import { WorkspaceHeader } from "@/src/components/layout/workspaceHeader";
import { DemoScenarioLoader } from "@/src/features/planner/components/demoScenarioLoader";
import { PlannerSidebar } from "@/src/features/planner/components/plannerSidebar";
import { ToastHost } from "@/src/features/planner/components/ui";
import styles from "./plannerLayout.module.css";

/** 로그인 후 로드맵 · 단계 · 내 정보 화면 틀 (사이드바 + 본문). 피그마 1440 폭 한 덩어리를 화면 가운데에 둔다. */
export default function PlannerLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Suspense fallback={null}>
        <WorkspaceHeader />
      </Suspense>
      <div className={styles.page}>
        <div className={styles.shell}>
          <Suspense fallback={<div />}>
            <PlannerSidebar />
          </Suspense>
          <main className={styles.main}>
            <div className={styles.main__inner}>
              {/* 사용자별 화면이라 요청 시점에 그린다 (오늘 날짜 기준 D-day 계산) */}
              <Suspense fallback={null}>{children}</Suspense>
            </div>
          </main>
          <Suspense fallback={null}>
            <DemoScenarioLoader />
          </Suspense>
        </div>
        <ToastHost />
      </div>
    </>
  );
}
