/** B파트(로드맵 · 단계 · 초대 · 내 정보) 화면에서 쓰는 타입. API 명세가 나오면 맞춰서 수정한다. */

export type StepId = "agreement" | "venue" | "sdm" | "photoTrip" | "invitation" | "finalCheck";

export type StepStatus = "upcoming" | "inProgress" | "complete";

export type Assignee = "me" | "partner" | "together";

export type ManwonRange = {
  /** 만 원 단위 */
  min: number;
  /** 만 원 단위 */
  max: number;
};

export type TodoItem = {
  id: string;
  stepId: StepId;
  /** R-09: 최대 40자 */
  title: string;
  assignee: Assignee;
  isDone: boolean;
};

export type StepDefinition = {
  id: StepId;
  order: number;
  title: string;
  /** "전체 일정" 막대에 쓰는 짧은 이름 */
  shortTitle: string;
  /** 권장 시기 시작 (D-n) */
  startDday: number;
  /** 권장 시기 끝 (D-n) */
  endDday: number;
  /** 실제 금액을 넣어야 완료되는 단계 (R-09: 예식장 · 스드메) */
  hasAmount: boolean;
  /** 단계 상세 오른쪽 "정해야 할 것" */
  decisions: string[];
  /** 단계 상세 오른쪽 "알아두면 좋은 점" */
  tips: string[];
  /** 지난 단계 팝업에 쓰는 비용 안내 (금액 단계가 아니면 "따로 드는 비용 없음") */
  costNote?: string;
};

export type StepProgress = {
  status: StepStatus;
  /** 실제 계약 금액 (만 원). 완료를 취소해도 지우지 않는다. */
  actualAmount: number | null;
  /** R-07: [아직 안 했어요]를 누른 지난 단계 */
  isMarkedOverdue: boolean;
};

export type SdmTier = "basic" | "standard" | "premium" | "luxury";

export type SdmTierOption = {
  id: SdmTier;
  label: string;
  rangeLabel: string;
  range: ManwonRange;
};

export type SdmCombo = {
  /** 조합 유형명만 허용 (실속형 / 균형형 / 프리미엄형) */
  typeName: string;
  range: ManwonRange;
  items: Array<{ category: string; vendorName: string; priceFrom: number; href: string }>;
  note: string;
};

export type WeddingDate =
  | { kind: "exact"; date: string }
  | { kind: "month"; year: number; month: number }
  | { kind: "undecided" };

export type Member = {
  /** 화면 호칭 (예: "준근") */
  name: string;
  /** 소셜 로그인 프로필 이름 (C-06) */
  fullName: string;
  /** "계획 만든 사람" / "구글로 합류" 등 */
  description: string;
  role: "me" | "partner";
  loginProvider: "kakao" | "google";
};

export type PlanConditions = {
  regionLabel: string;
  guestLabel: string | null;
  moods: string[];
};

export type PlannerState = {
  conditions: PlanConditions;
  weddingDate: WeddingDate;
  /** 설정한 예산 (만 원). 미입력이면 null (E-05) */
  budget: number | null;
  steps: Record<StepId, StepProgress>;
  stepEstimates: Partial<Record<StepId, ManwonRange>>;
  sdmTier: SdmTier;
  todos: TodoItem[];
  me: Member;
  partner: Member | null;
};

export type PlannerDraft = Pick<PlannerState, "conditions" | "weddingDate" | "budget" | "sdmTier">;
