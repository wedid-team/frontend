"use client";

import { assumedGuestRange, regionOptions } from "@/features/firstVisit/model";
import Link from "next/link";
import { useState } from "react";
import { Select } from "../../../src/components/common";
import { PLANNER_ROUTES } from "@/src/features/planner/routes";
import { usePlannerStore } from "@/src/features/planner/stores/plannerStore";
import {
  BackLink,
  CompareButton,
  DiscoveryIcon,
  FavoriteButton,
  LoginGate,
  OfficialLink,
  PageHeading,
  StateCard,
  Toggle,
  VenuePhoto,
  discoveryStyles as s,
} from "../shared";
import {
  estimateForGuests,
  moods,
  money,
  plan,
  priceDate,
  range,
  venues,
  type Venue,
} from "../venueData";
import { useDiscovery } from "../useDiscovery";

const guestRanges = ["50~100", "100~150", "150~200", "200~250", "250~300", "300~400"];
const guestEstimateRanges: Record<string, [number, number]> = {
  "100명 미만": [0, 99],
  "300명 이상": [300, 400],
};
const formatGuestFilter = (value: string) =>
  value in guestEstimateRanges ? `하객 ${value}` : `하객 ${value}명`;
const types = ["전체", "채플", "컨벤션", "호텔", "하우스", "야외"];
const options = (values: string[], label: (value: string) => string = (value) => value) =>
  values.map((value) => ({ value, label: label(value) }));

function VenueCard({
  venue,
  grid,
  guests,
  guestRange,
}: {
  venue: Venue;
  grid: boolean;
  guests: string;
  guestRange: [number, number];
}) {
  const price = venue.price;
  const estimate = price && estimateForGuests(price, guestRange);
  const fits = estimate && estimate[1] <= plan.venueBudget[1];
  return (
    <article className={s.vendorCard + (grid ? " " + s.gridCard : "")}>
      <Link
        href={"/venues/" + venue.id}
        className={s.photoLink}
        aria-label={venue.name + " 상세 보기"}
      >
        <VenuePhoto
          photo={grid || venue.hero === venue.id ? venue.id : venue.id + "-list"}
          name={venue.name + " 홀 사진"}
        />
        {venue.paused && <span className={s.overlayBadge}>휴업</span>}
      </Link>
      <div className={s.vendorBody}>
        <p className={s.muted}>
          {venue.district} · {venue.type} ·{" "}
          {venue.capacity ? venue.capacity.join("~") + "명" : "수용 인원 정보 없음"}
        </p>
        <div className={s.spread}>
          <Link href={"/venues/" + venue.id}>
            <h2>{venue.name}</h2>
          </Link>
          <span className={price ? s.publicBadge : s.muted}>
            {price ? "● 가격 공개" : "● 가격 미공개"}
          </span>
        </div>
        <strong className={s.subName}>{venue.hall}</strong>
        <div className={s.actions}>
          {estimate && (
            <span className={fits ? s.pill : s.warning}>
              {fits ? "✓ 예산 안에 들어와요" : "ⓘ 조건에 따라 예산을 넘을 수 있어요"}
            </span>
          )}
          <span className={s.small}>
            {venue.mood} ({venue.moodDetail})
          </span>
          {!venue.capacity && <span className={s.warning}>수용 인원 확인 필요</span>}
        </div>
        <div className={s.vendorFooter}>
          <span className={s.muted}>
            {venue.meal} · 주차 {venue.parking ? "가능" : "불가"}
          </span>
          <div className={s.actions}>
            <OfficialLink url={venue.officialUrl} />
            <FavoriteButton id={venue.id} />
            <CompareButton id={venue.id} />
          </div>
        </div>
      </div>
      <div className={price ? s.pricePanel : s.noPricePanel}>
        {price && estimate ? (
          <>
            <dl>
              <dt>대관료</dt>
              <dd>{money(price.rental)}</dd>
              <dt>식대 (1인)</dt>
              <dd>{money(price.meal)}</dd>
            </dl>
            <hr />
            <span>참고 금액</span>
            <strong>{range(...estimate)}</strong>
            <p>내 {guests} 기준, 보증 인원 · 필수 장식비 · VAT 반영</p>
          </>
        ) : (
          <>
            <strong className={s.small}>ⓘ 업체가 가격을 공개하지 않았어요</strong>
            <hr />
            <span>이 지역 시세</span>
            <strong>{range(1550, 1900)}</strong>
            <p>같은 지역 · {guests} 기준 예식장 예상 비용의 가운데 50%</p>
          </>
        )}
      </div>
    </article>
  );
}

