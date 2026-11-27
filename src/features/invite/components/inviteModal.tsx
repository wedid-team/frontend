"use client";

/**
 * 초대 01 초대 팝업 (피그마 677:15984)
 * 확인 필요: 정책 P-06은 "모달 없이 [초대 링크 복사] + 토스트(MVP)"인데 피그마는 팝업 + [카카오톡으로 보내기].
 * 피그마 기준으로 만들고, 카카오톡 공유는 MVP 범위 밖이라 버튼만 두었다.
 */
import { Button } from "@/src/components/common";
import Link from "next/link";
import { ChatIcon, CopyIcon, LinkIcon, UsersIcon } from "../../planner/components/icons";
import { Dialog, cx } from "../../planner/components/ui";
import ui from "../../planner/components/ui.module.css";
import { invitePath, useCopyInviteLink } from "../hooks/useCopyInviteLink";
import styles from "./invite.module.css";

export function InviteModal({ onClose }: { onClose: () => void }) {
  const { inviteUrl, copyLink, feedback } = useCopyInviteLink();

  return (
    <Dialog labelledBy="invite-title" onClose={onClose} open>
      <span className={cx(ui.iconTile, ui["iconTile--large"])}>
        <UsersIcon size={24} />
      </span>
      <h2 className={cx(ui.dialog__title, styles.modalTitle)} id="invite-title">
        짝꿍 초대하기
      </h2>
      <p className={ui.dialog__description}>
        링크를 받은 짝꿍이 로그인하면 같은 로드맵을 함께 관리할 수 있어요.
      </p>

      <div className={styles.linkBox}>
        <LinkIcon className={styles.linkBox__icon} size={16} />
        <span className={styles.linkBox__url} title={inviteUrl}>
          {inviteUrl}
        </span>
        <Button size="sm" variant="dark" onClick={copyLink}>
          <CopyIcon size={14} />
          복사
        </Button>
      </div>
      <div role="status">{feedback && <p className={styles.modalFootnote}>{feedback}</p>}</div>

      {/* TODO: 카카오톡 공유는 MVP 범위 밖 (정책 정의서 "MVP 범위 밖") — 기능 연결 안 함 */}
      <Button size="lg" variant="kakao" className={cx(ui.fullWidth, styles.kakaoButton)}>
        <ChatIcon size={16} />
        카카오톡으로 보내기
      </Button>

      <p className={styles.modalFootnote}>
        초대 링크는 7일 동안 유효해요.{" "}
        <Link className={styles.modalFootnote__link} href={invitePath}>
          받는 사람 화면 보기
        </Link>
      </p>
    </Dialog>
  );
}
