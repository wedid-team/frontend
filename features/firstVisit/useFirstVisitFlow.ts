"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  firstVisitHref,
  hasRegionAnswers,
  hasTimingAnswers,
  readSharedEstimate,
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
  const plan = screen === "result" ? search.get("plan") : null;
  const sharedEstimate = useMemo(() => readSharedEstimate(plan), [plan]);
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
    let active = true;
    const finish = () => {
      if (active) setReady(true);
    };
    void Promise.resolve()
      .then(() => useFirstVisitStore.persist.rehydrate())
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || sharedEstimate) return;
    if (plan !== null) {
      router.replace("/?screen=region");
      return;
    }
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
  }, [screen, ready, answers, tier, router, plan, sharedEstimate]);

  return {
    screen,
    ready: sharedEstimate !== null || (ready && plan === null),
    today,
    loginOpen,
    closeLogin: () => setLoginOpen(false),
    answers,
    tier,
    sharedEstimate,
    updateAnswers,
    setTier,
    navigate,
    openLogin,
  };
}
