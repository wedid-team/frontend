import { useState } from "react";
import { EstimateSummary } from "./estimateSummary";
import { EditConditionsDrawer } from "../conditions/editConditionsDrawer";
import { Button, TierCardGroup } from "@/src/components/common";
import { assets } from "../../assets";
import {
  assumedGuestRange,
  conditionLabel,
  isTier,
  unknownGuestCount,
  type EstimateTier,
  type WeddingAnswers,
} from "../../model";
import { formatMockRange, getMockEstimate, mockCombinations, tierOptions } from "../../mockEstimate";
import { FlowIcon, MockNotice, type FlowActions } from "../layout/flowUi";
import styles from "./estimateResult.module.css";

type EstimateResultProps = FlowActions & {
  answers: WeddingAnswers;
  tier: EstimateTier;
  setTier: (value: EstimateTier) => void;
  updateAnswers: (patch: Partial<WeddingAnswers>) => void;
  sharedEstimate: { sharedAt: Date | null } | null;
};

const readOnlyTiers = tierOptions.map((option) => ({ ...option, disabled: true }));

export function EstimateResult({
  answers,
  tier,
  setTier,
  navigate,
  updateAnswers,
  sharedEstimate,
}: EstimateResultProps) {
  const [editing, setEditing] = useState(false);
  const result = getMockEstimate(answers, tier);
  const sharedDate = sharedEstimate?.sharedAt?.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  });

  return (
    <main className={styles.resultPage}>
      <div className={styles.resultContainer}>
        {sharedEstimate && (
          <div className={styles.sharedBanner}>
            <p>
              <FlowIcon icon={assets.icons.sharedResultLink} /> 공유받은 예상 비용이에요
              {sharedDate && ` · ${sharedDate} 기준`}
            </p>
            <Button size="sm" onClick={() => navigate("region")}>
              나도 계산해 보기
            </Button>
          </div>
        )}
        <header className={styles.resultIntro}>
          <p className="tEyebrow">비용 계산 결과</p>
          <h1 className="tH1">우리 결혼 예상 비용</h1>
          <p>답해 주신 조건으로 예식장과 스드메 비용을 범위로 계산했어요.</p>
          <div className={styles.conditions}>
            <span>{conditionLabel(answers)} · 토요일 낮 예식 기준</span>
            {!sharedEstimate && (
              <button className={styles.textButton} onClick={() => setEditing(true)}>
                <FlowIcon icon={assets.icons.settings} />
                조건 수정
              </button>
            )}
          </div>
        </header>
        <div className={styles.resultGrid}>
          <div className={styles.costBreakdown}>
            <section className={`${styles.panel} ${styles.venueEstimate}`}>
              <div>
                <h2 className="tH3">예식장</h2>
                <p>
                  서울(강남 외) 예식장 57곳의 공개 가격 기준 (가운데 50%)
                  {answers.guests === unknownGuestCount &&
                    ` · 하객 수 미정 · ${assumedGuestRange} 기준`}
                </p>
              </div>
              <strong>{result.venueRange}</strong>
            </section>
            <section className={`${styles.panel} ${styles.stylingEstimate}`}>
              <div className={styles.sectionHeading}>
                <div>
                  <h2 className="tH3">스드메</h2>
                  <p>예산대를 바꾸면 예상 비용이 바로 바뀌어요 · 기본값: 이 지역 중간 수준 구간</p>
                </div>
                <strong>{result.stylingRange}</strong>
              </div>
              <div className={`${styles.tiers}${sharedEstimate ? ` ${styles.readOnlyTiers}` : ""}`}>
                <TierCardGroup
                  name="estimateTier"
                  options={sharedEstimate ? readOnlyTiers : tierOptions}
                  value={tier}
                  onChange={(next) => {
                    if (!sharedEstimate && isTier(next)) setTier(next);
                  }}
                />
              </div>
              <EstimateBreakdown result={result} />
              <div className={styles.combinationHeading}>
                <div>
                  <h3>
                    {tier === "standard" ? "이 예산대의 스드메 조합" : "스탠다드 스드메 조합 예시"}
                  </h3>
                  <small>스탠다드 예산대 · 서울 공개 가격 기준</small>
                </div>
                {!sharedEstimate && (
                  <button className={styles.textButton} disabled title="업체 정보는 준비 중이에요">
                    스드메 후보 보기 <FlowIcon icon={assets.icons.candidateChevron} />
                  </button>
                )}
              </div>
              <StylingCombinations />
            </section>
            <section className={styles.extraCosts}>
              <h2 className="tH4">별도로 생길 수 있는 비용</h2>
              <p>원본 사진, 드레스 업그레이드, 헬퍼비 등 (합계 미포함)</p>
            </section>
            <p className={styles.costSource}>
              출처: 업체 공개 가격 (참가격 · 업체 홈페이지, 2026.11 기준) · 실제 견적은 날짜, 옵션,
              업체에 따라 달라질 수 있어요.
            </p>
            <MockNotice />
          </div>
          <EstimateSummary
            result={result}
            answers={answers}
            tier={tier}
            navigate={navigate}
            shared={!!sharedEstimate}
            onBudgetChange={(budget) => updateAnswers({ budget, budgetUnknown: false })}
          />
        </div>
        {!sharedEstimate && (
          <footer className={`${styles.panel} ${styles.nextStep}`}>
            <div>
              <strong>다음 단계</strong>
              <p>이 비용을 기준으로 D-day별 준비 로드맵을 만들어 드려요.</p>
            </div>
            <div className={styles.inlineActions}>
              <Button variant="outline" size="lg" onClick={() => navigate("mood")}>
                이전
              </Button>
              <Button size="lg" onClick={() => navigate("roadmap")}>
                준비 로드맵 보기 <FlowIcon icon={assets.icons.whiteArrow} />
              </Button>
            </div>
          </footer>
        )}
      </div>
      {editing && !sharedEstimate && (
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

function EstimateBreakdown({ result }: { result: ReturnType<typeof getMockEstimate> }) {
  const breakdown = result.stylingBreakdown;
  return (
    <details className={styles.calculationDetails}>
      <summary>
        산출 근거 보기 <FlowIcon icon={assets.icons.expand} />
      </summary>
      <div className={styles.breakdownPanel}>
        <strong>
          {breakdown
            ? `"${result.label}" 예산대 금액은 이렇게 계산했어요`
            : `"${result.label}" 예산대 가격 범위`}
        </strong>
        <dl>
          {breakdown ? (
            <>
              {breakdown.items.map((item) => (
                <div key={item.label}>
                  <dt>{item.label} 공개 단품가 (중간 범위)</dt>
                  <dd>{formatMockRange(item)}</dd>
                </div>
              ))}
              <div className={styles.breakdownTotal}>
                <dt>스드메 총액 (합산)</dt>
                <dd>{formatMockRange(breakdown.total)}</dd>
              </div>
            </>
          ) : (
            <div className={styles.breakdownTotal}>
              <dt>선택한 예산대의 스드메 예시 범위</dt>
              <dd>{result.stylingRange}</dd>
            </div>
          )}
        </dl>
        {breakdown ? (
          <p>
            출처: 참가격 공개 단품가 (결혼준비대행업체) · 서울 공개 업체 27곳 · 기준일 2026.11
            <br />
            같은 업체도 대행사에 따라 공개 가격과 포함 구성이 다를 수 있어요.
          </p>
        ) : (
          <p>
            이 예산대는 총액 예시를 보여드려요. 항목별 단품가는 스탠다드 예산대에서 볼 수 있어요.
          </p>
        )}
      </div>
    </details>
  );
}

function StylingCombinations() {
  return (
    <div className={styles.combinationGrid}>
      {mockCombinations.map((combination) => (
        <article className={styles.combinationCard} key={combination.label}>
          <p>{combination.label}</p>
          <h4>{combination.range}</h4>
          <dl>
            {combination.items.map(([kind, name, price]) => (
              <div key={kind}>
                <dt>{kind}</dt>
                <dd>
                  <strong>{name}</strong>
                  <b>{price}</b>
                  <FlowIcon icon={assets.icons.externalLink} />
                </dd>
              </div>
            ))}
          </dl>
          <small>기본 상품 합산 · 플래너 경유가</small>
        </article>
      ))}
    </div>
  );
}
