"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  firstVisitHref,
  hasRegionAnswers,
  hasTimingAnswers,
  isTier,
  sanitizeAnswers,
  type FlowScreen,
} from "./model";
import { loadMockEstimate } from "./mockEstimate";
import { useFirstVisitStore } from "./store";

const screens: FlowScreen[] = ["home", "region", "timing", "mood", "loading", "result", "roadmap"];

export function useFirstVisitFlow() {
  const router = useRouter();
  const search = useSearchParams();
  const requested = search.get("screen");
  const screen = screens.find((value) => value === requested) ?? "home";
  const [ready, setReady] = useState(false);
  const [today] = useState(() => new Date());
  const [loginOpen, setLoginOpen] = useState(false);
  const initialized = useRef(false);
  const answers = useFirstVisitStore((state) => state.answers);
  const tier = useFirstVisitStore((state) => state.tier);
  const updateAnswers = useFirstVisitStore((state) => state.updateAnswers);
  const setTier = useFirstVisitStore((state) => state.setTier);
  const navigate = useCallback(
    (next: FlowScreen) => {
      setLoginOpen(false);
      router.push(firstVisitHref(next));
    },
    [router],
  );
  const openLogin = () => setLoginOpen(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    void Promise.resolve(useFirstVisitStore.persist.rehydrate()).finally(() => {
      // 공유 URL의 조건도 저장소와 같은 검증을 거친다.
      const plan = new URLSearchParams(window.location.search).get("plan");
      if (plan && plan.length < 5000) {
        try {
          const saved: unknown = JSON.parse(plan);
          if (saved && typeof saved === "object") {
            const shared = saved as Record<string, unknown>;
            updateAnswers(sanitizeAnswers(shared.answers));
            if (isTier(shared.tier)) setTier(shared.tier);
            // 공유 조건은 한 번만 적용해 이후 수정한 임시 계획의 복원을 방해하지 않는다.
            const url = new URL(window.location.href);
            url.searchParams.delete("plan");
            router.replace(`${url.pathname}${url.search}`);
          }
        } catch {
          /* 손상된 공유 정보는 기존 임시 계획을 유지한다. */
        }
      }
      setReady(true);
    });
  }, [updateAnswers, setTier, router]);

  useEffect(() => {
    if (!ready) return;
    const requiresRegion = ["timing", "mood", "loading", "result"].includes(screen);
    if (requiresRegion && !hasRegionAnswers(answers)) {
      router.replace("/?screen=region");
      return;
    }
    if (["mood", "loading", "result"].includes(screen) && !hasTimingAnswers(answers)) {
      router.replace("/?screen=timing");
      return;
    }
    if (screen !== "loading") return;
    const controller = new AbortController();
    void loadMockEstimate(answers, tier, controller.signal)
      .then(() => router.replace("/?screen=result"))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError"))
          router.replace("/?screen=mood");
      });
    return () => controller.abort();
  }, [screen, ready, answers, tier, router]);

  return {
    screen,
    ready,
    today,
    loginOpen,
    closeLogin: () => setLoginOpen(false),
    answers,
    tier,
    updateAnswers,
    setTier,
    navigate,
    openLogin,
  };
}
