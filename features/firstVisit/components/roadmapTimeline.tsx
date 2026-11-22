import { Button } from "@/src/components/common";
import { assets } from "../assets";
import { timingLabel, type WeddingAnswers } from "../model";
import { previewMonthRange, type PreviewStep } from "../mockRoadmap";
import type { getMockEstimate } from "../mockEstimate";
import { FlowIcon } from "./flowUi";
import styles from "./roadmapTimeline.module.css";

export function RoadmapTimeline({
  answers,
  steps,
  result,
  openLogin,
}: {
  answers: WeddingAnswers;
  steps: readonly PreviewStep[];
  result: ReturnType<typeof getMockEstimate>;
  openLogin: () => void;
}) {
  return (
    <section className={`${styles.panel} ${styles.timelinePanel}`}>
      <div className={styles.sectionHeading}>
        <h2 className="tH3">전체 일정</h2>
        <small>예식일 {timingLabel(answers)} 기준</small>
      </div>
      <div className={styles.timelineOverview}>
        {steps.map((step) => (
          <div key={step.id} data-status={step.status}>
            <i />
            <strong>{step.short}</strong>
            <small>{step.range}</small>
          </div>
        ))}
      </div>
      <ol className={styles.timeline}>
        {steps.map((step, index) => (
          <li
            key={step.id}
            data-status={step.status}
            aria-current={step.status === "current" ? "step" : undefined}
          >
            <span className={styles.timelineMarker}>
              {step.status === "completed" ? <FlowIcon icon={assets.icons.completed} /> : index + 1}
            </span>
            <div>
              <h3>{step.title}</h3>
              <p>
                {step.range} · {previewMonthRange(answers, step.months)}
                {step.cost === "venue"
                  ? ` · ${result.venueRange}`
                  : step.cost === "styling"
                    ? ` · ${result.stylingRange}`
                    : ""}
              </p>
            </div>
            {step.status === "completed" ? (
              <span className={styles.completeBadge}>• 완료</span>
            ) : (
              <Button
                size="sm"
                variant={step.status === "current" ? "primary" : "ghost"}
                onClick={openLogin}
              >
                {step.status === "current" ? "시작하기" : "보기"}
              </Button>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
