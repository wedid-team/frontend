"use client";

/**
 * 내정보 01 (피그마 이름 "내정보 3") · 내정보 02 연결 해제 (피그마 677:15976)
 * 관련 정책: C-07 프로필 드롭다운 / C-08 위험 동작 확인 / P-10 연결 해제 / U-08 로그아웃은 확인 없이
 */
import { Button } from "@/src/components/common";
import { useState } from "react";
import { LogoutIcon, RefreshIcon, UnlinkIcon, UsersIcon } from "../../planner/components/icons";
import { Avatar, Dialog, cx } from "../../planner/components/ui";
import ui from "../../planner/components/ui.module.css";
import { usePlannerStore, useToastStore } from "../../planner/stores/plannerStore";
import { formatWon } from "../../planner/utils/money";
import { resolveWeddingDate } from "../../planner/utils/schedule";
import styles from "./myInfo.module.css";

const PROVIDER_LABEL = { kakao: "카카오", google: "구글" } as const;

export function MyInfoView() {
  const state = usePlannerStore();
  const disconnectPartner = usePlannerStore((store) => store.disconnectPartner);
  const showToast = useToastStore((store) => store.showToast);
  const [isDisconnectOpen, setDisconnectOpen] = useState(false);
  const wedding = resolveWeddingDate(state.weddingDate, new Date());

  const planSummary = [
    state.conditions.regionLabel,
    state.conditions.guestLabel ?? "하객 수 미정",
    wedding.isUndecided ? "예식일 미정" : wedding.monthLabel,
    state.budget === null ? "예산 미입력" : `예산 ${formatWon(state.budget)}`,
  ].join(" · ");

  return (
    <>
      <header className={styles.header}>
        <p className={ui.eyebrow}>계정</p>
        <h1 className={ui.pageTitle}>내 정보</h1>
        <p className={ui.pageLead}>계정과 짝꿍 연결, 우리 결혼 계획을 관리해요.</p>
      </header>

      <div className={styles.cards}>
        <section className={ui.card}>
          <h2 className={ui.cardTitle}>계정</h2>
          <dl className={cx(ui.definitionList, styles.list)}>
            <div className={ui.definitionList__row}>
              <dt className={ui.definitionList__term}>이름</dt>
              {/* MOCK: 소셜 로그인 프로필 이름 (C-06) */}
              <dd className={ui.definitionList__value}>{state.me.fullName}</dd>
            </div>
            <div className={ui.definitionList__row}>
              <dt className={ui.definitionList__term}>로그인 수단</dt>
              <dd className={cx(ui.definitionList__value, styles.provider)}>
                <span
                  className={cx(
                    styles.provider__mark,
                    styles[`provider__mark--${state.me.loginProvider}`],
                  )}
                >
                  {state.me.loginProvider === "kakao" ? "K" : "G"}
                </span>
                {PROVIDER_LABEL[state.me.loginProvider]}
              </dd>
            </div>
          </dl>
        </section>

        <section className={ui.card}>
          <h2 className={ui.cardTitle}>함께 준비</h2>
          {state.partner ? (
            <div className={styles.partner}>
              <Avatar name={state.partner.name} role="partner" />
              <span className={styles.partner__copy}>
                <strong>연결된 짝꿍: {state.partner.name}</strong>
                <span>{PROVIDER_LABEL[state.partner.loginProvider]}로 로그인</span>
              </span>
              <Button size="md" variant="outline" onClick={() => setDisconnectOpen(true)}>
                <UnlinkIcon size={16} />
                연결 해제
              </Button>
            </div>
          ) : (
            <div className={styles.partner}>
              <span aria-hidden="true" className={styles.partner__empty}>
                <UsersIcon size={16} />
              </span>
              <span className={styles.partner__copy}>
                <strong>연결된 짝꿍이 없어요</strong>
                <span>로드맵에서 [짝꿍 초대]로 초대할 수 있어요</span>
              </span>
            </div>
          )}
        </section>

        <section className={ui.card}>
          <h2 className={ui.cardTitle}>우리 결혼 계획</h2>
          <p className={styles.plan}>{planSummary}</p>
          {/* TODO: C-08 "조건 다시 입력" 확인 모달 — 피그마 화면 없음, 확인 필요 */}
          <Button size="md" variant="outline" className={styles.plan__button}>
            <RefreshIcon size={16} />
            조건 다시 입력하기
          </Button>
        </section>
      </div>

      <div className={styles.footer}>
        <span>데이터 출처: 한국소비자원 참가격 결혼서비스 통계</span>
        {/* TODO: 로그아웃 API 연결 (U-08 확인 없이 로그아웃) */}
        <button className={ui.textLink} type="button">
          <LogoutIcon size={14} />
          로그아웃
        </button>
      </div>

      {state.partner && (
        <Dialog
          labelledBy="disconnect-title"
          onClose={() => setDisconnectOpen(false)}
          open={isDisconnectOpen}
          variant="narrow"
        >
          <span
            className={cx(
              ui.iconTile,
              ui["iconTile--hero"],
              ui["iconTile--danger"],
              ui.dialog__iconTile,
            )}
          >
            <UnlinkIcon size={22} />
          </span>
          <h2 className={ui.dialog__title} id="disconnect-title">
            짝꿍 연결을 해제할까요?
          </h2>
          <p className={ui.dialog__description}>
            {state.partner.name} 님은 더 이상 이 계획을 볼 수 없어요. 다시 초대하면 연결할 수
            있어요.
          </p>
          <div className={ui.dialog__actions}>
            <Button size="lg" variant="outline" onClick={() => setDisconnectOpen(false)}>
              취소
            </Button>
            <Button
              size="lg"
              variant="primary"
              className={ui.dangerButton}
              onClick={() => {
                disconnectPartner();
                setDisconnectOpen(false);
                showToast("짝꿍 연결을 해제했어요"); // COM 토스트
              }}
            >
              연결 해제
            </Button>
          </div>
        </Dialog>
      )}
    </>
  );
}
