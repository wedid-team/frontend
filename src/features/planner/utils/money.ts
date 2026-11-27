import type { ManwonRange } from "../types";

/**
 * D-03 금액 표기: 만 원 단위 · 천 단위 콤마 · 1억 이상은 "1억 2,000만".
 * 반환값에는 "원"을 붙이지 않는다. (예: 1550 → "1,550만", 12000 → "1억 2,000만")
 */
export function formatManwon(amount: number): string {
  if (amount === 0) return "0";
  const eok = Math.floor(amount / 10000);
  const rest = amount % 10000;
  if (eok === 0) return `${rest.toLocaleString("ko-KR")}만`;
  if (rest === 0) return `${eok}억`;
  return `${eok}억 ${rest.toLocaleString("ko-KR")}만`;
}

/** 단일 금액: 3000 → "3,000만 원", 0 → "0원" */
export function formatWon(amount: number): string {
  if (amount === 0) return "0원";
  return `${formatManwon(amount)} 원`;
}

/** 범위 금액 (D-03): "1,900만 ~ 2,100만 원" */
export function formatRange(range: ManwonRange): string {
  return `${formatManwon(range.min)} ~ ${formatManwon(range.max)} 원`;
}

/** 입력창 표시용: 1550 → "1,550" */
export function formatAmountInput(amount: number | null): string {
  return amount === null ? "" : amount.toLocaleString("ko-KR");
}

/** 입력창 값 → 만 원 숫자. 숫자가 없으면 null */
export function parseAmountInput(value: string): number | null {
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) return null;
  return Number(digits);
}

/** E-06: 예산 입력 규칙 — 최소 100만 원 · 최대 99,999만 원 */
export const BUDGET_MIN = 100;
export const BUDGET_MAX = 99999;

export function validateBudget(amount: number | null): string | null {
  if (amount === null) return "예산을 입력해 주세요.";
  if (amount < BUDGET_MIN) return "예산은 100만 원 이상으로 입력해 주세요.";
  if (amount > BUDGET_MAX) return "예산은 99,999만 원까지 입력할 수 있어요.";
  return null;
}
