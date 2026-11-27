"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useToastStore } from "../stores/plannerStore";
import type { Assignee, StepStatus } from "../types";
import { CheckIcon, CloseIcon } from "./icons";
import styles from "./ui.module.css";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const STATUS_LABEL: Record<StepStatus, string> = {
  upcoming: "시작 전",
  inProgress: "진행중",
  complete: "완료",
};

export function StatusPill({
  children,
  status,
  tone,
}: {
  status?: StepStatus;
  tone?: "progress" | "complete" | "overdue" | "onDark";
  children?: ReactNode;
}) {
  const resolvedTone = tone ?? (status === "complete" ? "complete" : "progress");
  return (
    <span className={cx(styles.statusPill, styles[`statusPill--${resolvedTone}`])}>
      {children ?? (status ? STATUS_LABEL[status] : null)}
    </span>
  );
}

export const ASSIGNEE_LABEL: Record<Assignee, string> = {
  me: "나",
  partner: "짝꿍",
  together: "함께",
};

export function AssigneeChip({ assignee }: { assignee: Assignee }) {
  return (
    <span className={cx(styles.assignee, styles[`assignee--${assignee}`])}>
      {ASSIGNEE_LABEL[assignee]}
    </span>
  );
}

export function Avatar({ name, role }: { name: string; role: "me" | "partner" }) {
  return (
    <span
      aria-hidden="true"
      className={cx(styles.avatar, role === "partner" && styles["avatar--partner"])}
    >
      {name.slice(0, 1)}
    </span>
  );
}

type DialogProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  variant?: "default" | "narrow" | "wide";
  children: ReactNode;
};

/** 공통 모달 틀: 바깥 클릭 · Esc · [×]로 닫힘. 닫으면 변화 없음 (C-03). */
export function Dialog({ children, labelledBy, onClose, open, variant = "default" }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // onClose는 부모가 그릴 때마다 새 함수가 될 수 있다.
  // effect 의존성에 넣으면 입력할 때마다 포커스가 모달 상자로 튀어서 입력이 끊긴다 → ref로 최신 값만 참조.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handleKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        aria-labelledby={labelledBy}
        aria-modal="true"
        className={cx(styles.dialog, variant !== "default" && styles[`dialog--${variant}`])}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        <button aria-label="닫기" className={styles.dialog__close} onClick={onClose} type="button">
          <CloseIcon size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

const TOAST_DURATION_MS = 3000;

/** U-06: 하단 가운데 · 3초 · 한 번에 1개 */
export function ToastHost() {
  const message = useToastStore((state) => state.message);
  const hideToast = useToastStore((state) => state.hideToast);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(hideToast, TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [hideToast, message]);

  if (!message) return null;

  return (
    <div aria-live="polite" className={styles.toast} role="status">
      <CheckIcon size={18} />
      {message}
    </div>
  );
}
