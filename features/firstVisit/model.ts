export type FlowScreen = "home" | "region" | "timing" | "mood" | "loading" | "result" | "roadmap";
export const weddingPlanPath = "/wedding-plan";

export function firstVisitHref(screen: FlowScreen) {
  return screen === "home" ? "/" : `/?screen=${screen}`;
}

export type EstimateTier = "basic" | "standard" | "premium" | "luxury";
export type WeddingAnswers = {
  region: string;
  guests: string;
  timing: "date" | "month" | "unknown";
  date: string;
  year: string;
  month: string;
  budget: string;
  budgetUnknown: boolean;
  moods: string[];
};

export const initialAnswers: WeddingAnswers = {
  region: "",
  guests: "",
  timing: "unknown",
  date: "",
  year: "",
  month: "",
  budget: "",
  budgetUnknown: true,
  moods: [],
};

export const unknownGuestCount = "아직 모르겠어요";
export const assumedGuestRange = "150~200명";

// 화면 예시용 선택 데이터. 실제 API의 지역 코드나 통계 구간을 정의하지 않는다.
export const regionOptions = [
  "서울 강남권",
  "서울 강남권 외",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "강원",
  "충청",
  "전라",
  "경상",
  "제주",
].map((label) => ({ label, value: label }));
export const guestOptions = [
  "100명 미만",
  "100~150명",
  assumedGuestRange,
  "200~250명",
  "250~300명",
  "300명 이상",
  unknownGuestCount,
].map((label) => ({ label, value: label }));
export const moodOptions = ["화사한", "웅장한", "클래식", "그리너리", "럭셔리", "상관없어요"].map(
  (label) => ({ label, value: label }),
);
export const timingOptions = [
  { label: "날짜가 정해졌어요", value: "date" },
  { label: "대략적인 달만 정했어요", value: "month" },
  { label: "아직 정하지 않았어요", value: "unknown" },
];

export function selectMoods(previous: string[], next: string[]) {
  if (next.includes("상관없어요") && !previous.includes("상관없어요")) return ["상관없어요"];
  return next.filter((value) => value !== "상관없어요");
}

export function hasRegionAnswers(answers: WeddingAnswers) {
  return (
    regionOptions.some(({ value }) => value === answers.region) &&
    guestOptions.some(({ value }) => value === answers.guests)
  );
}

const minimumBudget = 100;
const maximumBudgetDigits = 9;

export function isValidBudget(value: string) {
  return (
    /^\d+$/.test(value) && value.length <= maximumBudgetDigits && Number(value) >= minimumBudget
  );
}

function budgetInputDigits(value: string) {
  const trimmed = value.trim();
  return /^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(trimmed) ? trimmed.replaceAll(",", "") : null;
}

export function parseBudgetInput(value: string): { amount: string | null; error?: string } {
  if (value === "") return { amount: null };
  const digits = budgetInputDigits(value);
  if (digits === null) {
    return { amount: null, error: "숫자 또는 올바른 천 단위 쉼표로 입력해 주세요" };
  }
  if (digits.length > maximumBudgetDigits) {
    return { amount: null, error: `금액은 ${maximumBudgetDigits}자리까지 입력해 주세요` };
  }
  if (!isValidBudget(digits)) {
    return { amount: null, error: `${minimumBudget}만 원 이상으로 입력해 주세요` };
  }
  return { amount: String(Number(digits)) };
}

export function formatBudgetAmount(amount: string) {
  return isValidBudget(amount) ? Number(amount).toLocaleString("ko-KR") : amount;
}

export function increaseBudgetInput(value: string, increment: number) {
  const digits = value === "" ? "0" : budgetInputDigits(value);
  if (digits === null || digits.length > maximumBudgetDigits) return value;
  return formatBudgetAmount(String(Number(digits) + increment));
}

