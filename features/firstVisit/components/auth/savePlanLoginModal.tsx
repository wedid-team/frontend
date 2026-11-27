import { useEffect, useRef } from "react";
import { Button } from "@/src/components/common";
import { assets } from "../../assets";
import { FlowIcon } from "../layout/flowUi";
import styles from "./savePlanLoginModal.module.css";

export function SavePlanLoginModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
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
          계획을 저장하려면
          <br />
          로그인해 주세요
        </h2>
        <p id="loginDescription">저장하면 로드맵을 계속 관리하고, 짝꿍과 함께 볼 수 있어요.</p>
        <div className={styles.loginProviders}>
          <Button size="lg" variant="kakao" disabled title="로그인 연동을 준비 중이에요">
            <FlowIcon icon={assets.icons.chat} />
            카카오로 계속하기
          </Button>
          <Button size="lg" variant="outline" disabled title="로그인 연동을 준비 중이에요">
            구글로 계속하기
          </Button>
        </div>
        <p className={styles.loginPolicy}>
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
