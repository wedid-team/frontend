"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BackLink,
  CompareButton,
  DiscoveryIcon,
  FavoriteButton,
  LoginGate,
  VenuePhoto,
  discoveryStyles as s,
  type DiscoveryIconName,
} from "../shared";
import { moods, venues, type Venue } from "../venueData";
import { useDiscovery } from "../useDiscovery";

function VenueInformation({ venue }: { venue: Venue }) {
  const router = useRouter();
  const chooseVenue = useDiscovery((state) => state.chooseVenue);
  const count = useDiscovery((state) => state.compared.length);
  const [feedback, setFeedback] = useState("");
  const related = venues.filter(
    (other) => other.id !== venue.id && other.mood === venue.mood && !other.paused,
  );
  const facts: [DiscoveryIconName, string, string][] = [
    ["pin", "주소", venue.address],
    ["chat", "연락처", venue.phone],
    [venue.paused ? "info" : "check", "운영 여부", venue.paused ? "휴업" : "운영 중"],
    ["list", "식사 형태", venue.meal],
    ["parking", "주차", venue.parking ? "가능" : "불가"],
    ["mood", "분위기", venue.mood],
    ["note", "비고", venue.note],
  ];

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setFeedback(label + " 복사했어요.");
    } catch {
      setFeedback(label + " 복사하지 못했어요.");
    }
  }

  return (
    <>
      <BackLink href="/venues">예식장 후보로</BackLink>
      <div className={s.heroWrap}>
        <VenuePhoto
          className={s.hero}
          photo={venue.hero ?? venue.id}
          name={venue.name + " 홀 사진"}
          priority
        />
        <div className={s.heroTags}>
          <span className={s.pill}>{venue.mood}</span>
          {venue.paused && <span className={s.warning}>휴업</span>}
        </div>
      </div>
      <div className={s.detail}>
        <div>
          <header className={s.detailHeading}>
            <p className={s.eyebrow}>2단계 · 예식장 계약 · 업체 정보</p>
            <div className={s.actions}>
              <h1>{venue.name}</h1>
              <span className={venue.paused ? s.muted : s.pill}>
                ● {venue.paused ? "휴업" : "운영 중"}
              </span>
            </div>
            <p className={s.muted}>
              서울 {venue.district} · {venue.mood} 분위기 · {venue.meal} · 주차{" "}
              {venue.parking ? "가능" : "불가"}
            </p>
          </header>
          <dl className={s.facts}>
            {facts.map(([icon, label, value]) => (
              <div
                key={label}
                className={s.fact}
                data-wide={["주소", "분위기", "비고"].includes(label)}
              >
                <span className={s.stateIcon} aria-hidden="true">
                  <DiscoveryIcon name={icon} />
                </span>
                <div>
                  <dt>{label}</dt>
                  <dd>
                    {label === "연락처" ? <a href={"tel:" + venue.phone}>{value}</a> : value}
                    {label === "분위기" && <span className={s.muted}> · {venue.moodDetail}</span>}
                  </dd>
                  {label === "분위기" && (
                    <div className={s.actions + " " + s.moodTags}>
                      {moods.map((mood) => (
                        <span key={mood} className={mood === venue.mood ? s.publicBadge : s.pill}>
                          {mood}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {label === "주소" && (
                  <button className={s.button} onClick={() => void copy(venue.address, "주소를")}>
                    <DiscoveryIcon name="copy" /> 복사
                  </button>
                )}
              </div>
            ))}
          </dl>
        </div>
        <aside>
          <div className={s.detailActions}>
            <h2>이 업체가 마음에 드나요?</h2>
            <p className={s.muted}>
              비교함에 담아 다른 곳과 비교하거나, 계약할 업체로 정할 수 있어요.
            </p>
            <a className={s.primary} href={"tel:" + venue.phone}>
              <DiscoveryIcon name="chatWhite" /> 전화 문의 {venue.phone}
            </a>
            <CompareButton id={venue.id} detail />
            {count > 0 && (
              <Link className={s.textAction} href="/venues/compare">
                비교하기 ({count}/3)
              </Link>
            )}
            <div className={s.actionPair}>
              <FavoriteButton id={venue.id} expanded />
              <button
                className={s.button}
                onClick={() => void copy(window.location.href, "공유 링크를")}
              >
                <DiscoveryIcon name="share" /> 공유
              </button>
            </div>
            <hr />
            <button
              className={s.softButton}
              disabled={venue.paused}
              onClick={() => {
                chooseVenue(venue.id);
                router.push("/roadmap?stage=venue");
              }}
            >
              {venue.paused ? "휴업 중이라 선택할 수 없어요" : "이 업체로 계약 진행하기"}
            </button>
            {feedback && (
              <p className={s.muted} role="status">
                {feedback}
              </p>
            )}
          </div>
          <p className={s.detailNote}>
            시안의 예시 정보예요. 실제 방문 전 업체의 최신 운영 여부를 확인해 주세요.
          </p>
        </aside>
      </div>
      {!!related.length && (
        <section className={s.related}>
          <h2>비슷한 예식장</h2>
          <div className={s.relatedGrid}>
            {related.map((other) => (
              <Link className={s.relatedCard} key={other.id} href={"/venues/" + other.id}>
                <VenuePhoto photo={other.related ?? other.id} name={other.name + " 홀 사진"} />
                <div>
                  <p className={s.muted}>
                    {other.mood} · 서울 {other.district}
                  </p>
                  <strong>{other.name}</strong>
                  <p className={s.muted}>
                    {other.meal} · 주차 {other.parking ? "가능" : "불가"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export function VenueDetail({ venue }: { venue: Venue }) {
  return (
    <LoginGate kind="venue">
      <VenueInformation venue={venue} />
    </LoginGate>
  );
}