export function hasTimingAnswers(answers: WeddingAnswers) {
  let validTiming = answers.timing === "unknown";
  if (answers.timing === "date") {
    const parsed = new Date(`${answers.date}T12:00:00`);
    validTiming =
      /^\d{4}-\d{2}-\d{2}$/.test(answers.date) &&
      !Number.isNaN(parsed.getTime()) &&
      parsed.getFullYear() === Number(answers.date.slice(0, 4)) &&
      parsed.getMonth() + 1 === Number(answers.date.slice(5, 7)) &&
      parsed.getDate() === Number(answers.date.slice(8, 10));
  }
  if (answers.timing === "month")
    validTiming =
      /^\d{4}$/.test(answers.year) &&
      Number(answers.year) >= 2026 &&
      Number(answers.year) <= 2100 &&
      /^(?:0?[1-9]|1[0-2])$/.test(answers.month);
  return validTiming && (answers.budgetUnknown || isValidBudget(answers.budget));
}

export function timingLabel(answers: WeddingAnswers) {
  if (answers.timing === "date" && answers.date)
    return answers.date
      .split("-")
      .map((value, index) => `${Number(value)}${["년", "월", "일"][index]}`)
      .join(" ");
  if (answers.timing === "month" && answers.year && answers.month)
    return `${answers.year}년 ${Number(answers.month)}월`;
  return "시기 미정";
}

export function budgetLabel(answers: WeddingAnswers) {
  return answers.budgetUnknown || !answers.budget
    ? "예산 미정"
    : `${formatBudgetAmount(answers.budget)}만 원`;
}

export function conditionLabel(answers: WeddingAnswers) {
  return [
    answers.region || "지역 미정",
    answers.guests === unknownGuestCount
      ? `하객 수 미정 (${assumedGuestRange} 기준)`
      : answers.guests
        ? `하객 ${answers.guests}`
        : "하객 미정",
    timingLabel(answers),
    answers.moods.length ? answers.moods.join(" · ") : "분위기 상관없음",
  ].join(" · ");
}

/** 저장소/공유 URL은 신뢰하지 않고 허용된 값만 복원한다. */
export function sanitizeAnswers(value: unknown): WeddingAnswers {
  if (!value || typeof value !== "object") return { ...initialAnswers, moods: [] };
  const raw = value as Record<string, unknown>;
  const string = (key: string) =>
    typeof raw[key] === "string" ? (raw[key] as string).slice(0, 80) : "";
  const moods = Array.isArray(raw.moods)
    ? [
        ...new Set(
          raw.moods.filter(
            (item): item is string =>
              typeof item === "string" && moodOptions.some(({ value }) => value === item),
          ),
        ),
      ]
    : [];
  return {
    region: regionOptions.some(({ value }) => value === raw.region) ? string("region") : "",
    guests: guestOptions.some(({ value }) => value === raw.guests) ? string("guests") : "",
    timing: raw.timing === "date" || raw.timing === "month" ? raw.timing : "unknown",
    date: string("date"),
    year: string("year"),
    month: string("month"),
    budget: typeof raw.budget === "string" ? (parseBudgetInput(raw.budget).amount ?? "") : "",
    budgetUnknown: raw.budgetUnknown !== false,
    moods: moods.includes("상관없어요") ? ["상관없어요"] : moods,
  };
}

export function weddingDate(answers: WeddingAnswers): Date | null {
  if (!hasTimingAnswers({ ...answers, budgetUnknown: true }) || answers.timing === "unknown")
    return null;
  const date =
    answers.timing === "date"
      ? answers.date
      : `${answers.year}-${answers.month.padStart(2, "0")}-01`;
  return new Date(`${date}T12:00:00`);
}

export function daysUntilWedding(answers: WeddingAnswers, today: Date) {
  const date = weddingDate(answers);
  if (!date) return null;
  return Math.round(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) /
      86400000,
  );
}

export function isTier(value: unknown): value is EstimateTier {
  return ["basic", "standard", "premium", "luxury"].includes(String(value));
}
