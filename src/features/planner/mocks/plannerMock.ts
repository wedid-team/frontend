/**
 * MOCK 데이터 — 백엔드 API 연동 전까지 화면 확인용으로만 쓴다.
 * 업체명 · 금액은 피그마 시안의 예시 값이며 실제 데이터가 아니다.
 * 실제 API 규격은 추측하지 않고, 연동할 때 이 파일을 API 호출로 교체한다.
 */
import type {
  Member,
  PlannerDraft,
  PlannerState,
  SdmCombo,
  SdmTier,
  SdmTierOption,
  StepDefinition,
  StepId,
  StepProgress,
  TodoItem,
} from "../types";

export const STEP_DEFINITIONS: StepDefinition[] = [
  {
    id: "agreement",
    order: 1,
    title: "예산 일정 합의, 상견례",
    shortTitle: "예산, 상견례",
    startDday: 365,
    endDday: 300,
    hasAmount: false,
    decisions: ["전체 예산 상한", "예식 시기", "상견례 날짜, 장소"],
    tips: ["양가 의견을 미리 나눠 듣기", "예산은 범위로 먼저 합의하기"],
    costNote: "따로 드는 비용 없음",
  },
  {
    id: "venue",
    order: 2,
    title: "예식장 계약",
    shortTitle: "예식장 계약",
    startDday: 300,
    endDday: 240,
    hasAmount: true,
    decisions: ["예식 날짜, 시간대", "보증 인원", "식사 형태 (뷔페 / 코스)"],
    tips: [
      "보증 인원은 실제 예상보다 보수적으로",
      "계약금 환급 기준 확인",
      "박람회 당일 계약은 서두르지 않기",
    ],
  },
  {
    id: "sdm",
    order: 3,
    title: "스드메 계약",
    shortTitle: "스드메 계약",
    startDday: 240,
    endDday: 180,
    hasAmount: true,
    // SCR-06-D2 · PM 디자인 추가 요청 #3
    decisions: ["촬영 스타일 (스튜디오 · 야외)", "드레스 투어 샵 수", "원본 · 수정본 포함 여부"],
    tips: [
      "추가금(원본 · 드레스 업그레이드 · 헬퍼비) 미리 확인",
      "같은 업체도 대행사마다 가격이 달라요",
      "당일 계약 할인은 서두르지 않기",
    ],
  },
  {
    id: "photoTrip",
    order: 4,
    title: "촬영, 신혼여행 예약",
    shortTitle: "촬영, 신혼여행",
    startDday: 180,
    endDday: 120,
    hasAmount: false,
    decisions: ["본식 스냅 · 영상 여부", "신혼여행지와 일정"],
    tips: ["성수기 항공권은 일찍 확인하기"],
    costNote: "따로 드는 비용 없음",
  },
  {
    id: "invitation",
    order: 5,
    title: "청첩장 전달, 하객 수 확정",
    shortTitle: "청첩장, 하객",
    startDday: 120,
    endDday: 30,
    hasAmount: false,
    decisions: ["청첩장 디자인 · 수량", "최종 하객 수"],
    tips: ["보증 인원 변경 마감일 확인하기"],
    costNote: "따로 드는 비용 없음",
  },
  {
    id: "finalCheck",
    order: 6,
    title: "최종 점검",
    shortTitle: "최종 점검",
    startDday: 30,
    endDday: 0,
    hasAmount: false,
    decisions: ["당일 동선 · 담당자", "잔금 정산 일정"],
    tips: ["업체별 연락처를 한 곳에 모아두기"],
    costNote: "따로 드는 비용 없음",
  },
];

export const STEP_IDS = STEP_DEFINITIONS.map((step) => step.id);

export function getStepDefinition(stepId: StepId): StepDefinition {
  const step = STEP_DEFINITIONS.find((item) => item.id === stepId);
  if (!step) throw new Error(`Unknown step: ${stepId}`);
  return step;
}

export function isStepId(value: string): value is StepId {
  return (STEP_IDS as string[]).includes(value);
}

/** 확인 필요: 스드메 예산대 경계(Q-05)는 아직 예시 값 250 · 350 · 450만 원. 베이직 하한 · 럭셔리 상한은 MOCK. */
export const SDM_TIER_OPTIONS: SdmTierOption[] = [
  { id: "basic", label: "베이직", rangeLabel: "250만원 이하", range: { min: 180, max: 250 } },
  { id: "standard", label: "스탠다드", rangeLabel: "250 ~ 350만원", range: { min: 250, max: 350 } },
  { id: "premium", label: "프리미엄", rangeLabel: "350 ~ 450만원", range: { min: 350, max: 450 } },
  { id: "luxury", label: "럭셔리", rangeLabel: "450만원 이상", range: { min: 450, max: 600 } },
];

