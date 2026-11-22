import { assets } from "../../assets";
import { FlowIcon } from "../layout/flowUi";
import styles from "./estimateLoading.module.css";

export function EstimateLoading({ restoring = false }: { restoring?: boolean }) {
  return (
    <main className={styles.loadingPage}>
      <div className={styles.panel} role="status" aria-live="polite">
        <span className={styles.loadingIcon}>
          <FlowIcon icon={assets.icons.hourglass} />
        </span>
        <h1>{restoring ? "입력 정보를 불러오고 있어요" : "예상 비용을 계산하고 있어요"}</h1>
        {!restoring && <p>잠시만 기다려 주세요</p>}
      </div>
    </main>
  );
}
