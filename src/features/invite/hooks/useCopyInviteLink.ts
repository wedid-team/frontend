"use client";

import { INVITE_LINK_MOCK } from "../../planner/mocks/plannerMock";
import { useToastStore } from "../../planner/stores/plannerStore";

/** P-09 복사 토스트 문구 */
export const INVITE_COPY_TOAST = "초대 링크를 복사했어요. 링크는 7일 동안 열 수 있어요";

/** 초대 링크 복사 + 토스트 (P-06 · P-09). 초대 팝업 · 웨딩 플랜 카드에서 같이 쓴다. */
export function useCopyInviteLink() {
  const showToast = useToastStore((state) => state.showToast);

  return async () => {
    try {
      // TODO: 실제 초대 링크는 BE가 발급 (7일 유효)
      await navigator.clipboard.writeText(`https://${INVITE_LINK_MOCK}`);
    } catch {
      // 클립보드 권한이 없어도 화면 흐름은 그대로 둔다.
    }
    showToast(INVITE_COPY_TOAST);
  };
}