/** E-10: 이 지역 스드메 총액 분포의 중간 수준 구간 */
export const DEFAULT_SDM_TIER: SdmTier = "standard";

const STANDARD_COMBOS: SdmCombo[] = [
  {
    typeName: "실속형",
    range: { min: 255, max: 280 },
    items: [
      { category: "스튜디오", vendorName: "모먼트 스튜디오", priceFrom: 95, href: "#" },
      { category: "드레스", vendorName: "아뜰리에 화이트", priceFrom: 110, href: "#" },
      { category: "메이크업", vendorName: "메이크업 담", priceFrom: 50, href: "#" },
    ],
    note: "기본 상품 합산 · 플래너 경유가",
  },
  {
    typeName: "균형형",
    range: { min: 290, max: 320 },
    items: [
      { category: "스튜디오", vendorName: "라벨르 스튜디오", priceFrom: 105, href: "#" },
      { category: "드레스", vendorName: "로브 드 메이", priceFrom: 125, href: "#" },
      { category: "메이크업", vendorName: "헤어앤 메이", priceFrom: 60, href: "#" },
    ],
    note: "기본 상품 합산 · 플래너 경유가",
  },
  {
    typeName: "프리미엄형",
    range: { min: 320, max: 350 },
    items: [
      { category: "스튜디오", vendorName: "아뜰리에 숨", priceFrom: 120, href: "#" },
      { category: "드레스", vendorName: "클레어 드레스", priceFrom: 135, href: "#" },
      { category: "메이크업", vendorName: "블룸 뷰티", priceFrom: 65, href: "#" },
    ],
    note: "기본 상품 합산 · 플래너 경유가",
  },
];

/** MOCK: 스탠다드 외 예산대는 시안이 없어 금액만 옮겨서 보여준다. */
export function getSdmCombos(tier: SdmTier): SdmCombo[] {
  const shift = { basic: -70, standard: 0, premium: 100, luxury: 200 }[tier];
  if (shift === 0) return STANDARD_COMBOS;
  return STANDARD_COMBOS.map((combo) => ({
    ...combo,
    range: { min: combo.range.min + shift, max: combo.range.max + shift },
    items: combo.items.map((item) => ({
      ...item,
      priceFrom: Math.max(10, item.priceFrom + Math.round(shift / 3)),
    })),
  }));
}

/** D-06: 합계와 분리해서 보여주는 추가금 항목 */
export const SDM_EXTRA_COSTS = ["원본 사진 · 수정본", "드레스 업그레이드", "헬퍼비"];

/** E-17 산출 근거 — MOCK. 출처 · 공개 업체 수 · 기준일은 BE 데이터 확정 후 교체 */
export const SDM_BASIS_MOCK = {
  source: "업체 공식 채널 공개 단품가",
  vendorCount: 24,
  baseDate: "2026.11.01",
  note: "대행사(플래너)마다 같은 상품도 가격이 다를 수 있어요.",
};

const VENUE_ESTIMATE = { min: 1550, max: 1900 };

function progress(
  status: StepProgress["status"],
  actualAmount: number | null = null,
): StepProgress {
  return { status, actualAmount, isMarkedOverdue: false };
}

const BASE_TODOS: TodoItem[] = [
  { id: "t1", stepId: "venue", title: "예산 상한 합의하기", assignee: "together", isDone: false },
  { id: "t2", stepId: "venue", title: "후보 예식장 3곳 투어 예약", assignee: "me", isDone: true },
  { id: "t3", stepId: "venue", title: "부모님께 후보 공유", assignee: "partner", isDone: false },
  // SCR-06-D2 기본 할 일 3개 (담당은 MOCK)
  { id: "t4", stepId: "sdm", title: "스드메 예산대 정하기", assignee: "together", isDone: false },
  { id: "t5", stepId: "sdm", title: "스드메 조합 후보 상담 예약", assignee: "me", isDone: false },
  { id: "t6", stepId: "sdm", title: "드레스 투어 일정 잡기", assignee: "partner", isDone: false },
  {
    id: "t7",
    stepId: "agreement",
    title: "예산 범위 합의하기",
    assignee: "together",
    isDone: true,
  },
  { id: "t8", stepId: "agreement", title: "상견례 장소 예약", assignee: "me", isDone: true },
];

