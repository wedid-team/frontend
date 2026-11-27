"use client";

import { useState, useSyncExternalStore } from "react";
import { PLANNER_ROUTES } from "../../planner/routes";

// 서버에서 토큰을 발급하기 전까지 기존 초대 미리보기 토큰을 사용한다.
export const invitePath = PLANNER_ROUTES.invite("a8f3k2");

const subscribe = () => () => {};
const getBrowserInviteUrl = () => new URL(invitePath, window.location.origin).href;

export function useCopyInviteLink(onSuccess?: (message: string) => void) {
  const inviteUrl = useSyncExternalStore(subscribe, getBrowserInviteUrl, () => invitePath);
  const [feedback, setFeedback] = useState("");

  async function copyLink() {
    setFeedback("");
    try {
      await navigator.clipboard.writeText(getBrowserInviteUrl());
    } catch {
      setFeedback("초대 링크를 복사하지 못했어요.");
      return;
    }

    const message = "초대 링크를 복사했어요.";
    if (onSuccess) onSuccess(message);
    else setFeedback(message);
  }

  return { inviteUrl, copyLink, feedback };
}
