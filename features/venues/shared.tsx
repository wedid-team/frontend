"use client";

import { useUtAuthStore } from "@/src/stores/utAuthStore";
import Image from "next/image";
import Link from "next/link";
import { useId, type ReactNode } from "react";
import { PLANNER_ROUTES } from "@/src/features/planner/routes";
import { compareLimit, useDiscovery } from "./useDiscovery";
import { venueImage } from "./venueData";
import styles from "./discovery.module.css";

export const discoveryStyles = styles;

// The numbered assets are the original Figma exports in public/images/icons.
const iconFiles = {
  list: 36,
  grid: 19,
  pin: 10,
  dress: 21,
  makeup: 28,
  back: 20,
  heart: 14,
  plus: 4,
  check: 17,
  info: 18,
  chat: 9,
  chatWhite: 5,
  parking: 35,
  mood: 7,
  note: 6,
  copy: 50,
  share: 37,
  close: 44,
  closeWhite: 2,
  external: 15,
  home: 26,
  roadmap: 25,
  budget: 39,
  camera: 75,
  venue: 77,
  profile: 78,
  flag: 83,
  members: 84,
  mail: 89,
  checkWhite: 79,
};

export type DiscoveryIconName = keyof typeof iconFiles;

export function DiscoveryIcon({ name, size = 16 }: { name: DiscoveryIconName; size?: number }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      src={"/images/icons/h2d-svg-use-0-" + iconFiles[name] + ".svg"}
    />
  );
}

export function VenuePhoto({
  photo,
  name,
  className,
  priority = false,
}: {
  photo: string;
  name: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={className ?? styles.photo}>
      <Image
        src={venueImage(photo)}
        alt={name}
        fill
        sizes="(max-width: 760px) 100vw, 76vw"
        preload={priority}
      />
    </div>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={styles.back}>
      <DiscoveryIcon name="back" />
      {children}
    </Link>
  );
}

export function PageHeading({
  step,
  title,
  description,
  budget,
}: {
  step: string;
  title: string;
  description: string;
  budget: string;
}) {
  return (
    <header className={styles.heading}>
      <div>
        <p className={styles.eyebrow}>{step}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className={styles.budget}>
        <span>이번 단계 예산</span>
        <strong>{budget}</strong>
      </div>
    </header>
  );
}

export function StateCard({
  icon,
  title,
  text,
  children,
  compact = false,
}: {
  icon: DiscoveryIconName;
  title: string;
  text: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={styles.empty + (compact ? " " + styles.compact : "")}>
      <span className={styles.stateIcon} aria-hidden="true">
        <DiscoveryIcon name={icon} size={23} />
      </span>
      <h1>{title}</h1>
      <p>{text}</p>
      {children}
    </section>
  );
}

export function LoginGate({ kind, children }: { kind: "venue" | "sdm"; children: ReactNode }) {
  const signedIn = useUtAuthStore((state) => state.provider !== null);
  const signIn = useUtAuthStore((state) => state.signIn);
  if (signedIn) return children;
  const isVenue = kind === "venue";
  return (
    <>
      <BackLink href={PLANNER_ROUTES.step(kind)}>
        {isVenue ? "예식장" : "스드메"} 계약 단계로
      </BackLink>
      <StateCard
        icon={isVenue ? "pin" : "dress"}
        title={
          isVenue
            ? "로그인하면 예식장 후보를 볼 수 있어요"
            : "로그인하면 스드메 후보를 볼 수 있어요"
        }
        text={
          isVenue
            ? "내 조건(지역 · 하객 수 · 예산 · 분위기)에 맞춰 공개 가격과 함께 정리해 드려요."
            : "선택한 예산대 안의 스튜디오 · 드레스 · 메이크업 조합을 공개 단품가로 비교해 드려요."
        }
      >
        <button
          className={styles.primary}
          onClick={() => signIn()}
          title="로컬 미리보기 로그인"
        >
          로그인하고 보기
        </button>
      </StateCard>
    </>
  );
}

export function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className={styles.toggle}>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span aria-hidden="true" />
      {children}
    </label>
  );
}

export function FavoriteButton({ id, expanded = false }: { id: string; expanded?: boolean }) {
  const active = useDiscovery((state) => state.favorites.includes(id));
  const toggle = useDiscovery((state) => state.toggleFavorite);
  return (
    <button
      type="button"
      className={expanded ? styles.button : styles.round}
      aria-label={active ? "관심 저장 해제" : "관심 저장"}
      aria-pressed={active}
      onClick={() => toggle(id)}
    >
      <span aria-hidden="true">{active ? "♥" : <DiscoveryIcon name="heart" />}</span>
      {expanded && (active ? " 저장됨" : " 관심 저장")}
    </button>
  );
}

export function CompareButton({ id, detail = false }: { id: string; detail?: boolean }) {
  const compared = useDiscovery((state) => state.compared);
  const toggle = useDiscovery((state) => state.toggleCompare);
  const hint = useId();
  const active = compared.includes(id);
  const full = compared.length >= compareLimit && !active;
  return (
    <>
      <button
        type="button"
        className={styles.button}
        aria-pressed={active}
        disabled={full}
        aria-describedby={full ? hint : undefined}
        onClick={() => toggle(id)}
      >
        <span aria-hidden="true">
          {active ? <DiscoveryIcon name="check" /> : detail ? <DiscoveryIcon name="plus" /> : "▢"}
        </span>{" "}
        {active ? "비교 담김" : "비교 담기"}
      </button>
      {full && (
        <span id={hint} className={styles.srOnly}>
          비교함에는 최대 3곳까지 담을 수 있어요.
        </span>
      )}
    </>
  );
}

export function OfficialLink({ url }: { url?: string }) {
  return url ? (
    <a className={styles.textAction} href={url} target="_blank" rel="noreferrer">
      공식 채널 보기 <DiscoveryIcon name="external" size={13} />
    </a>
  ) : (
    <span className={styles.muted} title="공식 채널 주소 미제공">
      공식 채널 정보 없음
    </span>
  );
}