export function createBasePlannerState(): PlannerState {
  return {
    conditions: {
      regionLabel: "서울 강남권 외",
      guestLabel: "하객 150~200명",
      moods: ["화사한", "클래식"],
    },
    weddingDate: { kind: "month", year: 2027, month: 10 },
    budget: 3000,
    steps: {
      agreement: progress("complete"),
      venue: progress("inProgress"),
      sdm: progress("upcoming"),
      photoTrip: progress("upcoming"),
      invitation: progress("upcoming"),
      finalCheck: progress("upcoming"),
    },
    stepEstimates: {
      venue: VENUE_ESTIMATE,
      sdm: SDM_TIER_OPTIONS.find((tier) => tier.id === DEFAULT_SDM_TIER)!.range,
    },
    sdmTier: DEFAULT_SDM_TIER,
    todos: BASE_TODOS,
    me: {
      name: "준근",
      fullName: "최준근",
      description: "계획 만든 사람",
      role: "me",
      loginProvider: "kakao",
    },
    partner: {
      name: "민지",
      fullName: "김민지",
      description: "구글로 합류",
      role: "partner",
      loginProvider: "google",
    },
  };
}

/** 첫 방문에서 저장할 때는 기존 로드맵 템플릿의 단계와 할 일만 사용한다. */
export function createNewPlannerState(
  draft: PlannerDraft,
  provider: Member["loginProvider"],
): PlannerState {
  const base = createBasePlannerState();
  return {
    ...base,
    ...draft,
    steps: {
      ...base.steps,
      agreement: progress("inProgress"),
      venue: progress("upcoming"),
    },
    stepEstimates: {
      ...base.stepEstimates,
      sdm: SDM_TIER_OPTIONS.find((option) => option.id === draft.sdmTier)!.range,
    },
    todos: base.todos.map((todo) => ({ ...todo, isDone: false })),
    me: { ...base.me, loginProvider: provider },
    partner: null,
  };
}

/** 화면 확인용 시나리오. /roadmap?demo=complete 처럼 쓴다. */
export const DEMO_SCENARIOS = [
  "default",
  "complete",
  "undecided",
  "noBudget",
  "overdue",
  "venueDone",
  "sdmDone",
  "noPartner",
] as const;

export type DemoScenario = (typeof DEMO_SCENARIOS)[number];

export function isDemoScenario(value: string | null): value is DemoScenario {
  return value !== null && (DEMO_SCENARIOS as readonly string[]).includes(value);
}

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function createDemoPlannerState(scenario: DemoScenario, today: Date): PlannerState {
  const state = createBasePlannerState();

  switch (scenario) {
    case "complete":
      return {
        ...state,
        steps: {
          agreement: progress("complete"),
          venue: progress("complete", 1980),
          sdm: progress("complete", 310),
          photoTrip: progress("complete"),
          invitation: progress("complete"),
          finalCheck: progress("complete"),
        },
      };
    case "undecided":
      return { ...state, weddingDate: { kind: "undecided" } };
    case "noBudget":
      return { ...state, budget: null };
    case "overdue":
      return {
        ...state,
        weddingDate: { kind: "exact", date: toIsoDate(addDays(today, 90)) },
        steps: { ...state.steps, venue: progress("upcoming") },
      };
    case "venueDone":
      return {
        ...state,
        steps: { ...state.steps, venue: progress("complete", 1980), sdm: progress("inProgress") },
      };
    case "sdmDone":
      return {
        ...state,
        steps: {
          ...state.steps,
          venue: progress("complete", 1980),
          sdm: progress("complete", 310),
        },
      };
    case "noPartner":
      return { ...state, partner: null };
    default:
      return state;
  }
}

/** 초대 링크 — MOCK. 실제로는 BE가 발급한다. */
export const INVITE_LINK_MOCK = "wedid.app/invite/a8f3k2";

/** SCR-11-B: 초대받은 사람에게 이미 계획(계정 또는 비회원 임시)이 있는지 — MOCK. 실제는 BE · 브라우저 보관값으로 판단 */
export const INVITEE_HAS_PLAN_MOCK = true;

/** 초대 합류 화면에서 보여주는 계획 요약 — MOCK */
export const INVITE_PLAN_SUMMARY_MOCK = {
  inviterName: "준근",
  planTitle: "서울 강남권 외 · 2027년 10월",
  estimate: { min: 1800, max: 2250 },
  nextTodo: "예식장 계약 · 예식 D-334",
  openTodos: "2개 (짝꿍 담당 1개)",
};
