"use client";

import { useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { FirstVisitFlow } from "@/features/firstVisit/firstVisitFlow";
import { ReturningLanding } from "@/features/returning/returnLanding";
import { usePlannerStore } from "@/src/features/planner/stores/plannerStore";
import { useUtAuthStore } from "@/src/stores/utAuthStore";

const subscribe = () => () => {};

export function PublicEntry() {
  const params = useSearchParams();
  const signedIn = useUtAuthStore((state) => state.provider !== null);
  const hasSavedPlan = usePlannerStore((state) => state.hasSavedPlan);
  // localStorage는 동기로 복원되지만 React의 첫 렌더는 서버 스냅샷을 사용한다.
  const clientReady = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (params.has("screen") || params.has("plan")) return <FirstVisitFlow />;
  if (!clientReady) return null;
  return signedIn && hasSavedPlan ? <ReturningLanding /> : <FirstVisitFlow />;
}
