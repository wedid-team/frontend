"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { isDemoScenario } from "../mocks/plannerMock";
import { usePlannerStore } from "../stores/plannerStore";

/**
 * MOCK 전용: 주소에 ?demo=complete 같은 값을 붙이면 화면 상태를 바꿔서 볼 수 있다.
 * (default · complete · undecided · noBudget · overdue · venueDone · sdmDone · noPartner)
 * API 연동 후 삭제한다.
 */
export function DemoScenarioLoader() {
  const searchParams = useSearchParams();
  const demo = searchParams.get("demo");
  const loadScenario = usePlannerStore((state) => state.loadScenario);

  useEffect(() => {
    if (isDemoScenario(demo)) loadScenario(demo, new Date());
  }, [demo, loadScenario]);

  return null;
}
