export type InviteStatus = "valid" | "expired" | "connected";

/** MOCK: 토큰이 "expired"면 만료, "connected"면 이미 연결됨. 실제 판정은 BE 응답(P-08)으로 교체. */
export function getInviteStatusMock(token: string): InviteStatus {
  if (token === "expired") return "expired";
  if (token === "connected") return "connected";
  return "valid";
}
