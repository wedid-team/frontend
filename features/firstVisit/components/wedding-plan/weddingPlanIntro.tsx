"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/common";
import { assets } from "../../assets";
import { firstVisitHref, type FlowScreen } from "../../model";
import { FirstVisitHeader } from "../layout/firstVisitHeader";
import { FirstVisitFooter } from "../layout/firstVisitFooter";
import { FlowIcon } from "../layout/flowUi";
import { SavePlanLoginModal } from "../auth/savePlanLoginModal";
import {
  CostFeaturePreview,
  DashboardPreview,
  PartnerFeaturePreview,
  RoadmapFeaturePreview,
} from "./weddingPlanPreviews";
import styles from "./weddingPlanIntro.module.css";

const steps = [
  [
    "조건 입력",
    "질문 5개로 지역, 하객 수, 시기, 예산, 분위기를 고르면 돼요. 모르는 건 건너뛰어도 괜찮아요.",
  ],
  ["예상 비용 확인", "참가격 통계를 기반으로 예식장과 스드메 비용을 범위로 보여드려요."],
  ["로드맵 따라 준비", "D-day에 맞춰 할 일과 예산이 단계별로 정리돼요. 짝꿍과 나눠서 체크하세요."],
] as const;

const sources = [
  ["한국소비자원 참가격", assets.introIcons.data],
  ["결혼서비스 14개 권역 통계", assets.introIcons.summary],
  ["업체 공개 단품가", assets.introIcons.partner],
] as const;

export function WeddingPlanIntro() {
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = (screen: FlowScreen) => router.push(firstVisitHref(screen));
  const start = () => navigate("region");
  const openRoadmap = () => navigate("roadmap");

  return (
    <div className={styles.page}>
      <FirstVisitHeader home intro navigate={navigate} openLogin={() => setLoginOpen(true)} />
      <main>
        <section className={styles.hero}>
          <div className={styles.container}>
            <button className={styles.heroBadge} type="button" onClick={start}>
              <strong>무료</strong> 질문 5개로 1분 만에 끝나요{" "}
              <FlowIcon icon={assets.introIcons.badgeChevron} />
            </button>
            <h1>
              우리 결혼,
              <br />
              <span>얼마나 들까?</span>
            </h1>
            <p className={styles.heroDescription}>
              지역과 하객 수만 알려주세요. 예상 비용을 계산하고, 짝꿍과 함께 볼 준비 로드맵까지 한
              번에 만들어 드려요.
            </p>
            <div className={styles.heroActions}>
              <Button size="xl" onClick={start}>
                결혼 비용 계산하기 <FlowIcon icon={assets.icons.whiteArrow} />
              </Button>
              <Button
                size="xl"
                variant="outline"
                className={styles.previewAction}
                onClick={openRoadmap}
              >
                로드맵 미리보기
              </Button>
            </div>
            <ul className={styles.heroNotes}>
              {["회원가입 없이 계산", "결과는 링크로 공유", "참가격 통계 기반"].map((note) => (
                <li key={note}>
                  <FlowIcon icon={assets.icons.check} />
                  {note}
                </li>
              ))}
            </ul>
            <DashboardPreview />
            <div className={styles.sources}>
              <p>비용 데이터 출처</p>
              <ul>
                {sources.map(([name, icon]) => (
                  <li key={name}>
                    <FlowIcon icon={icon} />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className={`${styles.container} ${styles.steps}`}>
          <p className="tEyebrow">사용 방법</p>
          <h2>
            복잡한 결혼 준비,
            <br />세 단계면 정리돼요
          </h2>
          <ol>
            {steps.map(([title, text], index) => (
              <li key={title}>
                <span aria-hidden="true">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>
        <div className={styles.features}>
          <div className={styles.container}>
            <Feature
              label="예상 비용"
              title={
                <>
                  숫자 하나로 감 잡는
                  <br />
                  우리 결혼 비용
                </>
              }
              description="예식장은 대관료와 식대로, 스드메는 예산대별로 나눠 계산해요. 예산대를 바꾸면 결과가 바로 바뀌어요."
              points={[
                "지역·하객 수 기준 예상 범위",
                "베이직부터 럭셔리까지 스드메 예산대 비교",
                "산출 근거와 출처를 그대로 공개",
              ]}
              preview={<CostFeaturePreview />}
            />
            <Feature
              reverse
              label="준비 로드맵"
              title={
                <>
                  언제 무엇을, 얼마에
                  <br />
                  정할지 한눈에
                </>
              }
              description="예식일을 기준으로 6단계 로드맵을 만들어요. 지금 해야 할 일과 이번 단계에 쓸 수 있는 예산을 같이 보여드려요."
              points={["D-day에 맞춘 단계별 체크리스트", "단계 완료 시 남은 예산 자동 재계산"]}
              preview={<RoadmapFeaturePreview />}
            />
            <Feature
              label="함께 준비"
              title={
                <>
                  할 일은 나누고,
                  <br />
                  계획은 하나로
                </>
              }
              description="링크 하나로 짝꿍을 초대하면 같은 계획을 함께 보고 체크할 수 있어요. 누가 맡았는지도 한눈에 보여요."
              preview={<PartnerFeaturePreview />}
            >
              <Button variant="ghost" className={styles.featureLink} onClick={openRoadmap}>
                로드맵 둘러보기 <FlowIcon icon={assets.introIcons.chevron} />
              </Button>
            </Feature>
          </div>
        </div>
        <section className={`${styles.container} ${styles.closingSection}`}>
          <div className={styles.closingCard}>
            <h2>
              지금 우리 결혼 비용부터
              <br />
              알아볼까요?
            </h2>
            <p>로그인 없이 1분이면 결과를 볼 수 있어요.</p>
            <Button size="xl" variant="outline" onClick={start}>
              무료로 계산하기 <FlowIcon icon={assets.icons.darkArrow} />
            </Button>
          </div>
        </section>
      </main>
      <FirstVisitFooter navigate={navigate} intro />
      {loginOpen && <SavePlanLoginModal onClose={() => setLoginOpen(false)} />}
    </div>
  );
}

function Feature({
  label,
  title,
  description,
  points,
  preview,
  reverse = false,
  children,
}: {
  label: string;
  title: ReactNode;
  description: string;
  points?: readonly string[];
  preview: ReactNode;
  reverse?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className={styles.feature} data-reverse={reverse}>
      <div className={styles.featureCopy}>
        <p className="tEyebrow">{label}</p>
        <h2>{title}</h2>
        <p>{description}</p>
        {points && (
          <ul>
            {points.map((point) => (
              <li key={point}>
                <FlowIcon
                  icon={reverse ? assets.introIcons.calendar : assets.introIcons.featureCheck}
                />
                {point}
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>
      {preview}
    </section>
  );
}
