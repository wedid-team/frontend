"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { PLANNER_ROUTES } from "@/src/features/planner/routes";
import {
  BackLink,
  DiscoveryIcon,
  LoginGate,
  PageHeading,
  StateCard,
  VenueContractButton,
  VenuePhoto,
  discoveryStyles as s,
} from "../shared";
import { plan, range, venues, type Venue } from "../venueData";
import { compareLimit, useDiscovery } from "../useDiscovery";

const rows: { label: string; value: (venue: Venue) => string; highlight?: boolean }[] = [
  { label: "분위기", value: (venue) => venue.mood, highlight: true },
  { label: "운영 여부", value: (venue) => (venue.paused ? "휴업" : "운영 중"), highlight: true },
  { label: "식사 형태", value: (venue) => venue.meal, highlight: true },
  { label: "주차", value: (venue) => (venue.parking ? "가능" : "불가"), highlight: true },
  { label: "주소", value: (venue) => venue.address, highlight: true },
  { label: "연락처", value: (venue) => venue.phone },
  { label: "비고", value: (venue) => venue.note },
];

function Comparison() {
  const compared = useDiscovery((state) => state.compared);
  const toggle = useDiscovery((state) => state.toggleCompare);
  const clear = useDiscovery((state) => state.clearCompare);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const entries = compared.flatMap((id) => venues.find((entry) => entry.id === id) ?? []);
  const selected = entries.find((venue) => venue.id === selectedId && !venue.paused);
  const available = compareLimit - entries.length;

  if (!entries.length)
    return (
      <StateCard
        compact
        icon="list"
        title="비교할 업체를 담아 주세요"
        text="업체 찾기에서 [비교 담기]로 최대 3곳까지 담을 수 있어요"
      >
        <Link className={s.primary} href="/venues">
          업체 찾으러 가기
        </Link>
      </StateCard>
    );

  return (
    <>
      <PageHeading
        step="2단계 · 예식장 계약"
        title="업체 비교"
        description="최대 3개 업체까지 비교할 수 있어요. 값이 다른 주요 항목은 노란색으로 표시돼요."
        budget={range(plan.venueBudget[0], plan.venueBudget[1])}
      />
      <div className={s.spread + " " + s.compareTitle}>
        <h2>비교표</h2>
        <div className={s.actions}>
          <strong className={s.muted} aria-live="polite">
            선택한 업체 {entries.length}/{compareLimit}
          </strong>
          <button className={s.button} onClick={() => dialog.current?.showModal()}>
            전체 해제
          </button>
        </div>
      </div>
      <div className={s.tableWrap} tabIndex={0} role="region" aria-label="업체 비교표">
        <table className={s.table}>
          <thead>
            <tr>
              <th scope="col">업체명</th>
              {entries.map((venue) => (
                <th scope="col" className={s.compareVendor} key={venue.id}>
                  <div className={s.comparePhoto}>
                    <Link href={"/venues/" + venue.id}>
                      <VenuePhoto
                        photo={venue.compare ?? venue.id}
                        name={venue.name + " 홀 사진"}
                      />
                    </Link>
                    <button
                      type="button"
                      className={s.remove}
                      aria-label={venue.name + " 비교에서 제거"}
                      onClick={() => {
                        if (selectedId === venue.id) setSelectedId(null);
                        toggle(venue.id);
                      }}
                    >
                      <DiscoveryIcon name="closeWhite" size={14} />
                    </button>
                  </div>
                  <Link href={"/venues/" + venue.id}>{venue.name}</Link>
                  <label className={s.selection}>
                    <input
                      type="radio"
                      name="venue-to-contract"
                      checked={selected?.id === venue.id}
                      onChange={() => setSelectedId(venue.id)}
                      disabled={venue.paused}
                    />
                    {venue.paused ? "휴업 중이라 선택할 수 없어요" : "이 업체로 진행"}
                  </label>
                </th>
              ))}
              {available > 0 && (
                <th scope="col" colSpan={available} className={s.compareVendor}>
                  <Link href="/venues" className={s.addMore}>
                    <span aria-hidden="true">
                      <DiscoveryIcon name="plus" />
                    </span>
                    <div>
                      <strong>업체 더 담기</strong>
                      <br />
                      {available}곳 더 담을 수 있어요
                    </div>
                  </Link>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, value, highlight }) => {
              const different = highlight && new Set(entries.map(value)).size > 1;
              return (
                <tr key={label} data-different={!!different}>
                  <th scope="row">
                    {label} {different && <span className={s.warning}>다름</span>}
                  </th>
                  {entries.map((venue) => (
                    <td key={venue.id}>
                      {label === "연락처" ? (
                        <a className={s.textAction} href={"tel:" + venue.phone}>
                          {value(venue)}
                        </a>
                      ) : (
                        value(venue)
                      )}
                    </td>
                  ))}
                  {available > 0 && <td colSpan={available} />}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={s.spread + " " + s.compareFooter}>
        <Link href="/venues" className={s.button}>
          <DiscoveryIcon name="back" /> 업체 더 보기
        </Link>
        <VenueContractButton venue={selected} className={s.primary} />
      </div>
      <dialog ref={dialog} className={s.dialog} aria-labelledby={titleId}>
        <button className={s.dialogClose} aria-label="닫기" onClick={() => dialog.current?.close()}>
          ×
        </button>
        <span className={s.stateIcon} aria-hidden="true">
          <DiscoveryIcon name="list" size={23} />
        </span>
        <h2 id={titleId}>비교함을 비울까요?</h2>
        <p className={s.muted}>담아 둔 업체가 모두 빠져요.</p>
        <div className={s.actionPair}>
          <button className={s.button} autoFocus onClick={() => dialog.current?.close()}>
            취소
          </button>
          <button
            className={s.primary}
            onClick={() => {
              dialog.current?.close();
              setSelectedId(null);
              clear();
            }}
          >
            전체 해제
          </button>
        </div>
      </dialog>
    </>
  );
}

export function VenueCompare() {
  return (
    <LoginGate kind="venue">
      <BackLink href={PLANNER_ROUTES.step("venue")}>예식장 계약 단계로</BackLink>
      <Comparison />
    </LoginGate>
  );
}
