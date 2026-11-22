import { useState } from "react";
import { Button } from "@/src/components/common";
import { assets } from "../assets";
import { budgetLabel, type WeddingAnswers, type EstimateTier } from "../model";
import type { getMockEstimate } from "../mockEstimate";
import { FlowIcon, type FlowActions } from "./flowUi";
import styles from "./estimateSummary.module.css";

export function EstimateSummary({
  result,
  answers,
  tier,
  navigate,
}: Pick<FlowActions, "navigate"> & {
  result: ReturnType<typeof getMockEstimate>;
  answers: WeddingAnswers;
  tier: EstimateTier;
}) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const fitsBudget = !answers.budgetUnknown && Number(answers.budget) >= result.totalMax;

  async function copyResult() {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("screen", "result");
    url.searchParams.set("plan", JSON.stringify({ answers, tier }));
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  return (
    <aside className={styles.totalPanel}>
      <p>예상 총비용</p>
      <h2>{result.totalRange}</h2>
      <div
        className={styles.costBar}
        role="img"
        aria-label={`예시 비용 구성: 예식장 ${Math.round(result.venueShare)}%, 스드메 ${Math.round(100 - result.venueShare)}%`}
      >
        <i className={styles.venueCostSegment} style={{ width: `${result.venueShare}%` }} />
        <i className={styles.stylingCostSegment} />
      </div>
      <div className={styles.costLegend}>
        <span>
          <i />
          예식장
        </span>
        <span>
          <i />
          스드메
        </span>
      </div>
      <div className={styles.totalBudget}>
        <span>내 예산</span>
        <strong>{budgetLabel(answers)}</strong>
      </div>
      <p className={styles.budgetStatus}>
        {fitsBudget && <FlowIcon icon={assets.icons.budgetCheck} />}
        {answers.budgetUnknown
          ? "예산을 아직 정하지 않았어요"
          : fitsBudget
            ? "예산 안에 들어와요"
            : "예산보다 높은 예시 금액이에요"}
      </p>
      <Button
        size="lg"
        variant="outline"
        onClick={() => navigate("roadmap")}
        className={styles.whiteButton}
      >
        준비 로드맵 보기 <FlowIcon icon={assets.icons.darkArrow} />
      </Button>
      <div className={styles.shareActions}>
        <Button variant="soft" onClick={copyResult}>
          <FlowIcon icon={assets.icons.link} />
          {copyStatus === "copied" ? "복사했어요" : "결과 링크 복사"}
        </Button>
        <Button variant="kakao" disabled title="카카오톡 공유는 아직 연결되지 않았습니다">
          <FlowIcon icon={assets.icons.chat} />
          카카오톡 공유
        </Button>
      </div>
      {copyStatus === "failed" && (
        <p role="status">링크를 복사하지 못했어요. 다시 시도해 주세요.</p>
      )}
    </aside>
  );
}
