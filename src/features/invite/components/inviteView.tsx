"use client";

/**
 * 초대 02 합류 · 03 로그인 · 04 링크 만료 · 05 이미 연결됨 (피그마 677:15976)
 * 관련 정책: P-05 계획 있는 사람의 합류 / P-08 초대 합류 예외 / C-11 로그인 고지 / U-04 상태 템플릿
 * MOCK: 토큰이 "expired"면 만료, "connected"면 이미 연결됨 화면. 실제 판정은 BE 응답으로 교체.
 */
import { Button } from "@/src/components/common";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  AlertCircleIcon,
  ChatIcon,
  LinkIcon,
  MailIcon,
  UsersIcon,
} from "../../planner/components/icons";
import { Dialog, cx } from "../../planner/components/ui";
import ui from "../../planner/components/ui.module.css";
import { INVITEE_HAS_PLAN_MOCK, INVITE_PLAN_SUMMARY_MOCK } from "../../planner/mocks/plannerMock";
import { useToastStore } from "../../planner/stores/plannerStore";
import { PLANNER_ROUTES } from "../../planner/routes";
import { formatRange } from "../../planner/utils/money";
import type { InviteStatus } from "../utils/inviteStatus";
import styles from "./invite.module.css";

export function InviteView({ status }: { status: InviteStatus }) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {status === "valid" && <InviteJoin />}
        {status === "expired" && (
          <InviteState
            actionHref="/"
            actionLabel="처음 화면으로"
            description="짝꿍에게 새 링크를 요청해 주세요"
            icon={<LinkIcon size={22} />}
            title="초대 링크가 만료됐어요"
            tone="neutral"
          />
        )}
        {status === "connected" && (
          <InviteState
            actionHref={PLANNER_ROUTES.roadmap}
            actionLabel="내 로드맵으로"
            description="연결을 해제한 뒤 다시 초대할 수 있어요"
            icon={<UsersIcon size={22} />}
            title="이미 짝꿍과 연결된 계획이에요"
            tone="brand"
          />
        )}
      </main>
      <footer className={styles.footer}>
        <p>데이터 출처: 한국소비자원 참가격 결혼서비스 통계</p>
        <p>이용약관 · 개인정보처리방침 · 정보 정정 요청</p>
      </footer>
    </div>
  );
}

function InviteJoin() {
  const summary = INVITE_PLAN_SUMMARY_MOCK;
  const [isLoginOpen, setLoginOpen] = useState(false);

  return (
    <div className={styles.join}>
      <span className={cx(ui.iconTile, ui["iconTile--large"], ui["iconTile--champagne"])}>
        <MailIcon size={20} />
      </span>
      <h1 className={styles.join__title}>
        {summary.inviterName}님이 함께 결혼 준비를
        <br />
        하자고 초대했어요
      </h1>
      <p className={styles.join__lead}>
        로그인하면 같은 로드맵에서 할 일을 나누고, 예산을 함께 관리할 수 있어요.
      </p>

      {/* P-05 · SCR-11-B: 들어온 사람에게 계획이 있을 때만 */}
      {INVITEE_HAS_PLAN_MOCK && (
        <p className={styles.join__warning}>
          <AlertCircleIcon size={15} />
          이미 만든 계획이 있다면, 합류하면 내 계획은 사라져요
        </p>
      )}

      <section className={styles.summary}>
        <p className={styles.summary__eyebrow}>우리 결혼 계획</p>
        <h2 className={styles.summary__title}>{summary.planTitle}</h2>
        <dl className={ui.definitionList}>
          <div className={ui.definitionList__row}>
            <dt className={ui.definitionList__term}>예상 총비용</dt>
            <dd className={ui.definitionList__value}>{formatRange(summary.estimate)}</dd>
          </div>
          <div className={ui.definitionList__row}>
            <dt className={ui.definitionList__term}>다음 할 일</dt>
            <dd className={ui.definitionList__value}>{summary.nextTodo}</dd>
          </div>
          <div className={ui.definitionList__row}>
            <dt className={ui.definitionList__term}>진행 중인 할 일</dt>
            <dd className={ui.definitionList__value}>{summary.openTodos}</dd>
          </div>
        </dl>
      </section>

      <div className={styles.join__actions}>
        <Button
          size="lg"
          variant="kakao"
          className={ui.fullWidth}
          onClick={() => setLoginOpen(true)}
        >
          <ChatIcon size={16} />
          카카오로 로그인하고 함께하기
        </Button>
        <Button
          size="lg"
          variant="outline"
          className={ui.fullWidth}
          onClick={() => setLoginOpen(true)}
        >
          구글로 로그인하고 함께하기
        </Button>
      </div>
      <p className={styles.legal}>
        계속하면 이용약관에 동의하고 개인정보처리방침을 확인한 것으로 봐요. 만 14세 이상만 이용할 수
        있어요.
      </p>

      <InviteLoginModal onClose={() => setLoginOpen(false)} open={isLoginOpen} />
    </div>
  );
}

/** 초대 03 로그인 — C-04 로그인 모달 재사용 대상. A파트 로그인 모달이 나오면 그걸로 교체 */
function InviteLoginModal({ onClose, open }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);

  // TODO: 실제 소셜 로그인 + 합류 API 연결 (A파트 로그인 · BE 인증)
  // SCR-11-B: 합류 → 로드맵(SCR-06) + 토스트 "○○님과 함께 준비를 시작했어요"
  const loginAndJoin = () => {
    onClose();
    showToast(`${INVITE_PLAN_SUMMARY_MOCK.inviterName}님과 함께 준비를 시작했어요`);
    router.push(PLANNER_ROUTES.roadmap);
  };

  return (
    <Dialog labelledBy="invite-login-title" onClose={onClose} open={open}>
      <p className={ui.dialog__eyebrow}>로그인</p>
      <span className={cx(ui.iconTile, ui["iconTile--large"])}>
        <MailIcon size={22} />
      </span>
      <h2 className={cx(ui.dialog__title, styles.modalTitle)} id="invite-login-title">
        로그인하고
        <br />
        함께 준비해요
      </h2>
      <p className={ui.dialog__description}>같은 로드맵에서 할 일을 나누고 예산을 함께 관리해요.</p>
      <div className={styles.loginButtons}>
        <Button size="lg" variant="kakao" className={ui.fullWidth} onClick={loginAndJoin}>
          <ChatIcon size={16} />
          카카오로 계속하기
        </Button>
        <Button size="lg" variant="outline" className={ui.fullWidth} onClick={loginAndJoin}>
          구글로 계속하기
        </Button>
      </div>
      <p className={styles.legal}>
        계속하면 이용약관에 동의하고 개인정보처리방침을 확인한 것으로 봐요. 만 14세 이상만 이용할 수
        있어요.
      </p>
    </Dialog>
  );
}

/** U-04 상태 템플릿 (초대 링크 만료 · 이미 짝꿍 연결됨) */
function InviteState({
  actionHref,
  actionLabel,
  description,
  icon,
  title,
  tone,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  tone: "neutral" | "brand";
}) {
  return (
    <section className={styles.state}>
      <span
        className={cx(
          ui.iconTile,
          ui["iconTile--hero"],
          tone === "neutral" && ui["iconTile--neutral"],
        )}
      >
        {icon}
      </span>
      <h1 className={styles.state__title}>{title}</h1>
      <p className={styles.state__desc}>{description}</p>
      <Link className={cx(ui.button, ui["button--sm"], ui["button--dark"])} href={actionHref}>
        {actionLabel}
      </Link>
    </section>
  );
}
