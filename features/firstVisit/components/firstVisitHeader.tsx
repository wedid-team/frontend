import { Button } from "@/src/components/common";
import { SiteHeader } from "@/src/components/layout";
import { assets } from "../assets";
import { Brand, FlowIcon, type FlowActions } from "./flowUi";
import styles from "./firstVisitHeader.module.css";

export function FirstVisitHeader({
  home = false,
  roadmap = false,
  navigate,
  openLogin,
}: FlowActions & { home?: boolean; roadmap?: boolean }) {
  return (
    <SiteHeader
      className={home ? styles.homeHeader : styles.flowHeader}
      slots={{
        start: (
          <div className={styles.headerStart}>
            <Brand large={home} onClick={() => navigate("home")} />
            {home ? (
              <nav aria-label="주요 메뉴">
                <button
                  onClick={() =>
                    document.getElementById("weddingPlan")?.scrollIntoView({
                      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                        ? "auto"
                        : "smooth",
                    })
                  }
                >
                  웨딩 플랜
                </button>
                <button onClick={() => navigate("roadmap")}>내 로드맵</button>
              </nav>
            ) : (
              <nav className={styles.breadcrumb} aria-label="현재 위치">
                <button onClick={() => navigate("home")}>{roadmap ? "홈" : "비용 계산"}</button>
                <FlowIcon icon={assets.icons.breadcrumb} />
                <strong>{roadmap ? "준비 로드맵" : "결과"}</strong>
              </nav>
            )}
          </div>
        ),
        actions: home ? (
          <div className={styles.headerActions}>
            <button aria-label="관심 업체 · 로그인" onClick={openLogin}>
              <FlowIcon icon={assets.icons.favorite} />
            </button>
            <button aria-label="로그인" onClick={openLogin}>
              <FlowIcon icon={assets.icons.account} />
            </button>
          </div>
        ) : (
          <div className={styles.headerActions}>
            {!roadmap && (
              <Button size="sm" variant="ghost" onClick={() => navigate("roadmap")}>
                내 로드맵
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={openLogin}>
              로그인
            </Button>
            <Button size="sm" onClick={openLogin}>
              계획 저장하기
            </Button>
          </div>
        ),
      }}
    />
  );
}
