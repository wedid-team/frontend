import styles from "./common.module.css";

export type StepStatus = "upcoming" | "current" | "complete";

export type StepItem = {
  label: string;
  status: StepStatus;
};

type StepIndicatorProps = {
  steps: StepItem[];
  className?: string;
  ariaLabel?: string;
};

export function StepIndicator({ ariaLabel = "진행 단계", className, steps }: StepIndicatorProps) {
  return (
    <ol aria-label={ariaLabel} className={[styles.steps, className].filter(Boolean).join(" ")}>
      {steps.map((step, index) => (
        <li
          aria-current={step.status === "current" ? "step" : undefined}
          className={`${styles.steps__item} ${styles[`steps__item--${step.status}`]}`}
          key={`${step.label}-${index}`}
        >
          <span aria-hidden="true" className={styles.steps__marker}>
            {step.status === "complete" ? "✓" : index + 1}
          </span>
          <span className={styles.steps__label}>{step.label}</span>
        </li>
      ))}
    </ol>
  );
}
