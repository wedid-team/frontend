import { assets } from "../assets";
import { timingLabel, type WeddingAnswers } from "../model";
import { previewProgress, type PreviewStep } from "../mockRoadmap";
import { FlowIcon, type FlowActions } from "./flowUi";
import styles from "./roadmapSidebar.module.css";

export function RoadmapSidebar({
  answers,
  steps,
  dDay,
  navigate,
  openLogin,
}: FlowActions & { answers: WeddingAnswers; steps: readonly PreviewStep[]; dDay: string }) {
  const menuItems = [
    { label: "홈", icon: assets.icons.home, action: () => navigate("home"), current: false },
    {
      label: "준비 로드맵",
      icon: assets.icons.roadmap,
      action: () => navigate("roadmap"),
      current: true,
    },
    {
      label: "예상 비용",
      icon: assets.icons.budget,
      action: () => navigate("result"),
      current: false,
    },
    { label: "예식장 찾기", icon: assets.icons.venue, action: openLogin, current: false },
  ];
  const progress = previewProgress(steps);
  return (
    <aside className={styles.roadmapSidebar}>
      <div className={styles.weddingIdentity}>
        <b>W</b>
        <div>
          <strong>우리의 웨딩</strong>
          <small>
            {timingLabel(answers)} · {answers.region.replace(/^서울 /, "") || "지역 미정"}
          </small>
        </div>
      </div>
      <nav aria-label="로드맵 메뉴">
        {menuItems.map((item) => (
          <button
            className={item.current ? styles.activeNav : ""}
            key={item.label}
            aria-current={item.current ? "page" : undefined}
            onClick={item.action}
          >
            <FlowIcon icon={item.icon} />
            {item.label}
          </button>
        ))}
      </nav>
      <p className={styles.sidebarCaption}>준비 단계</p>
      <ol className={styles.sideSteps}>
        {steps.map((step, index) => (
          <li
            key={step.id}
            data-status={step.status}
            aria-current={step.status === "current" ? "step" : undefined}
          >
            <span>
              {step.status === "completed" ? (
                <FlowIcon icon={assets.icons.smallCheck} />
              ) : (
                index + 1
              )}
            </span>
            <button onClick={openLogin}>{step.title}</button>
            {step.candidates && (
              <div>
                {step.candidates.map((label) => (
                  <button key={label} disabled title="업체 정보는 준비 중이에요">
                    {label}
                  </button>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
      <div className={styles.sideCountdown}>
        <small>예식까지</small>
        <strong>{dDay}</strong>
        <div
          role="progressbar"
          aria-label="준비 진행률 예시"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <i style={{ width: `${progress}%` }} />
        </div>
        <small>전체 진행률 {progress}%</small>
      </div>
    </aside>
  );
}
