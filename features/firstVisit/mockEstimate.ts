import type { EstimateTier, WeddingAnswers } from "./model";

const mockVenue = { min: 1550, max: 1900 };

export function formatMockRange({ min, max }: { min: number; max: number }) {
  return `${min.toLocaleString("ko-KR")}만 ~ ${max.toLocaleString("ko-KR")}만원`;
}

/** Figma 예시용 고정 데이터. 지역/인원에 따른 실제 견적 계산이 아니다. */
const mockTiers = {
  basic: {
    label: "베이직",
    amountRange: "250만원 이하",
    stylingRange: "180만 ~ 250만원",
    totalRange: "1,730만 ~ 2,150만원",
    totalMax: 2150,
  },
  standard: {
    label: "스탠다드",
    amountRange: "250 ~ 350만원",
    stylingRange: "250만 ~ 350만원",
    totalRange: "1,800만 ~ 2,250만원",
    totalMax: 2250,
  },
  premium: {
    label: "프리미엄",
    amountRange: "350 ~ 450만원",
    stylingRange: "350만 ~ 450만원",
    totalRange: "1,900만 ~ 2,350만원",
    totalMax: 2350,
  },
  luxury: {
    label: "럭셔리",
    amountRange: "450만원 이상",
    stylingRange: "450만 ~ 600만원",
    totalRange: "2,000만 ~ 2,500만원",
    totalMax: 2500,
  },
} as const;

export const tierOptions = Object.entries(mockTiers).map(([value, tier]) => ({
  value,
  label: tier.label,
  amountRange: tier.amountRange,
  recommended: value === "standard",
}));
const mockStylingItems = [
  { label: "스튜디오", min: 95, max: 120 },
  { label: "드레스", min: 110, max: 135 },
  { label: "메이크업", min: 50, max: 65 },
] as const;

const mockStylingBreakdown = {
  items: mockStylingItems,
  total: mockStylingItems.reduce(
    (total, item) => ({ min: total.min + item.min, max: total.max + item.max }),
    { min: 0, max: 0 },
  ),
};
export const mockCombinations = [
  {
    label: "실속형",
    range: "255만 ~ 280만원",
    items: [
      ["스튜디오", "모먼트 스튜디오", "95만~"],
      ["드레스", "아뜰리에 화이트", "110만~"],
      ["메이크업", "메이크업 담", "50만~"],
    ],
  },
  {
    label: "균형형",
    range: "290만 ~ 320만원",
    items: [
      ["스튜디오", "라벨르 스튜디오", "105만~"],
      ["드레스", "로브 드 메이", "125만~"],
      ["메이크업", "헤어앤 메이", "60만~"],
    ],
  },
  {
    label: "프리미엄형",
    range: "320만 ~ 350만원",
    items: [
      ["스튜디오", "아뜰리에 숨", "120만~"],
      ["드레스", "클레어 드레스", "135만~"],
      ["메이크업", "블룸 뷰티", "65만~"],
    ],
  },
] as const;

export function getMockEstimate(answers: WeddingAnswers, tier: EstimateTier) {
  return {
    isMock: true as const,
    conditions: answers,
    tier,
    ...mockTiers[tier],
    venueRange: formatMockRange(mockVenue),
    stylingBreakdown: tier === "standard" ? mockStylingBreakdown : null,
    // 실제 비용 계산이 아닌, 위 고정 예시 금액의 구성 비율 표시용 데이터다.
    venueShare: (mockVenue.max / mockTiers[tier].totalMax) * 100,
  };
}

/** API 교체 지점. 로딩 화면을 위한 Mock 대기만 수행한다. */
export function loadMockEstimate(answers: WeddingAnswers, tier: EstimateTier, signal: AbortSignal) {
  return new Promise<ReturnType<typeof getMockEstimate>>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const cancel = () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", cancel);
      resolve(getMockEstimate(answers, tier));
    }, 900);
    signal.addEventListener("abort", cancel, { once: true });
  });
}
