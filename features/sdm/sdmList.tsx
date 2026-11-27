"use client";

import { useReturnPlan } from "../returning/returnPlan";
import { useState } from "react";
import { Select } from "../../src/components/common";
import { PLANNER_ROUTES } from "@/src/features/planner/routes";
import {
  BackLink,
  DiscoveryIcon,
  FavoriteButton,
  LoginGate,
  OfficialLink,
  PageHeading,
  StateCard,
  Toggle,
  discoveryStyles as s,
  type DiscoveryIconName,
} from "../venues/shared";
import { money, priceDate, range } from "../venues/venueData";
import { useDiscovery } from "../venues/useDiscovery";
import { categories, combinations, tiers, vendors, type Vendor } from "./sdmData";

const comboNames = ["실속형", "균형형", "프리미엄형"];
const sorts = ["낮은 가격순", "높은 가격순", "가나다순"];
const categoryIcons: Record<Vendor["category"], DiscoveryIconName> = {
  스튜디오: "mood",
  드레스: "dress",
  메이크업: "makeup",
};

function VendorCard({
  vendor,
  included,
  tier,
}: {
  vendor: Vendor;
  included: boolean;
  tier: string;
}) {
  return (
    <article className={s.vendorCard}>
      <div className={s.categoryPhoto}>
        <span aria-hidden="true">
          {<DiscoveryIcon name={categoryIcons[vendor.category]} size={36} />}
        </span>
        {vendor.category}
      </div>
      <div className={s.vendorBody}>
        <p className={s.muted}>
          {vendor.category} · 서울 강남구 · 공개 대행사 {vendor.agencies}곳
        </p>
        <div className={s.spread}>
          <h3>{vendor.name}</h3>
          <span className={s.publicBadge}>● 가격 공개</span>
        </div>
        <strong className={s.subName}>{vendor.subtitle}</strong>
        <div className={s.actions}>
          {included && <span className={s.pill}>✓ {tier} 조합에 포함</span>}
          <span className={s.small}>기본 상품 기준</span>
        </div>
        <div className={s.vendorFooter}>
          <span className={s.muted}>사진 · 소개글은 공식 채널에서</span>
          <div className={s.actions}>
            <OfficialLink url={vendor.officialUrl} />
            <FavoriteButton id={"sdm:" + vendor.id} />
          </div>
        </div>
      </div>
      <div className={s.pricePanel}>
        <dl>
          <dt>최저 단품가</dt>
          <dd>{money(vendor.min)}</dd>
          <dt>공개 대행사</dt>
          <dd>{vendor.agencies}곳</dd>
        </dl>
        <hr />
        <span>공개 단품가 범위</span>
        <strong>{range(vendor.min, vendor.max)}</strong>
        <p>대행사별 공개 가격의 최소~최대 · 플래너 경유가 · 추가 옵션 별도</p>
      </div>
    </article>
  );
}

