import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/src/components/common";
import { PLANNER_ROUTES } from "@/src/features/planner/routes";
import type { UtLoginProvider } from "@/src/stores/utAuthStore";
import { assets } from "../../assets";
import { loginToPlanner } from "../../loginToPlanner";
import { firstVisitHref } from "../../model";
import { FlowIcon } from "../layout/flowUi";
import styles from "./savePlanLoginModal.module.css";

export function SavePlanLoginModal({
  onClose,
  restoreOnly = false,
}: {
  onClose: () => void;
  restoreOnly?: boolean;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState(false);

  async function login(provider: UtLoginProvider) {
    if (pending) return;
    setPending(true);
    const hasSavedPlan = await loginToPlanner(provider, restoreOnly);
    onClose();
    router.push(hasSavedPlan ? PLANNER_ROUTES.roadmap : firstVisitHref("region"));
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.loginDialog}
      aria-labelledby="loginTitle"
      aria-describedby="loginDescription"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!first) {
          event.preventDefault();
          return;
        }
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.loginContent}>
        <p className={styles.loginEyebrow}>로그인</p>
        <span className={styles.loginIcon}>
          <FlowIcon icon={assets.icons.loginHeart} />
        </span>
        <h2 id="loginTitle">
          {restoreOnly ? "저장한 계획을 열려면" : "계획을 저장하려면"}
          <br />
          로그인해 주세요
        </h2>
        <p id="loginDescription">
          {restoreOnly
            ? "로그인하면 이 브라우저에 저장된 로드맵을 열 수 있어요."
            : "저장하면 로드맵을 계속 관리하고, 짝꿍과 함께 볼 수 있어요."}
        </p>
        <div className={styles.loginProviders}>
          <Button size="lg" variant="kakao" disabled={pending} onClick={() => void login("kakao")}>
            <FlowIcon icon={assets.icons.chat} />
            카카오로 계속하기
          </Button>
          <Button
            size="lg"
            variant="outline"
            disabled={pending}
            onClick={() => void login("google")}
          >
            구글로 계속하기
          </Button>
        </div>
        <p className={styles.loginPolicy}>
          사용자 테스트용 로그인입니다.
          <br />
          계속하면 이용약관에 동의하고 개인정보처리방침을 확인한 것으로 봐요.
          <br />만 14세 이상만 이용할 수 있어요.
        </p>
        <button className={styles.closeLogin} aria-label="로그인 닫기" onClick={onClose} autoFocus>
          <FlowIcon icon={assets.icons.close} />
        </button>
      </div>
    </dialog>
  );
}
