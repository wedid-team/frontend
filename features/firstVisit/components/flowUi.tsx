import Image from "next/image";
import { assets, type IconAsset } from "../assets";
import type { FlowScreen } from "../model";
import styles from "./flowUi.module.css";

export type FlowActions = { navigate: (screen: FlowScreen) => void; openLogin: () => void };

export function FlowIcon({ icon, className }: { icon: IconAsset; className?: string }) {
  return (
    <Image
      src={icon.src}
      alt=""
      width={icon.width}
      height={icon.height}
      className={className}
      unoptimized
    />
  );
}

export function Brand({ onClick, large = false }: { onClick: () => void; large?: boolean }) {
  return (
    <button className={styles.brand} onClick={onClick} aria-label="WEDID 홈">
      <Image
        src={assets.images.wordmark}
        alt="WEDID"
        width={large ? 124 : 105}
        height={large ? 26 : 22}
        unoptimized
      />
    </button>
  );
}

export function MockNotice() {
  return (
    <p className={styles.mockNotice}>
      현재 금액·업체·일정은 Figma 기반 Mock 예시입니다. 입력 조건별 실제 견적을 계산하거나 조회한
      결과가 아닙니다.
    </p>
  );
}
