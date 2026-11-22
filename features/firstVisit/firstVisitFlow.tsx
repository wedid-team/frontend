"use client";

import { useFirstVisitFlow } from "./useFirstVisitFlow";
import { EstimateLoading } from "./components/estimateLoading";
import { FirstVisitHeader } from "./components/firstVisitHeader";
import { LandingPage } from "./components/landingPage";
import { QuestionScreen } from "./components/questionScreen";
import { EstimateResult } from "./components/estimateResult";
import { RoadmapPreview } from "./components/roadmapPreview";
import { SavePlanLoginModal } from "./components/savePlanLoginModal";
import styles from "./firstVisit.module.css";

export function FirstVisitFlow() {
  const {
    screen,
    ready,
    today,
    loginOpen,
    closeLogin,
    answers,
    tier,
    updateAnswers,
    setTier,
    navigate,
    openLogin,
  } = useFirstVisitFlow();
  const question = screen === "region" || screen === "timing" || screen === "mood";
  const actions = { navigate, openLogin };
  return (
    <div className={styles.flow}>
      {!question && (
        <FirstVisitHeader {...actions} home={screen === "home"} roadmap={screen === "roadmap"} />
      )}
      {screen === "home" ? (
        <LandingPage {...actions} />
      ) : !ready ? (
        <EstimateLoading restoring />
      ) : question ? (
        <QuestionScreen
          {...actions}
          step={screen}
          answers={answers}
          updateAnswers={updateAnswers}
        />
      ) : screen === "loading" ? (
        <EstimateLoading />
      ) : screen === "result" ? (
        <EstimateResult {...actions} answers={answers} tier={tier} setTier={setTier} />
      ) : (
        <RoadmapPreview {...actions} answers={answers} tier={tier} today={today} />
      )}
      {loginOpen && <SavePlanLoginModal onClose={closeLogin} />}
    </div>
  );
}