function VenueResults() {
  const conditions = usePlannerStore((state) => state.conditions);
  const [region, setRegion] = useState(conditions.regionLabel);
  const [guests, setGuests] = useState(() => {
    const savedRange = conditions.guestLabel?.replace(/^하객 /, "").replace(/명$/, "");
    return savedRange && (guestRanges.includes(savedRange) || Object.prototype.hasOwnProperty.call(guestEstimateRanges, savedRange))
      ? savedRange
      : assumedGuestRange.replace(/명$/, "");
  });
  const [type, setType] = useState("전체");
  const [publicOnly, setPublicOnly] = useState(false);
  const [favoriteOnly, setFavoriteOnly] = useState(
    () =>
      new URLSearchParams(typeof window === "undefined" ? "" : window.location.search).get(
        "view",
      ) === "favorites",
  );
  const [grid, setGrid] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>(
    conditions.moods.filter((mood) => mood !== "상관없어요"),
  );
  const favorites = useDiscovery((state) => state.favorites);
  const comparedCount = useDiscovery((state) => state.compared.length);
  const estimateRange = guestEstimateRanges[guests];
  const guestRange = estimateRange ?? (guests.split("~").map(Number) as [number, number]);
  const guestEstimateLabel = formatGuestFilter(estimateRange ? estimateRange.join("~") : guests);
  const regions = Array.from(new Set([
    conditions.regionLabel,
    ...regionOptions.map(({ value }) => value),
    "경기·인천",
    "그 외 지역",
  ]));
  const regionVenues = venues.filter((venue) => venue.region === region);
  const matches = regionVenues.filter(
    (venue) =>
      (!venue.capacity ||
        (venue.capacity[0] <= (guests === "300명 이상" ? Infinity : guestRange[1]) &&
          venue.capacity[1] >= guestRange[0])) &&
      (type === "전체" || venue.type === type) &&
      (!publicOnly || venue.price) &&
      (!favoriteOnly || favorites.includes(venue.id)),
  );
  const complete = matches
    .filter((venue) => venue.price && venue.capacity)
    .sort(
      (a, b) => Number(selectedMoods.includes(b.mood)) - Number(selectedMoods.includes(a.mood)),
    );
  const incomplete = matches
    .filter((venue) => !venue.price || !venue.capacity)
    .sort((a, b) => a.name.localeCompare(b.name, "ko"));

  return (
    <>
      <BackLink href={PLANNER_ROUTES.step("venue")}>예식장 계약 단계로</BackLink>
      <PageHeading
        step="2단계 · 예식장 계약"
        title="예식장 후보"
        description="조건에 맞는 예식장을 공개 가격으로 비교하고, 최대 3곳까지 담아 비교할 수 있어요."
        budget={range(1550, 1900)}
      />
      <section className={s.filters} aria-label="예식장 검색 조건">
        <div className={s.filterRow}>
          <Select
            aria-label="지역"
            options={options(regions)}
            value={region}
            onChange={(event) => setRegion(event.target.value)}
          />
          <Select
            aria-label="하객 수"
            options={options([...guestRanges, ...Object.keys(guestEstimateRanges)], formatGuestFilter)}
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
          />
          <Select
            aria-label="홀 유형"
            options={options(types, (value) => "홀 유형: " + value)}
            value={type}
            onChange={(event) => setType(event.target.value)}
          />
          <Toggle checked={publicOnly} onChange={setPublicOnly}>
            가격 공개만 보기
          </Toggle>
          <Toggle checked={favoriteOnly} onChange={setFavoriteOnly}>
            관심 업체만
          </Toggle>
          <div className={s.viewSwitch} role="group" aria-label="보기 방식">
            <button
              type="button"
              aria-label="목록 보기"
              aria-pressed={!grid}
              onClick={() => setGrid(false)}
            >
              <DiscoveryIcon name="list" />
            </button>
            <button
              type="button"
              aria-label="격자 보기"
              aria-pressed={grid}
              onClick={() => setGrid(true)}
            >
              <DiscoveryIcon name="grid" />
            </button>
          </div>
        </div>
        <div className={s.filterRow}>
          <strong>분위기</strong>
          {moods.map((mood) => (
            <button
              type="button"
              className={s.chip}
              aria-pressed={selectedMoods.includes(mood)}
              key={mood}
              onClick={() =>
                setSelectedMoods((current) =>
                  current.includes(mood)
                    ? current.filter((item) => item !== mood)
                    : [...current, mood],
                )
              }
            >
              {mood}
            </button>
          ))}
          <button
            type="button"
            className={s.chip}
            aria-pressed={!selectedMoods.length}
            onClick={() => setSelectedMoods([])}
          >
            상관없어요
          </button>
          <span className={s.muted}>분위기는 순서에만 반영돼요</span>
        </div>
        <p className={s.muted}>ⓘ 기본값은 내 계획 조건이에요 · 여기서 바꿔도 계획은 그대로예요</p>
      </section>
      <div className={s.spread + " " + s.results}>
        <div>
          <strong>내 조건에 맞는 순</strong>{" "}
          <span className={s.muted} aria-live="polite">
            ⓘ 조건에 맞는 예식장 {matches.length}곳 · {priceDate} 기준
          </span>
          <p className={s.muted}>시안 예시 가격 기준 · 출처 표기: 참가격 / 업체 홈페이지</p>
        </div>
        {comparedCount > 0 && (
          <Link className={s.primary} href="/venues/compare">
            비교하기 ({comparedCount}/3)
          </Link>
        )}
      </div>
      {!regionVenues.length ? (
        <StateCard
          icon="pin"
          title="이 지역 예식장 정보는 아직 모으는 중이에요"
          text="다른 지역을 선택하면 등록된 예식장 후보를 볼 수 있어요."
        >
          <button
            className={s.button}
            onClick={() => setRegion(conditions.regionLabel)}
            disabled={region === conditions.regionLabel}
          >
            내 계획 지역으로
          </button>
        </StateCard>
      ) : !matches.length ? (
        <StateCard
          icon="list"
          title="조건에 맞는 예식장이 없어요"
          text="필터를 조정해 후보를 찾아보세요."
        />
      ) : (
        <>
          <div className={grid ? s.grid : s.list}>
            {complete.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                grid={grid}
                guests={guestEstimateLabel}
                guestRange={guestRange}
              />
            ))}
          </div>
          {!!incomplete.length && (
            <>
              <div className={s.incomplete}>
                <strong>정보가 부족한 예식장 ({incomplete.length}곳) · 가나다순</strong>
                <p className={s.muted}>필수 가격 · 인원 정보가 없어 순서의 맨 뒤에 모았어요</p>
              </div>
              <div className={grid ? s.grid : s.list}>
                {incomplete.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    grid={grid}
                    guests={guestEstimateLabel}
                    guestRange={guestRange}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export function VenueList() {
  return (
    <LoginGate kind="venue">
      <VenueResults />
    </LoginGate>
  );
}
