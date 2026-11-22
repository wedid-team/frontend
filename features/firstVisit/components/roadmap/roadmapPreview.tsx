import { useState } from "react";
import { RoadmapSidebar } from "./roadmapSidebar";
import { RoadmapTimeline } from "./roadmapTimeline";
import { EditConditionsDrawer } from "../conditions/editConditionsDrawer";
import { mockRoadmapSteps, previewMonthRange } from "../../mockRoadmap";
import Image from "next/image";
import { Button } from "@/src/components/common";
import { assets } from "../../assets";
import {
  budgetLabel,
  conditionLabel,
  daysUntilWedding,
  type EstimateTier,
  type WeddingAnswers,
} from "../../model";
import { getMockEstimate } from "../../mockEstimate";
import { FlowIcon, MockNotice, type FlowActions } from "../layout/flowUi";
import styles from "./roadmapPreview.module.css";

type RoadmapPreviewProps = FlowActions & {
  answers: WeddingAnswers;
  tier: EstimateTier;
  today: Date;
  updateAnswers: (patch: Partial<WeddingAnswers>) => void;
};

export function RoadmapPreview({
  answers,
  tier,
  today,
  navigate,
  openLogin,
  updateAnswers,
}: RoadmapPreviewProps) {
  const result = getMockEstimate(answers, tier);
  const days = daysUntilWedding(answers, today);
  const currentStep = mockRoadmapSteps.find((step) => step.status === "current");
  const currentStepNumber = currentStep ? mockRoadmapSteps.indexOf(currentStep) + 1 : 0;
  const dDay = days === null ? "시기 미정" : days >= 0 ? `D-${days}` : `D+${Math.abs(days)}`;
  const [editing, setEditing] = useState(false);
  return (
    <main className={styles.roadmapPage}>
      <RoadmapSidebar {...{ answers, dDay, navigate, openLogin }} steps={mockRoadmapSteps} />
      <div className={styles.roadmapContent}>
        <header className={styles.roadmapIntro}>
          <p className="tEyebrow">
            준비 로드맵 · 전체 {mockRoadmapSteps.length}단계 · 예식 {dDay}
          </p>
          <h1 className="tH1">
            우리의 웨딩 로드맵 <small>• 진행중</small>
          </h1>
          <p>결혼식을 위한 일정을 확인하고, 차근차근 준비해보세요.</p>
          <div className={styles.conditions}>
            <span>
              예식 예정: {conditionLabel(answers, { timingFirst: true })} · 토요일 낮 예식 기준
            </span>
            <button className={styles.textButton} onClick={() => setEditing(true)}>
              <FlowIcon icon={assets.icons.settings} />
              조건 수정
            </button>
            <Button variant="outline" onClick={openLogin}>
              <FlowIcon icon={assets.icons.invite} />
              짝꿍 초대
            </Button>
          </div>
        </header>
        <div className={styles.roadmapGrid}>
          <div>
            <section className={styles.saveBanner}>
              <span className={styles.saveHeart}>
                <FlowIcon icon={assets.icons.saveHeart} />
              </span>
              <p>
                <strong>지금 계획은 이 브라우저에만 임시로 보관돼요.</strong> 로그인하면 계획이
                저장되고,
                <br />내 조건에 맞는 예식장 후보를 볼 수 있어요.
              </p>
              <Button size="sm" onClick={openLogin}>
                로그인하고 계획 저장
              </Button>
            </section>
            <section className={styles.nextTask}>
              <div>
                <span className={styles.nextTaskBadge}>• 다음 할 일 · {currentStepNumber}단계</span>
                <small>{previewMonthRange(answers, currentStep?.months ?? [])}</small>
              </div>
              <h2>{currentStep?.title}</h2>
              <p>
                예식 {dDay} · 권장 시기 {currentStep?.range}
              </p>
              <footer>
                <div>
                  <small>이번 단계 예산</small>
                  <strong>{result.venueRange}</strong>
                </div>
                <Button variant="outline" onClick={openLogin}>
                  단계 보기 <FlowIcon icon={assets.icons.darkArrow} />
                </Button>
              </footer>
            </section>
            <RoadmapTimeline
              answers={answers}
              steps={mockRoadmapSteps}
              result={result}
              openLogin={openLogin}
            />
            <MockNotice />
          </div>
          <aside className={styles.roadmapAside}>
            <section className={styles.panel}>
              <div className={styles.sectionHeading}>
                <h2 className="tH4">우리 예산</h2>
                <button className={styles.textButton} onClick={() => navigate("result")}>
                  예상 비용 <FlowIcon icon={assets.icons.chevron} />
                </button>
              </div>
              <dl className={styles.budgetTable}>
                {[
                  ["설정한 예산", budgetLabel(answers)],
                  ["지금까지 쓴 금액", "0원"],
                  ["남은 예산", budgetLabel(answers)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className={`${styles.panel} ${styles.partnerPreview}`}>
              <div>
                <Image
                  alt="웨딧과 함께하는 신랑 신부"
                  src={assets.images.couple}
                  width={104}
                  height={104}
                  unoptimized
                />
              </div>
              <h2 className="tH4">웨딧과 함께하는 웨딩 플랜</h2>
              <p>민지 님과 같은 로드맵을 함께 보고 있어요.</p>
            </section>
            <section className={styles.panel}>
              <h2 className="tH4">함께하는 멤버</h2>
              {["나", "파트너 (민지)"].map((name, index) => (
                <div className={styles.memberRow} key={name}>
                  <Image src={assets.images.avatar} alt="" width={36} height={36} unoptimized />
                  <div>
                    <strong>{name}</strong>
                    <small>{index === 0 ? "로그인하면 저장돼요" : "구글로 합류"}</small>
                  </div>
                  <span>{index === 0 ? "나" : "짝꿍"}</span>
                </div>
              ))}
            </section>
          </aside>
        </div>
      </div>
      {editing && (
        <EditConditionsDrawer
          answers={answers}
          tier={tier}
          onApply={(nextAnswers) => {
            updateAnswers(nextAnswers);
            setEditing(false);
          }}
          onClose={() => setEditing(false)}
        />
      )}
    </main>
  );
}