function SdmResults() {
  const planTier = useReturnPlan((state) => state.tier);
  const [tier, setTier] = useState(() => {
    const query = new URLSearchParams(
      typeof window === "undefined" ? "" : window.location.search,
    ).get("tier");
    return query && /^[0-3]$/.test(query) ? Number(query) : planTier;
  });
  const [category, setCategory] = useState("전체");
  const [includedOnly, setIncludedOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState(sorts[0]);
  const favorites = useDiscovery((state) => state.favorites);
  const combos = combinations(tier);
  const included = new Set(combos.flat().map((vendor) => vendor.id));
  const results = vendors
    .filter(
      (vendor) =>
        (category === "전체" || vendor.category === category) &&
        (!includedOnly || included.has(vendor.id)) &&
        (!favoritesOnly || favorites.includes("sdm:" + vendor.id)),
    )
    .sort((a, b) =>
      sort === sorts[2]
        ? a.name.localeCompare(b.name, "ko")
        : sort === sorts[1]
          ? b.min - a.min
          : a.min - b.min,
    );

  return (
    <>
      <BackLink href={PLANNER_ROUTES.step("sdm")}>스드메 계약 단계로</BackLink>
      <PageHeading
        step="3단계 · 스드메 계약"
        title="스드메 후보"
        description="선택한 예산대 안의 스튜디오 · 드레스 · 메이크업 조합을 공개 단품가로 비교해요."
        budget={tiers[planTier].label}
      />
      <section className={s.comboPanel}>
        <h2>예산대별 스드메 조합</h2>
        <p className={s.muted}>
          예산대를 바꾸면 아래 조합이 바로 바뀌어요 · 기본값: 내 계획의 예산대
        </p>
        <div className={s.tiers} role="group" aria-label="스드메 예산대">
          {tiers.map((entry, index) => (
            <button
              key={entry.name}
              className={s.tier}
              aria-pressed={tier === index}
              onClick={() => setTier(index)}
            >
              {index === planTier && <span className={s.recommended}>추천</span>}
              <strong>{entry.name}</strong>
              <span>{entry.label}</span>
            </button>
          ))}
        </div>
        <h3>
          {tiers[tier].name} 예산대 조합 {combos.length}개
        </h3>
        <p className={s.muted}>서울 시안 예시 가격 · {priceDate} 기준</p>
        <div className={s.combos}>
          {combos.map((combo, index) => {
            const min = combo.reduce((total, item) => total + item.min, 0);
            const max = combo.reduce((total, item) => total + item.max, 0);
            return (
              <article className={s.combo} key={comboNames[index]}>
                <p className={s.eyebrow}>{comboNames[index]}</p>
                <h3>{range(min, max)}</h3>
                <p className={s.muted}>기본 상품 합산 · 플래너 경유가</p>
                {combo.map((vendor) => (
                  <div className={s.comboVendor} key={vendor.id}>
                    <p className={s.muted}>{vendor.category}</p>
                    <strong>{vendor.name}</strong>
                    <p>
                      <b>{range(vendor.min, vendor.max)}</b>
                      <span className={s.muted}> · 공개 대행사 {vendor.agencies}곳</span>
                    </p>
                    <OfficialLink url={vendor.officialUrl} />
                  </div>
                ))}
              </article>
            );
          })}
        </div>
        <div className={s.extras}>
          <span className={s.warning} aria-hidden="true">
            ⓘ
          </span>
          <div>
            <strong>별도로 생길 수 있는 비용</strong>
            <span className={s.muted}> · 위 합계에 포함되지 않아요</span>
            <div className={s.actions}>
              {["원본 사진 · 수정본", "드레스 업그레이드", "헬퍼비", "그 밖의 추가 옵션"].map(
                (item) => (
                  <span className={s.pill} key={item}>
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
        <p className={s.muted}>
          공개 단품가 기준 · 실제 견적은 날짜, 옵션, 업체에 따라 달라질 수 있어요.
        </p>
      </section>
      <section className={s.catalog}>
        <h2>스드메 업체 둘러보기</h2>
        <p className={s.muted}>공개 단품가 기준 · 사진과 소개글은 업체 공식 채널에서 확인해요</p>
        <div className={s.filterRow}>
          {["전체", ...categories].map((item) => (
            <button
              key={item}
              className={s.chip}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
          <Toggle checked={includedOnly} onChange={setIncludedOnly}>
            이 예산대 조합 업체만
          </Toggle>
          <Toggle checked={favoritesOnly} onChange={setFavoritesOnly}>
            관심 업체만
          </Toggle>
          <Select
            className={s.sort}
            aria-label="업체 정렬"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            options={sorts.map((item) => ({ label: item, value: item }))}
          />
        </div>
        <p className={s.results} aria-live="polite">
          <strong>{sort}</strong>{" "}
          <span className={s.muted}>
            업체 {results.length}곳 · {priceDate} 기준
          </span>
        </p>
        {!results.length ? (
          <StateCard
            icon="list"
            title="조건에 맞는 업체가 없어요"
            text="필터를 조정해 후보를 찾아보세요."
          />
        ) : (
          <div className={s.list}>
            {results.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                included={included.has(vendor.id)}
                tier={tiers[tier].name}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export function SdmList() {
  return (
    <LoginGate kind="sdm">
      <SdmResults />
    </LoginGate>
  );
}
