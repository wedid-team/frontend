"use client";

/**
 * 단계 03 · 04 스드메 예산 카드
 * F2 예산대 4구간 + 조합 3개 / E-09 · E-10 · E-17 산출 근거 / D-06 추가금 분리
 * 확인 필요: 피그마의 "추천" 배지는 기본값(E-10) 표시로 보고 그대로 두었다 — D-04 "추천 표현 금지"와 충돌하는지 PM 확인
 */
import Link from "next/link";
import { useState } from "react";
import {
  AlertCircleIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "../../planner/components/icons";
import { TierCardGroup } from "@/src/components/common";
import { cx } from "../../planner/components/ui";
import ui from "../../planner/components/ui.module.css";
import {
  DEFAULT_SDM_TIER,
  SDM_BASIS_MOCK,
  SDM_EXTRA_COSTS,
  SDM_TIER_OPTIONS,
  getSdmCombos,
} from "../../planner/mocks/plannerMock";
import { PLANNER_ROUTES } from "../../planner/routes";
import { usePlannerStore } from "../../planner/stores/plannerStore";
import type { SdmTier } from "../../planner/types";
import { formatManwon, formatRange } from "../../planner/utils/money";
import styles from "./step.module.css";

export function SdmBudgetCard({ isLocked }: { isLocked: boolean }) {
  const tier = usePlannerStore((state) => state.sdmTier);
  const setSdmTier = usePlannerStore((state) => state.setSdmTier);
  const selected = SDM_TIER_OPTIONS.find((option) => option.id === tier)!;
  const combos = getSdmCombos(tier);
  const [isBasisOpen, setBasisOpen] = useState(false);

  return (
    <section className={ui.card}>
      <div className={styles.sdm__header}>
        <div>
          <h2 className={ui.cardTitle}>스드메 예산</h2>
          <p className={styles.sdm__desc}>
            예산대를 바꾸면 이번 단계 예산과 예상 비용이 같이 바뀌어요 · 기본값: 이 지역 중간 수준
            구간
          </p>
        </div>
        <strong className={styles.sdm__total}>{formatRange(selected.range)}</strong>
      </div>

      <div className={styles.tiers}>
        <TierCardGroup
          label="스드메 예산대"
          name="sdm-tier"
          onChange={(value) => setSdmTier(value as SdmTier)}
          options={SDM_TIER_OPTIONS.map((option) => ({
            label: option.label,
            value: option.id,
            amountRange: option.rangeLabel,
            recommended: option.id === DEFAULT_SDM_TIER,
            disabled: isLocked && option.id !== tier,
          }))}
          value={tier}
        />
      </div>
      {isLocked && (
        <p className={styles.sdm__lockNote}>
          완료한 단계라 예산대를 바꿀 수 없어요 · 완료를 취소하면 바꿀 수 있어요
        </p>
      )}

      <button
        aria-expanded={isBasisOpen}
        className={styles.basisToggle}
        onClick={() => setBasisOpen((open) => !open)}
        type="button"
      >
        산출 근거 보기
        <ChevronDownIcon
          className={cx(isBasisOpen && styles["basisToggle__icon--open"])}
          size={14}
        />
      </button>
      {isBasisOpen && (
        <div className={styles.basis}>
          {/* MOCK: E-17 산출 근거 — BE 데이터 확정 후 교체 */}
          <p>공개 단품가(스튜디오 + 드레스 + 메이크업)를 합산한 총액 범위예요.</p>
          <p>
            출처 {SDM_BASIS_MOCK.source} · 공개 업체 {SDM_BASIS_MOCK.vendorCount}곳 · 기준일{" "}
            {SDM_BASIS_MOCK.baseDate}
          </p>
          <p>{SDM_BASIS_MOCK.note}</p>
          <p>실제 견적은 날짜, 옵션, 업체에 따라 달라질 수 있어요.</p>
        </div>
      )}

      <div className={styles.combos__header}>
        <h3 className={styles.combos__title}>
          이 예산대의 스드메 조합
          <span className={styles.combos__meta}>{selected.label} 예산대 · 서울 공개 가격 기준</span>
        </h3>
        <Link className={cx(ui.textLink, styles.combos__link)} href={PLANNER_ROUTES.sdmSearch}>
          스드메 후보 자세히 보기
          <ChevronRightIcon size={14} />
        </Link>
      </div>

      <ul className={styles.combos}>
        {combos.map((combo) => (
          <li className={styles.combo} key={combo.typeName}>
            <p className={styles.combo__type}>{combo.typeName}</p>
            <p className={styles.combo__range}>{formatRange(combo.range)}</p>
            <ul className={styles.combo__items}>
              {combo.items.map((item) => (
                <li className={styles.combo__item} key={item.category}>
                  <span className={styles.combo__copy}>
                    <span className={styles.combo__category}>{item.category}</span>
                    <span className={styles.combo__vendor}>{item.vendorName}</span>
                  </span>
                  <span className={styles.combo__price}>{formatManwon(item.priceFrom)}~</span>
                  {/* TODO: 업체 공식 채널 링크 (D-04 사진 · 소개글은 공식 채널로) */}
                  <a
                    aria-label={`${item.vendorName} 공식 채널`}
                    className={styles.combo__out}
                    href={item.href}
                  >
                    <ArrowUpRightIcon size={14} />
                  </a>
                </li>
              ))}
            </ul>
            <p className={styles.combo__note}>{combo.note}</p>
          </li>
        ))}
      </ul>

      <div className={styles.extra}>
        <span className={styles.extra__icon}>
          <AlertCircleIcon size={16} />
        </span>
        <div>
          <p className={styles.extra__title}>
            <strong>별도로 생길 수 있는 비용</strong> · 위 합계에 포함되지 않아요
          </p>
          <ul className={styles.extra__chips}>
            {SDM_EXTRA_COSTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
