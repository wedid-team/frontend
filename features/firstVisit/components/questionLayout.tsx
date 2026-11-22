import { useEffect, useRef, type FormEvent, type ReactNode } from "react";
import { Button, StepIndicator } from "@/src/components/common";
import { assets } from "../assets";
import { budgetLabel, timingLabel, type WeddingAnswers, type FlowScreen } from "../model";
import { Brand, FlowIcon } from "./flowUi";
import styles from "./question.module.css";

export type QuestionStep = "region" | "timing" | "mood";

const questionSteps = [
  { screen: "region", label: "기본 정보", description: "지역 · 하객 수", questionCount: 2 },
  { screen: "timing", label: "예산, 일정", description: "결혼 시기 · 예산", questionCount: 4 },
  { screen: "mood", label: "취향", description: "예식장 분위기 (선택)", questionCount: 5 },
] as const;

function AnswerSummary({ answers }: { answers: WeddingAnswers }) {
  const summary = [
    ["지역", answers.region || "—"],
    ["하객", answers.guests || "—"],
    ["시기", answers.timing === "unknown" ? "—" : timingLabel(answers)],
    ["예산", answers.budgetUnknown ? "—" : budgetLabel(answers)],
    ["분위기", answers.moods.join(" · ") || "—"],
  ];
  return (
    <div className={styles.answerSummary}>
      <p>지금까지 입력한 정보</p>
      <dl>
        {summary.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function QuestionSidebar({
  answers,
  stepIndex,
  onHome,
}: {
  answers: WeddingAnswers;
  stepIndex: number;
  onHome: () => void;
}) {
  return (
    <aside className={styles.questionSidebar}>
      <Brand onClick={onHome} />
      <div className={styles.sidebarIntro}>
        <h2>
          우리 결혼 비용,
          <br />
          1분이면 알 수 있어요
        </h2>
        <p>
          모르는 질문은 건너뛰어도 괜찮아요.
          <br />
          나중에 언제든 바꿀 수 있어요.
        </p>
      </div>
      <StepIndicator
        appearance="sidebar"
        className={styles.questionSteps}
        steps={questionSteps.map((item, index) => ({
          label: item.label,
          description: item.description,
          status: index === stepIndex ? "current" : index < stepIndex ? "complete" : "upcoming",
        }))}
      />
      <AnswerSummary answers={answers} />
    </aside>
  );
}

export function QuestionField({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.question}>
      <p className={styles.questionNumber}>{number}</p>
      <h1>{title}</h1>
      <p className={styles.questionDescription}>{description}</p>
      <div className={styles.questionControl}>{children}</div>
    </section>
  );
}

export function QuestionLayout({
  step,
  answers,
  canContinue,
  navigate,
  children,
}: {
  step: QuestionStep;
  answers: WeddingAnswers;
  canContinue: boolean;
  navigate: (screen: FlowScreen) => void;
  children: ReactNode;
}) {
  const stepIndex = questionSteps.findIndex((item) => item.screen === step);
  const current = questionSteps[stepIndex];
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // 화면 전환 후 다음 입력의 문맥을 키보드/스크린리더에도 전달한다.
    bodyRef.current?.focus({ preventScroll: true });
  }, [step]);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (canContinue) navigate(questionSteps[stepIndex + 1]?.screen ?? "loading");
  }
  return (
    <main className={styles.wizard}>
      <QuestionSidebar answers={answers} stepIndex={stepIndex} onHome={() => navigate("home")} />
      <form className={styles.questionForm} onSubmit={submit}>
        <header className={styles.questionHeader}>
          <div>
            <span>
              질문 <strong>{current.questionCount}</strong> / 5
            </span>
            <div
              className={styles.questionProgress}
              role="progressbar"
              aria-label="질문 진행률"
              aria-valuemin={0}
              aria-valuemax={5}
              aria-valuenow={current.questionCount}
            >
              <i style={{ width: `${(current.questionCount / 5) * 100}%` }} />
            </div>
          </div>
          <button type="button" className={styles.textButton} onClick={() => navigate("home")}>
            <FlowIcon icon={assets.icons.exit} /> 나가기
          </button>
        </header>
        <div className={styles.questionBody} ref={bodyRef} tabIndex={-1}>
          {children}
        </div>
        <footer className={styles.questionFooter}>
          <div>
            {stepIndex > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(questionSteps[stepIndex - 1].screen)}
              >
                이전
              </Button>
            )}
            <Button type="submit" size="lg" disabled={!canContinue}>
              {step === "mood" ? "결과 보기" : "다음"}
            </Button>
          </div>
        </footer>
      </form>
    </main>
  );
}
