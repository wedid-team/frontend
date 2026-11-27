"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { SavePlanLoginModal } from "@/features/firstVisit/components/auth/savePlanLoginModal";
import { firstVisitHref } from "@/features/firstVisit/model";
import { Button } from "@/src/components/common";
import ui from "@/src/features/planner/components/ui.module.css";
import { isDemoScenario } from "@/src/features/planner/mocks/plannerMock";
import { usePlannerStore } from "@/src/features/planner/stores/plannerStore";
import { useUtAuthStore } from "@/src/stores/utAuthStore";
import styles from "./plannerLayout.module.css";

export function PlannerAccess({ children }: { children: ReactNode }) {
  const signedIn = useUtAuthStore((state) => state.provider !== null);
  const hasSavedPlan = usePlannerStore((state) => state.hasSavedPlan);
  const demo = useSearchParams().get("demo");
  const [loginOpen, setLoginOpen] = useState(false);

  if (hasSavedPlan ? signedIn : isDemoScenario(demo)) return children;

  return (
    <main className={styles.emptyState}>
      <section className={ui.card}>
        <h1 className={ui.pageTitle}>
          {hasSavedPlan ? "로그인하고 저장한 계획을 열어 보세요" : "아직 저장된 계획이 없어요"}
        </h1>
        <p className={ui.pageLead}>
          {hasSavedPlan
            ? "로그인하면 이 브라우저에서 준비하던 로드맵을 이어서 볼 수 있어요."
            : "결혼 조건을 입력하고 예상 비용을 확인하면 준비 로드맵을 저장할 수 있어요."}
        </p>
        <div className={styles.emptyActions}>
          {hasSavedPlan ? (
            <Button onClick={() => setLoginOpen(true)}>로그인하고 계획 열기</Button>
          ) : (
            <Link className={ui.textLink} href={firstVisitHref("region")}>
              결혼 비용 계산하기 →
            </Link>
          )}
        </div>
      </section>
      {loginOpen && <SavePlanLoginModal onClose={() => setLoginOpen(false)} restoreOnly />}
    </main>
  );
}
