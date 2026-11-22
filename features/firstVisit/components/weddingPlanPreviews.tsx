import Image from "next/image";
import { assets } from "../assets";
import { FlowIcon } from "./flowUi";
import styles from "./weddingPlanIntro.module.css";

const tasks = [
  ["후보 예식장 3곳 투어 예약", "투어 예약 3곳", "나"],
  ["예산 상한 합의하기", "예산 상한 합의", "함께"],
  ["부모님께 후보 공유", "부모님께 공유", "짝꿍"],
] as const;

function Avatars() {
  return (
    <div className={styles.avatars}>
      <Image src={assets.images.avatar} width={28} height={28} alt="" unoptimized />
      <Image src={assets.images.avatar} width={28} height={28} alt="" unoptimized />
    </div>
  );
}

function TaskPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className={styles.taskPreview}>
      <header>
        <strong>이번 주 할 일</strong>
        <Avatars />
      </header>
      <ul>
        {tasks.map(([task, shortTask, owner]) => (
          <li key={task}>
            <i className={styles.taskMarker} data-current={owner === "나"} />
            <span>{compact ? shortTask : task}</span>
            <small data-current={owner === "나"}>{owner}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CostPreview({ dashboard = false }: { dashboard?: boolean }) {
  return (
    <div className={dashboard ? styles.dashboardTotal : styles.totalPreview}>
      <div>
        <span>예상 총 비용</span>
        {dashboard && <small>서울 강남권 외 · 200명</small>}
      </div>
      <strong>1,800만 ~ 2,250만원</strong>
      {dashboard && (
        <div className={styles.previewBar}>
          <i />
        </div>
      )}
    </div>
  );
}

export function DashboardPreview() {
  const nav = [
    ["홈", assets.introIcons.home],
    ["준비 로드맵", assets.introIcons.roadmap],
    ["예상 비용", assets.introIcons.cost],
    ["예식장 찾기", assets.introIcons.venue],
    ["함께하는 멤버", assets.introIcons.members],
  ] as const;
  return (
    <figure className={styles.dashboard} aria-label="예상 비용과 준비 로드맵 화면 예시">
      <div className={styles.dashboardInner}>
        <div className={styles.demoNav}>
          <Image src={assets.images.wordmark} width={86} height={18} alt="WEDID" unoptimized />
          <ul>
            {nav.map(([label, icon]) => (
              <li key={label} data-selected={label === "예상 비용"}>
                <FlowIcon icon={icon} />
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.dashboardCosts}>
          <CostPreview dashboard />
          <dl className={styles.costTiles}>
            <div>
              <dt>예식장</dt>
              <dd>1,550만~</dd>
            </div>
            <div>
              <dt>스드메</dt>
              <dd>250만~</dd>
            </div>
          </dl>
          <div className={styles.progressTile}>
            <div>
              <strong>전체 진행률</strong>
              <b>45%</b>
            </div>
            <div className={styles.previewBar}>
              <i />
            </div>
          </div>
        </div>
        <div className={styles.dashboardTasks}>
          <TaskPreview compact />
          <Image
            className={styles.venuePhoto}
            src={assets.images.brightVenue}
            width={260}
            height={126}
            alt=""
            unoptimized
          />
        </div>
      </div>
    </figure>
  );
}

export function CostFeaturePreview() {
  return (
    <figure className={styles.featureGraphic} aria-label="예상 비용과 예산대 예시">
      <div className={styles.costFeature}>
        <CostPreview />
        <dl className={styles.costTiles}>
          <div>
            <dt>베이직</dt>
            <dd>250만원 이하</dd>
          </div>
          <div data-selected="true">
            <dt>
              스탠다드 <small>추천</small>
            </dt>
            <dd>250 ~ 350만원</dd>
          </div>
        </dl>
      </div>
      <div className={styles.budgetBadge}>
        <span>
          <FlowIcon icon={assets.introIcons.featureCheck} />
        </span>
        <span>
          예산 대비<strong>750만원 여유</strong>
        </span>
      </div>
    </figure>
  );
}

export function RoadmapFeaturePreview() {
  const steps = [
    ["예산 일정 합의, 상견례", "D-365~300 · 완료", "완료"],
    ["예식장 계약", "D-300~240 · 1,550만 ~ 1,900만원", "진행 중"],
    ["스드메 계약", "D-240~180", "예정"],
  ] as const;
  return (
    <figure
      className={`${styles.featureGraphic} ${styles.roadmapGraphic}`}
      aria-label="결혼 준비 로드맵 예시"
    >
      <ol className={styles.roadmapCard}>
        {steps.map(([label, description, status], index) => (
          <li key={label} data-status={status}>
            <span className={styles.roadmapMarker}>
              {status === "완료" ? <FlowIcon icon={assets.icons.completed} /> : index + 1}
            </span>
            <div>
              <strong>{label}</strong>
              <p>{description}</p>
            </div>
            <small>{status}</small>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function PartnerFeaturePreview() {
  return (
    <figure className={styles.featureGraphic} aria-label="짝꿍과 나누는 할 일 예시">
      <div className={styles.partnerCard}>
        <TaskPreview />
      </div>
      <div className={styles.partnerNotice}>
        <Image src={assets.images.avatar} width={32} height={32} alt="" unoptimized />
        <span>
          <strong>짝꿍이 체크했어요</strong>투어 예약 완료
        </span>
      </div>
    </figure>
  );
}
