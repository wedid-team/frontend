import { EstimateSummary } from "./estimateSummary";
import { Button, TierCardGroup } from "@/src/components/common";
import { assets } from "../assets";
import {
  assumedGuestRange,
  conditionLabel,
  isTier,
  unknownGuestCount,
  type EstimateTier,
  type WeddingAnswers,
} from "../model";
import { formatMockRange, getMockEstimate, mockCombinations, tierOptions } from "../mockEstimate";
import { FlowIcon, MockNotice, type FlowActions } from "./flowUi";
import styles from "./estimateResult.module.css";

type EstimateResultProps = FlowActions & {
  answers: WeddingAnswers;
  tier: EstimateTier;
  setTier: (value: EstimateTier) => void;
};

export function EstimateResult({ answers, tier, setTier, navigate }: EstimateResultProps) {
  const result = getMockEstimate(answers, tier);

  return (
    <main className={styles.resultPage}>
      <div className={styles.resultContainer}>
        <header className={styles.resultIntro}>
          <p className="tEyebrow">비용 계산 결과</p>
          <h1 className="tH1">우리 결혼 예상 비용</h1>
          <p>답해 주신 조건을 확인하고 예식장과 스드메 비용 범위를 미리보세요.</p>
          <div className={styles.conditions}>
            <span>{conditionLabel(answers)}</span>
            <button className={styles.textButton} onClick={() => navigate("region")}>
              <FlowIcon icon={assets.icons.settings} />
              조건 수정
            </button>
          </div>
        </header>
        <div className={styles.resultGrid}>
          <div className={styles.costBreakdown}>
            <section className={`${styles.panel} ${styles.venueEstimate}`}>
              <div>
                <h2 className="tH3">예식장</h2>
                <p>
                  Figma 예시: 서울(강남 외) 예식장 57곳의 공개 가격 기준 (가운데 50%)
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
                  <p>예산대를 바꾸면 예상 비용 예시가 바로 바뀌어요 · 기본값: 스탠다드</p>
                </div>
                <strong>{result.stylingRange}</strong>
              </div>
              <div className={styles.tiers}>
                <TierCardGroup
                  name="estimateTier"
                  options={tierOptions}
                  value={tier}
                  onChange={(next) => {
                    if (isTier(next)) setTier(next);
                  }}
                />
              </div>
              <EstimateBreakdown result={result} />
              <div className={styles.combinationHeading}>
                <div>
                  <h3>
                    {tier === "standard" ? "이 예산대의 스드메 조합" : "스탠다드 스드메 조합 예시"}
                  </h3>
                  <small>스탠다드 예산대 · 서울 공개 가격 기준의 디자인 예시</small>
                </div>
                <button className={styles.textButton} disabled title="업체 정보는 준비 중이에요">
                  스드메 후보 보기 <FlowIcon icon={assets.icons.candidateChevron} />
                </button>
              </div>
              <StylingCombinations />
            </section>
            <section className={styles.extraCosts}>
              <h2 className="tH4">별도로 생길 수 있는 비용</h2>
              <p>원본 사진, 드레스 업그레이드, 헬퍼비 등 (합계 미포함)</p>
            </section>
            <MockNotice />
          </div>
          <EstimateSummary
            key={tier}
            result={result}
            answers={answers}
            tier={tier}
            navigate={navigate}
          />
        </div>
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
      </div>
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
        <strong>“{result.label}” 예산대 가격 참고 자료</strong>
        <dl>
          {breakdown && (
            <>
              {breakdown.items.map((item) => (
                <div key={item.label}>
                  <dt>{item.label} 공개 단품가 (중간 범위)</dt>
                  <dd>{formatMockRange(item)}</dd>
                </div>
              ))}
              <div className={styles.breakdownTotal}>
                <dt>항목별 단품가 합산</dt>
                <dd>{formatMockRange(breakdown.total)}</dd>
              </div>
            </>
          )}
          <div className={styles.breakdownTotal}>
            <dt>선택한 예산대의 스드메 예시 범위</dt>
            <dd>{result.stylingRange}</dd>
          </div>
        </dl>
        {breakdown ? (
          <p>
            Figma 예시 출처: 참가격 공개 단품가 (결혼준비대행업체) · 서울 공개 업체 27곳 · 2026.11
            기준. 같은 업체도 대행사에 따라 공개 가격과 포함 구성이 다를 수 있어요.
          </p>
        ) : (
          <p>
            이 예산대는 Figma의 총액 예시만 제공돼요. 항목별 단품가는 스탠다드 예산대에서 볼 수
            있어요.
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
